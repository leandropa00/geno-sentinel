from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, extend_schema_view

from src.presentation.api.serializers.gene_serializer import GeneSerializer, GeneCreateSerializer
from src.application.use_cases.gene_use_cases import (
    CreateGeneUseCase,
    GetGeneByIdUseCase,
    GetGeneBySymbolUseCase,
    ListGenesUseCase,
    DeleteGeneUseCase
)
from src.infrastructure.persistence.django_orm.gene_repository_impl import DjangoGeneRepository


@extend_schema_view(
    list=extend_schema(description="Lista todos los genes"),
    retrieve=extend_schema(description="Obtiene un gen por ID"),
    create=extend_schema(
        description="Crea un nuevo gen",
        request=GeneCreateSerializer,
        responses={201: GeneSerializer}
    ),
    destroy=extend_schema(description="Elimina un gen"),
)
class GeneViewSet(viewsets.ViewSet):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.gene_repository = DjangoGeneRepository()

    def list(self, request):
        use_case = ListGenesUseCase(self.gene_repository)
        genes = use_case.execute()
        serializer = GeneSerializer(genes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        use_case = GetGeneByIdUseCase(self.gene_repository)
        gene = use_case.execute(pk)

        if not gene:
            return Response(
                {"detail": "Gene not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = GeneSerializer(gene)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = GeneCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        gene_id = serializer.validated_data.get('id') or serializer.validated_data['symbol']

        use_case = CreateGeneUseCase(self.gene_repository)
        gene = use_case.execute(
            gene_id=gene_id,
            symbol=serializer.validated_data['symbol'],
            full_name=serializer.validated_data['full_name'],
            function_summary=serializer.validated_data['function_summary']
        )

        response_serializer = GeneSerializer(gene)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        use_case = DeleteGeneUseCase(self.gene_repository)
        deleted = use_case.execute(pk)

        if not deleted:
            return Response(
                {"detail": "Gene not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        description="Busca un gen por su símbolo",
        responses={200: GeneSerializer}
    )
    @action(detail=False, methods=['get'], url_path='symbol/(?P<symbol>[^/.]+)')
    def by_symbol(self, request, symbol=None):
        use_case = GetGeneBySymbolUseCase(self.gene_repository)
        gene = use_case.execute(symbol)

        if not gene:
            return Response(
                {"detail": "Gene not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = GeneSerializer(gene)
        return Response(serializer.data, status=status.HTTP_200_OK)
