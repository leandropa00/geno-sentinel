from typing import List, Optional
from src.domain.entities.gene import Gene
from src.domain.repositories.gene_repository import GeneRepository
from .mongo_connection import get_genes_collection


class DjangoGeneRepository(GeneRepository):
    def save(self, gene: Gene) -> Gene:
        genes_collection = get_genes_collection()
        genes_collection.update_one(
            {'_id': gene.id},
            {'$set': {
                'symbol': gene.symbol,
                'full_name': gene.full_name,
                'function_summary': gene.function_summary
            }},
            upsert=True
        )
        return gene

    def find_by_id(self, gene_id: str) -> Optional[Gene]:
        genes_collection = get_genes_collection()
        doc = genes_collection.find_one({'_id': gene_id})
        if doc:
            return Gene(
                id=doc['_id'],
                symbol=doc['symbol'],
                full_name=doc['full_name'],
                function_summary=doc['function_summary']
            )
        return None

    def find_by_symbol(self, symbol: str) -> Optional[Gene]:
        genes_collection = get_genes_collection()
        doc = genes_collection.find_one({'symbol': symbol})
        if doc:
            return Gene(
                id=doc['_id'],
                symbol=doc['symbol'],
                full_name=doc['full_name'],
                function_summary=doc['function_summary']
            )
        return None

    def find_all(self) -> List[Gene]:
        genes_collection = get_genes_collection()
        docs = genes_collection.find()
        return [
            Gene(
                id=doc['_id'],
                symbol=doc['symbol'],
                full_name=doc['full_name'],
                function_summary=doc['function_summary']
            )
            for doc in docs
        ]

    def delete(self, gene_id: str) -> bool:
        genes_collection = get_genes_collection()
        result = genes_collection.delete_one({'_id': gene_id})
        return result.deleted_count > 0
