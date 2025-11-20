from __future__ import annotations

from typing import List, Optional

from genomics.application.dto.genetic_variant_dto import (
    CreateGeneticVariantDto,
    GeneticVariantResponseDto,
    UpdateGeneticVariantDto,
)
from genomics.core.exceptions import NotFoundError
from genomics.domain.entities import GeneticVariant
from genomics.infrastructure.repositories.gene_repository import GeneRepository
from genomics.infrastructure.repositories.genetic_variant_repository import (
    GeneticVariantRepository,
)


class GeneticVariantService:
    def __init__(
        self,
        variant_repository: GeneticVariantRepository | None = None,
        gene_repository: GeneRepository | None = None,
    ) -> None:
        self.variant_repository = variant_repository or GeneticVariantRepository()
        self.gene_repository = gene_repository or GeneRepository()

    def _build_gene_payload(self, gene_id: str) -> Optional[dict]:
        try:
            gene = self.gene_repository.get_by_id(gene_id)
        except NotFoundError:
            return None

        return {
            "id": gene.id,
            "symbol": gene.symbol,
            "fullName": gene.full_name,
        }

    def list_variants(self, *, gene_id: str | None = None) -> List[GeneticVariantResponseDto]:
        variants = self.variant_repository.list(gene_id=gene_id)
        response: List[GeneticVariantResponseDto] = []
        for variant in variants:
            payload = self._build_gene_payload(variant.gene_id)
            response.append(
                GeneticVariantResponseDto.from_entity(
                    variant=variant,
                    gene_payload=payload,
                )
            )
        return response

    def get_variant(self, variant_id: str) -> GeneticVariantResponseDto:
        variant = self.variant_repository.get_by_id(variant_id)
        payload = self._build_gene_payload(variant.gene_id)
        return GeneticVariantResponseDto.from_entity(variant, gene_payload=payload)

    def create_variant(self, dto: CreateGeneticVariantDto) -> GeneticVariantResponseDto:
        # Validate gene exists
        self.gene_repository.get_by_id(dto.gene_id)
        entity: GeneticVariant = dto.to_entity()
        created = self.variant_repository.create(entity)
        payload = self._build_gene_payload(created.gene_id)
        return GeneticVariantResponseDto.from_entity(created, gene_payload=payload)

    def update_variant(
        self,
        variant_id: str,
        dto: UpdateGeneticVariantDto,
    ) -> GeneticVariantResponseDto:
        variant = self.variant_repository.get_by_id(variant_id)
        if dto.gene_id:
            self.gene_repository.get_by_id(dto.gene_id)
        updated_entity = dto.apply(variant)
        saved = self.variant_repository.update(updated_entity)
        payload = self._build_gene_payload(saved.gene_id)
        return GeneticVariantResponseDto.from_entity(saved, gene_payload=payload)

    def delete_variant(self, variant_id: str) -> None:
        self.variant_repository.delete(variant_id)
