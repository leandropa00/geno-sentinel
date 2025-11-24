from __future__ import annotations

from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from genomics.application.services.genetic_variant_service import GeneticVariantService
from genomics.core.exceptions import ApplicationError
from genomics.presentation.serializers.genetic_variant_serializers import (
    CreateGeneticVariantSerializer,
    GeneticVariantResponseSerializer,
    UpdateGeneticVariantSerializer,
)
from genomics.presentation.viewsets.base import ApplicationViewSet


class GeneticVariantViewSet(ApplicationViewSet):
    def __init__(self, **kwargs) -> None:  # pragma: no cover
        super().__init__(**kwargs)
        self.service = GeneticVariantService()

    @extend_schema(
        responses=GeneticVariantResponseSerializer(many=True),
        tags=["Variantes Genéticas"],
        summary="Listar variantes",
    )
    def list(self, request: Request) -> Response:
        gene_id = request.query_params.get("geneId")
        try:
            dtos = self.service.list_variants(gene_id=gene_id)
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        serializer = GeneticVariantResponseSerializer(dtos, many=True)
        return Response(serializer.data)

    @extend_schema(
        responses=GeneticVariantResponseSerializer,
        tags=["Variantes Genéticas"],
        summary="Detalle de variante",
    )
    def retrieve(self, request: Request, pk: str | None = None) -> Response:
        try:
            dto = self.service.get_variant(pk or "")
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        serializer = GeneticVariantResponseSerializer(dto)
        return Response(serializer.data)

    @extend_schema(
        request=CreateGeneticVariantSerializer,
        responses=GeneticVariantResponseSerializer,
        tags=["Variantes Genéticas"],
        summary="Crear variante",
    )
    def create(self, request: Request) -> Response:
        serializer = CreateGeneticVariantSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            dto = self.service.create_variant(serializer.to_dto())
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        response = GeneticVariantResponseSerializer(dto)
        return Response(response.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        request=UpdateGeneticVariantSerializer,
        responses=GeneticVariantResponseSerializer,
        tags=["Variantes Genéticas"],
        summary="Actualizar variante",
    )
    def update(self, request: Request, pk: str | None = None) -> Response:
        serializer = UpdateGeneticVariantSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            dto = self.service.update_variant(pk or "", serializer.to_dto())
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        response = GeneticVariantResponseSerializer(dto)
        return Response(response.data)

    @extend_schema(
        responses={204: OpenApiResponse(description="Variante eliminada")},
        tags=["Variantes Genéticas"],
        summary="Eliminar variante",
    )
    def destroy(self, request: Request, pk: str | None = None) -> Response:
        try:
            self.service.delete_variant(pk or "")
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        responses=GeneticVariantResponseSerializer(many=True),
        tags=["Variantes Genéticas"],
        summary="Listar variantes por gen",
    )
    @action(detail=False, methods=["get"], url_path=r"gene/(?P<gene_id>[^/.]+)")
    def by_gene(self, request: Request, gene_id: str) -> Response:
        try:
            dtos = self.service.list_variants(gene_id=gene_id)
        except ApplicationError as exc:
            return self.handle_application_error(exc)
        serializer = GeneticVariantResponseSerializer(dtos, many=True)
        return Response(serializer.data)
