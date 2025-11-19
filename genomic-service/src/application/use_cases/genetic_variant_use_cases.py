from typing import List, Optional
from uuid import UUID, uuid4
from src.domain.entities.genetic_variant import GeneticVariant
from src.domain.repositories.genetic_variant_repository import GeneticVariantRepository


class CreateGeneticVariantUseCase:
    def __init__(self, variant_repository: GeneticVariantRepository):
        self.variant_repository = variant_repository

    def execute(self, gene_id: UUID, chromosome: str, position: int,
                reference_base: str, alternate_base: str, impact: str) -> GeneticVariant:
        variant = GeneticVariant(
            id=uuid4(),
            gene_id=gene_id,
            chromosome=chromosome,
            position=position,
            reference_base=reference_base,
            alternate_base=alternate_base,
            impact=impact
        )
        return self.variant_repository.save(variant)


class GetGeneticVariantByIdUseCase:
    def __init__(self, variant_repository: GeneticVariantRepository):
        self.variant_repository = variant_repository

    def execute(self, variant_id: UUID) -> Optional[GeneticVariant]:
        return self.variant_repository.find_by_id(variant_id)


class ListGeneticVariantsByGeneUseCase:
    def __init__(self, variant_repository: GeneticVariantRepository):
        self.variant_repository = variant_repository

    def execute(self, gene_id: UUID) -> List[GeneticVariant]:
        return self.variant_repository.find_by_gene_id(gene_id)


class ListGeneticVariantsUseCase:
    def __init__(self, variant_repository: GeneticVariantRepository):
        self.variant_repository = variant_repository

    def execute(self) -> List[GeneticVariant]:
        return self.variant_repository.find_all()


class DeleteGeneticVariantUseCase:
    def __init__(self, variant_repository: GeneticVariantRepository):
        self.variant_repository = variant_repository

    def execute(self, variant_id: UUID) -> bool:
        return self.variant_repository.delete(variant_id)
