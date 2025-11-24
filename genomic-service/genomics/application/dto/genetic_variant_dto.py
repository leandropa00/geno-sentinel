from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Any, Dict

from genomics.domain.entities import GeneticVariant


@dataclass(slots=True)
class GeneticVariantResponseDto:
    id: str
    gene_id: str
    chromosome: str
    position: int
    reference_base: str
    alternate_base: str
    impact: str
    created_at: datetime | None
    updated_at: datetime | None
    gene: Dict[str, Any] | None = None

    @classmethod
    def from_entity(
        cls,
        variant: GeneticVariant,
        gene_payload: Dict[str, Any] | None = None,
    ) -> "GeneticVariantResponseDto":
        return cls(
            id=variant.id or "",
            gene_id=variant.gene_id,
            chromosome=variant.chromosome,
            position=variant.position,
            reference_base=variant.reference_base,
            alternate_base=variant.alternate_base,
            impact=variant.impact,
            created_at=variant.created_at,
            updated_at=variant.updated_at,
            gene=gene_payload,
        )

    def to_representation(self) -> Dict[str, Any]:
        data = asdict(self)
        data["geneId"] = data.pop("gene_id")
        data["referenceBase"] = data.pop("reference_base")
        data["alternateBase"] = data.pop("alternate_base")
        data["createdAt"] = data.pop("created_at")
        data["updatedAt"] = data.pop("updated_at")
        return data


@dataclass(slots=True)
class CreateGeneticVariantDto:
    gene_id: str
    chromosome: str
    position: int
    reference_base: str
    alternate_base: str
    impact: str

    def to_entity(self) -> GeneticVariant:
        return GeneticVariant(
            gene_id=self.gene_id,
            chromosome=self.chromosome,
            position=self.position,
            reference_base=self.reference_base,
            alternate_base=self.alternate_base,
            impact=self.impact,
        )


@dataclass(slots=True)
class UpdateGeneticVariantDto:
    gene_id: str | None = None
    chromosome: str | None = None
    position: int | None = None
    reference_base: str | None = None
    alternate_base: str | None = None
    impact: str | None = None

    def apply(self, variant: GeneticVariant) -> GeneticVariant:
        if self.gene_id is not None:
            variant.gene_id = self.gene_id
        if self.chromosome is not None:
            variant.chromosome = self.chromosome
        if self.position is not None:
            variant.position = self.position
        if self.reference_base is not None:
            variant.reference_base = self.reference_base
        if self.alternate_base is not None:
            variant.alternate_base = self.alternate_base
        if self.impact is not None:
            variant.impact = self.impact
        return variant
