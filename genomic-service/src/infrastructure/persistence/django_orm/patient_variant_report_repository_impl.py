from typing import List, Optional
from uuid import UUID
from src.domain.entities.patient_variant_report import PatientVariantReport
from src.domain.repositories.patient_variant_report_repository import PatientVariantReportRepository
from .mongo_connection import get_reports_collection


class DjangoPatientVariantReportRepository(PatientVariantReportRepository):
    def save(self, report: PatientVariantReport) -> PatientVariantReport:
        reports_collection = get_reports_collection()
        reports_collection.update_one(
            {'_id': str(report.id)},
            {'$set': {
                'patient_id': str(report.patient_id),
                'variant_id': str(report.variant_id),
                'detection_date': report.detection_date,
                'allele_frequency': str(report.allele_frequency)
            }},
            upsert=True
        )
        return report

    def find_by_id(self, report_id: UUID) -> Optional[PatientVariantReport]:
        reports_collection = get_reports_collection()
        doc = reports_collection.find_one({'_id': str(report_id)})
        if doc:
            from decimal import Decimal
            return PatientVariantReport(
                id=UUID(doc['_id']),
                patient_id=UUID(doc['patient_id']),
                variant_id=UUID(doc['variant_id']),
                detection_date=doc['detection_date'],
                allele_frequency=Decimal(doc['allele_frequency'])
            )
        return None

    def find_by_patient_id(self, patient_id: UUID) -> List[PatientVariantReport]:
        reports_collection = get_reports_collection()
        docs = reports_collection.find({'patient_id': str(patient_id)})
        from decimal import Decimal
        return [
            PatientVariantReport(
                id=UUID(doc['_id']),
                patient_id=UUID(doc['patient_id']),
                variant_id=UUID(doc['variant_id']),
                detection_date=doc['detection_date'],
                allele_frequency=Decimal(doc['allele_frequency'])
            )
            for doc in docs
        ]

    def find_by_variant_id(self, variant_id: UUID) -> List[PatientVariantReport]:
        reports_collection = get_reports_collection()
        docs = reports_collection.find({'variant_id': str(variant_id)})
        from decimal import Decimal
        return [
            PatientVariantReport(
                id=UUID(doc['_id']),
                patient_id=UUID(doc['patient_id']),
                variant_id=UUID(doc['variant_id']),
                detection_date=doc['detection_date'],
                allele_frequency=Decimal(doc['allele_frequency'])
            )
            for doc in docs
        ]

    def find_all(self) -> List[PatientVariantReport]:
        reports_collection = get_reports_collection()
        docs = reports_collection.find()
        from decimal import Decimal
        return [
            PatientVariantReport(
                id=UUID(doc['_id']),
                patient_id=UUID(doc['patient_id']),
                variant_id=UUID(doc['variant_id']),
                detection_date=doc['detection_date'],
                allele_frequency=Decimal(doc['allele_frequency'])
            )
            for doc in docs
        ]

    def delete(self, report_id: UUID) -> bool:
        reports_collection = get_reports_collection()
        result = reports_collection.delete_one({'_id': str(report_id)})
        return result.deleted_count > 0
