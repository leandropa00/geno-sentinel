from __future__ import annotations

from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from genomics.application.services.patient_variant_report_service import (
    PatientVariantReportService,
)
from genomics.core.exceptions import ApplicationError
from genomics.presentation.serializers.patient_variant_report_serializers import (
    CreatePatientVariantReportSerializer,
    PatientVariantReportResponseSerializer,
    UpdatePatientVariantReportSerializer,
)
from genomics.presentation.viewsets.base import ApplicationViewSet


class PatientVariantReportViewSet(ApplicationViewSet):
    def __init__(self, **kwargs) -> None:  # pragma: no cover
        super().__init__(**kwargs)
        self.service = PatientVariantReportService()

    @extend_schema(
        responses=PatientVariantReportResponseSerializer(many=True),
        tags=["Reportes de Pacientes"],
        summary="Listar reportes",
    )
    def list(self, request: Request) -> Response:
        patient_id = request.query_params.get("patientId")
        variant_id = request.query_params.get("variantId")
        try:
            dtos = self.service.list_reports(
                patient_id=patient_id,
                variant_id=variant_id,
            )
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        serializer = PatientVariantReportResponseSerializer(dtos, many=True)
        return Response(serializer.data)

    @extend_schema(
        responses=PatientVariantReportResponseSerializer,
        tags=["Reportes de Pacientes"],
        summary="Detalle del reporte",
    )
    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        try:
            dto = self.service.get_report(pk or "")
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        serializer = PatientVariantReportResponseSerializer(dto)
        return Response(serializer.data)

    @extend_schema(
        request=CreatePatientVariantReportSerializer,
        responses=PatientVariantReportResponseSerializer,
        tags=["Reportes de Pacientes"],
        summary="Crear reporte",
    )
    def create(self, request: Request) -> Response:
        serializer = CreatePatientVariantReportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            dto = self.service.create_report(serializer.to_dto())
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        response = PatientVariantReportResponseSerializer(dto)
        return Response(response.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        request=UpdatePatientVariantReportSerializer,
        responses=PatientVariantReportResponseSerializer,
        tags=["Reportes de Pacientes"],
        summary="Actualizar reporte",
    )
    def update(self, request: Request, pk: str | None = None) -> Response:
        serializer = UpdatePatientVariantReportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            dto = self.service.update_report(pk or "", serializer.to_dto())
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        response = PatientVariantReportResponseSerializer(dto)
        return Response(response.data)

    @extend_schema(
        responses={204: OpenApiResponse(description="Reporte eliminado")},
        tags=["Reportes de Pacientes"],
        summary="Eliminar reporte",
    )
    def destroy(self, request: Request, pk: str | None = None) -> Response:
        try:
            self.service.delete_report(pk or "")
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        responses=PatientVariantReportResponseSerializer(many=True),
        tags=["Reportes de Pacientes"],
        summary="Reportes por paciente",
    )
    @action(detail=False, methods=["get"], url_path=r"patient/(?P<patient_id>[^/.]+)")
    def by_patient(self, request: Request, patient_id: str) -> Response:
        try:
            dtos = self.service.list_reports(patient_id=patient_id)
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        serializer = PatientVariantReportResponseSerializer(dtos, many=True)
        return Response(serializer.data)

    @extend_schema(
        responses=PatientVariantReportResponseSerializer(many=True),
        tags=["Reportes de Pacientes"],
        summary="Reportes por variante",
    )
    @action(detail=False, methods=["get"], url_path=r"variant/(?P<variant_id>[^/.]+)")
    def by_variant(self, request: Request, variant_id: str) -> Response:
        try:
            dtos = self.service.list_reports(variant_id=variant_id)
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        serializer = PatientVariantReportResponseSerializer(dtos, many=True)
        return Response(serializer.data)
