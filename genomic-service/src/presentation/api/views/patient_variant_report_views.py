from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, extend_schema_view
from uuid import UUID

from src.presentation.api.serializers.patient_variant_report_serializer import (
    PatientVariantReportSerializer,
    PatientVariantReportCreateSerializer
)
from src.application.use_cases.patient_variant_report_use_cases import (
    CreatePatientVariantReportUseCase,
    GetPatientVariantReportByIdUseCase,
    ListPatientVariantReportsByPatientUseCase,
    ListPatientVariantReportsUseCase,
    DeletePatientVariantReportUseCase
)
from src.infrastructure.persistence.django_orm.patient_variant_report_repository_impl import (
    DjangoPatientVariantReportRepository
)


@extend_schema_view(
    list=extend_schema(description="Lista todos los reportes de variantes"),
    retrieve=extend_schema(description="Obtiene un reporte por ID"),
    create=extend_schema(
        description="Crea un nuevo reporte de variante",
        request=PatientVariantReportCreateSerializer,
        responses={201: PatientVariantReportSerializer}
    ),
    destroy=extend_schema(description="Elimina un reporte"),
)
class PatientVariantReportViewSet(viewsets.ViewSet):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.report_repository = DjangoPatientVariantReportRepository()

    def list(self, request):
        use_case = ListPatientVariantReportsUseCase(self.report_repository)
        reports = use_case.execute()
        serializer = PatientVariantReportSerializer(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        try:
            report_id = UUID(pk)
        except ValueError:
            return Response(
                {"detail": "Invalid UUID format"},
                status=status.HTTP_400_BAD_REQUEST
            )

        use_case = GetPatientVariantReportByIdUseCase(self.report_repository)
        report = use_case.execute(report_id)

        if not report:
            return Response(
                {"detail": "Report not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = PatientVariantReportSerializer(report)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = PatientVariantReportCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        use_case = CreatePatientVariantReportUseCase(self.report_repository)
        report = use_case.execute(**serializer.validated_data)

        response_serializer = PatientVariantReportSerializer(report)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        try:
            report_id = UUID(pk)
        except ValueError:
            return Response(
                {"detail": "Invalid UUID format"},
                status=status.HTTP_400_BAD_REQUEST
            )

        use_case = DeletePatientVariantReportUseCase(self.report_repository)
        deleted = use_case.execute(report_id)

        if not deleted:
            return Response(
                {"detail": "Report not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        description="Lista reportes de un paciente específico",
        responses={200: PatientVariantReportSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], url_path='patient/(?P<patient_id>[^/.]+)')
    def by_patient(self, request, patient_id=None):
        try:
            patient_uuid = UUID(patient_id)
        except ValueError:
            return Response(
                {"detail": "Invalid UUID format"},
                status=status.HTTP_400_BAD_REQUEST
            )

        use_case = ListPatientVariantReportsByPatientUseCase(self.report_repository)
        reports = use_case.execute(patient_uuid)

        serializer = PatientVariantReportSerializer(reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
