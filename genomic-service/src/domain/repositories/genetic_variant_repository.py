from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID
from src.domain.entities.genetic_variant import GeneticVariant


class GeneticVariantRepository(ABC):
    @abstractmethod
    def save(self, variant: GeneticVariant) -> GeneticVariant:
        pass

    @abstractmethod
    def find_by_id(self, variant_id: UUID) -> Optional[GeneticVariant]:
        pass

    @abstractmethod
    def find_by_gene_id(self, gene_id: UUID) -> List[GeneticVariant]:
        pass

    @abstractmethod
    def find_by_chromosome(self, chromosome: str) -> List[GeneticVariant]:
        pass

    @abstractmethod
    def find_all(self) -> List[GeneticVariant]:
        pass

    @abstractmethod
    def delete(self, variant_id: UUID) -> bool:
        pass
