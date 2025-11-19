from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, extend_schema_view
from uuid import UUID

from src.presentation.api.serializers.genetic_variant_serializer import (
    GeneticVariantSerializer,
    GeneticVariantCreateSerializer
)
from src.application.use_cases.genetic_variant_use_cases import (
    CreateGeneticVariantUseCase,
    GetGeneticVariantByIdUseCase,
    ListGeneticVariantsByGeneUseCase,
    ListGeneticVariantsUseCase,
    DeleteGeneticVariantUseCase
)
from src.infrastructure.persistence.django_orm.genetic_variant_repository_impl import DjangoGeneticVariantRepository


@extend_schema_view(
    list=extend_schema(description="Lista todas las variantes genéticas"),
    retrieve=extend_schema(description="Obtiene una variante por ID"),
    create=extend_schema(
        description="Crea una nueva variante genética",
        request=GeneticVariantCreateSerializer,
        responses={201: GeneticVariantSerializer}
    ),
    destroy=extend_schema(description="Elimina una variante"),
)
class GeneticVariantViewSet(viewsets.ViewSet):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.variant_repository = DjangoGeneticVariantRepository()

    def list(self, request):
        use_case = ListGeneticVariantsUseCase(self.variant_repository)
        variants = use_case.execute()
        serializer = GeneticVariantSerializer(variants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        try:
            variant_id = UUID(pk)
        except ValueError:
            return Response(
                {"detail": "Invalid UUID format"},
                status=status.HTTP_400_BAD_REQUEST
            )

        use_case = GetGeneticVariantByIdUseCase(self.variant_repository)
        variant = use_case.execute(variant_id)

        if not variant:
            return Response(
                {"detail": "Variant not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = GeneticVariantSerializer(variant)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = GeneticVariantCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        use_case = CreateGeneticVariantUseCase(self.variant_repository)
        variant = use_case.execute(**serializer.validated_data)

        response_serializer = GeneticVariantSerializer(variant)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        try:
            variant_id = UUID(pk)
        except ValueError:
            return Response(
                {"detail": "Invalid UUID format"},
                status=status.HTTP_400_BAD_REQUEST
            )

        use_case = DeleteGeneticVariantUseCase(self.variant_repository)
        deleted = use_case.execute(variant_id)

        if not deleted:
            return Response(
                {"detail": "Variant not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        description="Lista variantes de un gen específico",
        responses={200: GeneticVariantSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='gene/(?P<gene_id>[^/.]+)')
    def by_gene(self, request, gene_id=None):
        try:
            gene_uuid = UUID(gene_id)
        except ValueError:
            return Response(
                {"detail": "Invalid UUID format"},
                status=status.HTTP_400_BAD_REQUEST
            )

        use_case = ListGeneticVariantsByGeneUseCase(self.variant_repository)
        variants = use_case.execute(gene_uuid)

        serializer = GeneticVariantSerializer(variants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
