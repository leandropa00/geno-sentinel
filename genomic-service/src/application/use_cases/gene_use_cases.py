from typing import List, Optional
from src.domain.entities.gene import Gene
from src.domain.repositories.gene_repository import GeneRepository


class CreateGeneUseCase:
    def __init__(self, gene_repository: GeneRepository):
        self.gene_repository = gene_repository

    def execute(self, gene_id: str, symbol: str, full_name: str, function_summary: str) -> Gene:
        gene = Gene(
            id=gene_id,
            symbol=symbol,
            full_name=full_name,
            function_summary=function_summary
        )
        return self.gene_repository.save(gene)


class GetGeneByIdUseCase:
    def __init__(self, gene_repository: GeneRepository):
        self.gene_repository = gene_repository

    def execute(self, gene_id: str) -> Optional[Gene]:
        return self.gene_repository.find_by_id(gene_id)


class GetGeneBySymbolUseCase:
    def __init__(self, gene_repository: GeneRepository):
        self.gene_repository = gene_repository

    def execute(self, symbol: str) -> Optional[Gene]:
        return self.gene_repository.find_by_symbol(symbol)


class ListGenesUseCase:
    def __init__(self, gene_repository: GeneRepository):
        self.gene_repository = gene_repository

    def execute(self) -> List[Gene]:
        return self.gene_repository.find_all()


class DeleteGeneUseCase:
    def __init__(self, gene_repository: GeneRepository):
        self.gene_repository = gene_repository

    def execute(self, gene_id: str) -> bool:
        return self.gene_repository.delete(gene_id)
