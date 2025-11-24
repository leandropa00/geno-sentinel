from __future__ import annotations

from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from genomics.application.dto.gene_dto import GeneResponseDto
from genomics.application.services.gene_service import GeneService
from genomics.core.exceptions import ApplicationError
from genomics.presentation.serializers.gene_serializers import (
    CreateGeneSerializer,
    GeneResponseSerializer,
    UpdateGeneSerializer,
)
from genomics.presentation.viewsets.base import ApplicationViewSet


class GeneViewSet(ApplicationViewSet):
    def __init__(self, **kwargs) -> None:  # pragma: no cover - DRF lifecycle
        super().__init__(**kwargs)
        self.service = GeneService()

    @extend_schema(
        responses=GeneResponseSerializer(many=True),
        tags=["Genes"],
        summary="Listar genes",
    )
    def list(self, request: Request) -> Response:
        try:
            dtos = self.service.list_genes()
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        serializer = GeneResponseSerializer(dtos, many=True)
        return Response(serializer.data)

    @extend_schema(
        responses=GeneResponseSerializer,
        tags=["Genes"],
        summary="Detalle de gen",
    )
    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        try:
            dto = self.service.get_gene(pk or "")
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        serializer = GeneResponseSerializer(dto)
        return Response(serializer.data)

    @extend_schema(
        request=CreateGeneSerializer,
        responses=GeneResponseSerializer,
        tags=["Genes"],
        summary="Crear gen",
    )
    def create(self, request: Request) -> Response:
        serializer = CreateGeneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            dto: GeneResponseDto = self.service.create_gene(serializer.to_dto())
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        response = GeneResponseSerializer(dto)
        return Response(response.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        request=UpdateGeneSerializer,
        responses=GeneResponseSerializer,
        tags=["Genes"],
        summary="Actualizar gen",
    )
    def update(self, request: Request, pk: str | None = None) -> Response:
        serializer = UpdateGeneSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            dto = self.service.update_gene(pk or "", serializer.to_dto())
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        response = GeneResponseSerializer(dto)
        return Response(response.data)

    @extend_schema(
        responses={204: OpenApiResponse(description="Gen eliminado")},
        tags=["Genes"],
        summary="Eliminar gen",
    )
    def destroy(self, request: Request, pk: str | None = None) -> Response:
        try:
            self.service.delete_gene(pk or "")
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        return Response(status=status.HTTP_204_NO_CONTENT)
