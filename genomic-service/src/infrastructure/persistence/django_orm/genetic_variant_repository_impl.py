from typing import List, Optional
from uuid import UUID
from src.domain.entities.genetic_variant import GeneticVariant
from src.domain.repositories.genetic_variant_repository import GeneticVariantRepository
from .mongo_connection import get_variants_collection


class DjangoGeneticVariantRepository(GeneticVariantRepository):
    def save(self, variant: GeneticVariant) -> GeneticVariant:
        variants_collection = get_variants_collection()
        variants_collection.update_one(
            {'_id': str(variant.id)},
            {'$set': {
                'gene_id': str(variant.gene_id),
                'chromosome': variant.chromosome,
                'position': variant.position,
                'reference_base': variant.reference_base,
                'alternate_base': variant.alternate_base,
                'impact': variant.impact
            }},
            upsert=True
        )
        return variant

    def find_by_id(self, variant_id: UUID) -> Optional[GeneticVariant]:
        variants_collection = get_variants_collection()
        doc = variants_collection.find_one({'_id': str(variant_id)})
        if doc:
            return GeneticVariant(
                id=UUID(doc['_id']),
                gene_id=UUID(doc['gene_id']),
                chromosome=doc['chromosome'],
                position=doc['position'],
                reference_base=doc['reference_base'],
                alternate_base=doc['alternate_base'],
                impact=doc['impact']
            )
        return None

    def find_by_gene_id(self, gene_id: UUID) -> List[GeneticVariant]:
        variants_collection = get_variants_collection()
        docs = variants_collection.find({'gene_id': str(gene_id)})
        return [
            GeneticVariant(
                id=UUID(doc['_id']),
                gene_id=UUID(doc['gene_id']),
                chromosome=doc['chromosome'],
                position=doc['position'],
                reference_base=doc['reference_base'],
                alternate_base=doc['alternate_base'],
                impact=doc['impact']
            )
            for doc in docs
        ]

    def find_by_chromosome(self, chromosome: str) -> List[GeneticVariant]:
        variants_collection = get_variants_collection()
        docs = variants_collection.find({'chromosome': chromosome})
        return [
            GeneticVariant(
                id=UUID(doc['_id']),
                gene_id=UUID(doc['gene_id']),
                chromosome=doc['chromosome'],
                position=doc['position'],
                reference_base=doc['reference_base'],
                alternate_base=doc['alternate_base'],
                impact=doc['impact']
            )
            for doc in docs
        ]

    def find_all(self) -> List[GeneticVariant]:
        variants_collection = get_variants_collection()
        docs = variants_collection.find()
        return [
            GeneticVariant(
                id=UUID(doc['_id']),
                gene_id=UUID(doc['gene_id']),
                chromosome=doc['chromosome'],
                position=doc['position'],
                reference_base=doc['reference_base'],
                alternate_base=doc['alternate_base'],
                impact=doc['impact']
            )
            for doc in docs
        ]

    def delete(self, variant_id: UUID) -> bool:
        variants_collection = get_variants_collection()
        result = variants_collection.delete_one({'_id': str(variant_id)})
        return result.deleted_count > 0
