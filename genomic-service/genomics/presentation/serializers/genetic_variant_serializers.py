from __future__ import annotations

from rest_framework import serializers

from genomics.application.dto.genetic_variant_dto import (
    CreateGeneticVariantDto,
    GeneticVariantResponseDto,
    UpdateGeneticVariantDto,
)

_variant_impacts = [
    "Missense",
    "Frameshift",
    "Nonsense",
    "Silent",
    "Synonymous",
    "Non-synonymous",
    "Splice Site",
    "Intronic",
    "UTR",
    "Other",
]


class CreateGeneticVariantSerializer(serializers.Serializer):
    geneId = serializers.CharField()
    chromosome = serializers.CharField(max_length=16)
    position = serializers.IntegerField(min_value=1)
    referenceBase = serializers.CharField(max_length=1)
    alternateBase = serializers.CharField(max_length=1)
    impact = serializers.ChoiceField(choices=_variant_impacts)

    def to_dto(self) -> CreateGeneticVariantDto:
        return CreateGeneticVariantDto(
            gene_id=self.validated_data["geneId"],
            chromosome=self.validated_data["chromosome"],
            position=self.validated_data["position"],
            reference_base=self.validated_data["referenceBase"],
            alternate_base=self.validated_data["alternateBase"],
            impact=self.validated_data["impact"],
        )


class UpdateGeneticVariantSerializer(serializers.Serializer):
    geneId = serializers.CharField(required=False)
    chromosome = serializers.CharField(max_length=16, required=False)
    position = serializers.IntegerField(min_value=1, required=False)
    referenceBase = serializers.CharField(max_length=1, required=False)
    alternateBase = serializers.CharField(max_length=1, required=False)
    impact = serializers.ChoiceField(choices=_variant_impacts, required=False)

    def to_dto(self) -> UpdateGeneticVariantDto:
        return UpdateGeneticVariantDto(
            gene_id=self.validated_data.get("geneId"),
            chromosome=self.validated_data.get("chromosome"),
            position=self.validated_data.get("position"),
            reference_base=self.validated_data.get("referenceBase"),
            alternate_base=self.validated_data.get("alternateBase"),
            impact=self.validated_data.get("impact"),
        )


class GeneticVariantResponseSerializer(serializers.Serializer):
    id = serializers.CharField()
    geneId = serializers.CharField()
    chromosome = serializers.CharField()
    position = serializers.IntegerField()
    referenceBase = serializers.CharField()
    alternateBase = serializers.CharField()
    impact = serializers.CharField()
    createdAt = serializers.DateTimeField(allow_null=True)
    updatedAt = serializers.DateTimeField(allow_null=True)
    gene = serializers.DictField(required=False, allow_null=True)

    def to_representation(self, instance: GeneticVariantResponseDto | dict):
        if isinstance(instance, GeneticVariantResponseDto):
            return instance.to_representation()
        return instance
