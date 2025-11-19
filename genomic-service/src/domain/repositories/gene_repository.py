from abc import ABC, abstractmethod
from typing import List, Optional
from src.domain.entities.gene import Gene


class GeneRepository(ABC):
    @abstractmethod
    def save(self, gene: Gene) -> Gene:
        pass

    @abstractmethod
    def find_by_id(self, gene_id: str) -> Optional[Gene]:
        pass

    @abstractmethod
    def find_by_symbol(self, symbol: str) -> Optional[Gene]:
        pass

    @abstractmethod
    def find_all(self) -> List[Gene]:
        pass

    @abstractmethod
    def delete(self, gene_id: str) -> bool:
        pass
