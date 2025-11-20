from __future__ import annotations

from datetime import datetime

from bson import ObjectId
from pymongo.collection import Collection
from pymongo.errors import DuplicateKeyError

from genomics.core.exceptions import ConflictError, NotFoundError
from genomics.domain.entities import Gene
from genomics.infrastructure.persistence.mongo_client import get_database


class GeneRepository:
    def __init__(self) -> None:
        database = get_database()
        self.collection: Collection = database["genes"]
        self.collection.create_index("symbol", unique=True)

    def _to_entity(self, document: dict) -> Gene:
        return Gene(
            id=str(document.get("_id")),
            symbol=document.get("symbol"),
            full_name=document.get("fullName"),
            function_summary=document.get("functionSummary"),
            created_at=document.get("createdAt"),
            updated_at=document.get("updatedAt"),
        )

    def list(self) -> list[Gene]:
        cursor = self.collection.find().sort("createdAt", -1)
        return [self._to_entity(doc) for doc in cursor]

    def get_by_id(self, gene_id: str) -> Gene:
        try:
            object_id = ObjectId(gene_id)
        except Exception as exc:  # pragma: no cover - invalid id format
            raise NotFoundError(f"Gene {gene_id} not found") from exc

        document = self.collection.find_one({"_id": object_id})
        if not document:
            raise NotFoundError(f"Gene {gene_id} not found")
        return self._to_entity(document)

    def create(self, gene: Gene) -> Gene:
        now = datetime.utcnow()
        payload = {
            "symbol": gene.symbol,
            "fullName": gene.full_name,
            "functionSummary": gene.function_summary,
            "createdAt": now,
            "updatedAt": now,
        }
        try:
            result = self.collection.insert_one(payload)
        except DuplicateKeyError as exc:
            raise ConflictError(f"Gene with symbol {gene.symbol} already exists") from exc

        gene.id = str(result.inserted_id)
        gene.created_at = now
        gene.updated_at = now
        return gene

    def update(self, gene: Gene) -> Gene:
        if not gene.id:
            raise ValueError("Gene id is required for update")

        now = datetime.utcnow()
        update_doc = {
            "symbol": gene.symbol,
            "fullName": gene.full_name,
            "functionSummary": gene.function_summary,
            "updatedAt": now,
        }
        result = self.collection.update_one(
            {"_id": ObjectId(gene.id)}, {"$set": update_doc}
        )
        if result.matched_count == 0:
            raise NotFoundError(f"Gene {gene.id} not found")

        gene.updated_at = now
        return gene

    def delete(self, gene_id: str) -> None:
        result = self.collection.delete_one({"_id": ObjectId(gene_id)})
        if result.deleted_count == 0:
            raise NotFoundError(f"Gene {gene_id} not found")
