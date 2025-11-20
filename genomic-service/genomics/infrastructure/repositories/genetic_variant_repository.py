from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from pymongo.collection import Collection

from genomics.core.exceptions import NotFoundError
from genomics.domain.entities import GeneticVariant
from genomics.infrastructure.persistence.mongo_client import get_database


class GeneticVariantRepository:
    def __init__(self) -> None:
        database = get_database()
        self.collection: Collection = database["geneticVariants"]
        self.collection.create_index("geneId")
        self.collection.create_index("id", unique=True)

    def _to_entity(self, document: dict) -> GeneticVariant:
        return GeneticVariant(
            id=document.get("id"),
            gene_id=document.get("geneId"),
            chromosome=document.get("chromosome"),
            position=document.get("position"),
            reference_base=document.get("referenceBase"),
            alternate_base=document.get("alternateBase"),
            impact=document.get("impact"),
            created_at=document.get("createdAt"),
            updated_at=document.get("updatedAt"),
        )

    def list(self, *, gene_id: str | None = None) -> list[GeneticVariant]:
        filters = {"geneId": gene_id} if gene_id else {}
        cursor = self.collection.find(filters).sort("createdAt", -1)
        return [self._to_entity(doc) for doc in cursor]

    def get_by_id(self, variant_id: str) -> GeneticVariant:
        document = self.collection.find_one({"id": variant_id})
        if not document:
            raise NotFoundError(f"Variant {variant_id} not found")
        return self._to_entity(document)

    def create(self, variant: GeneticVariant) -> GeneticVariant:
        now = datetime.utcnow()
        variant.id = variant.id or str(uuid4())
        payload = {
            "id": variant.id,
            "geneId": variant.gene_id,
            "chromosome": variant.chromosome,
            "position": variant.position,
            "referenceBase": variant.reference_base,
            "alternateBase": variant.alternate_base,
            "impact": variant.impact,
            "createdAt": now,
            "updatedAt": now,
        }
        self.collection.insert_one(payload)
        variant.created_at = now
        variant.updated_at = now
        return variant

    def update(self, variant: GeneticVariant) -> GeneticVariant:
        if not variant.id:
            raise ValueError("Variant id is required for update")

        now = datetime.utcnow()
        update_doc = {
            "geneId": variant.gene_id,
            "chromosome": variant.chromosome,
            "position": variant.position,
            "referenceBase": variant.reference_base,
            "alternateBase": variant.alternate_base,
            "impact": variant.impact,
            "updatedAt": now,
        }
        result = self.collection.update_one({"id": variant.id}, {"$set": update_doc})
        if result.matched_count == 0:
            raise NotFoundError(f"Variant {variant.id} not found")

        variant.updated_at = now
        return variant

    def delete(self, variant_id: str) -> None:
        result = self.collection.delete_one({"id": variant_id})
        if result.deleted_count == 0:
            raise NotFoundError(f"Variant {variant_id} not found")
