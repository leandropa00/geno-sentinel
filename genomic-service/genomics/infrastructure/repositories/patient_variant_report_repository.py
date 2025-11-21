from __future__ import annotations

from datetime import datetime
from uuid import uuid4

from pymongo.collection import Collection
from pymongo.errors import ServerSelectionTimeoutError

from genomics.core.exceptions import NotFoundError
from genomics.domain.entities import PatientVariantReport
from genomics.infrastructure.persistence.mongo_client import get_database


class PatientVariantReportRepository:
    def __init__(self) -> None:
        database = get_database()
        self.collection: Collection = database["patientVariantReports"]
        self._ensure_indexes()

    def _ensure_indexes(self) -> None:
        """Create indexes lazily, handling connection errors during schema generation."""
        try:
            self.collection.create_index("patientId")
            self.collection.create_index("variantId")
            self.collection.create_index("id", unique=True)
        except (ServerSelectionTimeoutError, ConnectionError, Exception):
            # MongoDB not available during schema generation, indexes will be created on first use
            pass

    def _to_entity(self, document: dict) -> PatientVariantReport:
        return PatientVariantReport(
            id=document.get("id"),
            patient_id=document.get("patientId"),
            variant_id=document.get("variantId"),
            detection_date=document.get("detectionDate"),
            allele_frequency=document.get("alleleFrequency"),
            created_at=document.get("createdAt"),
            updated_at=document.get("updatedAt"),
        )

    def list(
        self,
        *,
        patient_id: str | None = None,
        variant_id: str | None = None,
    ) -> list[PatientVariantReport]:
        filters: dict[str, str] = {}
        if patient_id:
            filters["patientId"] = patient_id
        if variant_id:
            filters["variantId"] = variant_id
        cursor = self.collection.find(filters).sort("createdAt", -1)
        return [self._to_entity(doc) for doc in cursor]

    def get_by_id(self, report_id: str) -> PatientVariantReport:
        document = self.collection.find_one({"id": report_id})
        if not document:
            raise NotFoundError(f"Report {report_id} not found")
        return self._to_entity(document)

    def create(self, report: PatientVariantReport) -> PatientVariantReport:
        now = datetime.utcnow()
        report.id = report.id or str(uuid4())
        payload = {
            "id": report.id,
            "patientId": report.patient_id,
            "variantId": report.variant_id,
            "detectionDate": report.detection_date,
            "alleleFrequency": report.allele_frequency,
            "createdAt": now,
            "updatedAt": now,
        }
        self.collection.insert_one(payload)
        report.created_at = now
        report.updated_at = now
        return report

    def update(self, report: PatientVariantReport) -> PatientVariantReport:
        if not report.id:
            raise ValueError("Report id is required for update")

        now = datetime.utcnow()
        update_doc = {
            "patientId": report.patient_id,
            "variantId": report.variant_id,
            "detectionDate": report.detection_date,
            "alleleFrequency": report.allele_frequency,
            "updatedAt": now,
        }
        result = self.collection.update_one({"id": report.id}, {"$set": update_doc})
        if result.matched_count == 0:
            raise NotFoundError(f"Report {report.id} not found")

        report.updated_at = now
        return report

    def delete(self, report_id: str) -> None:
        result = self.collection.delete_one({"id": report_id})
        if result.deleted_count == 0:
            raise NotFoundError(f"Report {report_id} not found")
