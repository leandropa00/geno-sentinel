from __future__ import annotations

from rest_framework import serializers

from genomics.application.dto.gene_dto import (
    CreateGeneDto,
    GeneResponseDto,
    UpdateGeneDto,
)


class CreateGeneSerializer(serializers.Serializer):
    symbol = serializers.CharField(max_length=32)
    fullName = serializers.CharField(max_length=255)
    functionSummary = serializers.CharField()

    def to_dto(self) -> CreateGeneDto:
        return CreateGeneDto(
            symbol=self.validated_data["symbol"],
            full_name=self.validated_data["fullName"],
            function_summary=self.validated_data["functionSummary"],
        )


class UpdateGeneSerializer(serializers.Serializer):
    symbol = serializers.CharField(max_length=32, required=False)
    fullName = serializers.CharField(max_length=255, required=False)
    functionSummary = serializers.CharField(required=False)

    def to_dto(self) -> UpdateGeneDto:
        return UpdateGeneDto(
            symbol=self.validated_data.get("symbol"),
            full_name=self.validated_data.get("fullName"),
            function_summary=self.validated_data.get("functionSummary"),
        )


class GeneResponseSerializer(serializers.Serializer):
    id = serializers.CharField()
    symbol = serializers.CharField()
    fullName = serializers.CharField()
    functionSummary = serializers.CharField()
    createdAt = serializers.DateTimeField(allow_null=True)
    updatedAt = serializers.DateTimeField(allow_null=True)

    def to_representation(self, instance: GeneResponseDto | dict):
        if isinstance(instance, GeneResponseDto):
            payload = instance.to_representation()
        else:
            payload = instance
        return payload
