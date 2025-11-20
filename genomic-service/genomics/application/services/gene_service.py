from __future__ import annotations

from typing import List

from genomics.application.dto.gene_dto import (
    CreateGeneDto,
    GeneResponseDto,
    UpdateGeneDto,
)
from genomics.domain.entities import Gene
from genomics.infrastructure.repositories.gene_repository import GeneRepository


class GeneService:
    def __init__(self, repository: GeneRepository | None = None) -> None:
        self.repository = repository or GeneRepository()

    def list_genes(self) -> List[GeneResponseDto]:
        genes = self.repository.list()
        return [GeneResponseDto.from_entity(gene) for gene in genes]

    def get_gene(self, gene_id: str) -> GeneResponseDto:
        gene = self.repository.get_by_id(gene_id)
        return GeneResponseDto.from_entity(gene)

    def create_gene(self, dto: CreateGeneDto) -> GeneResponseDto:
        entity: Gene = dto.to_entity()
        created = self.repository.create(entity)
        return GeneResponseDto.from_entity(created)

    def update_gene(self, gene_id: str, dto: UpdateGeneDto) -> GeneResponseDto:
        gene = self.repository.get_by_id(gene_id)
        updated_entity = dto.apply(gene)
        saved = self.repository.update(updated_entity)
        return GeneResponseDto.from_entity(saved)

    def delete_gene(self, gene_id: str) -> None:
        self.repository.delete(gene_id)
