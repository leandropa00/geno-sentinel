from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime
from decimal import Decimal
from src.domain.entities.patient_variant_report import PatientVariantReport
from src.domain.repositories.patient_variant_report_repository import PatientVariantReportRepository


class CreatePatientVariantReportUseCase:
    def __init__(self, report_repository: PatientVariantReportRepository):
        self.report_repository = report_repository

    def execute(self, patient_id: UUID, variant_id: UUID,
                detection_date: datetime, allele_frequency: Decimal) -> PatientVariantReport:
        report = PatientVariantReport(
            id=uuid4(),
            patient_id=patient_id,
            variant_id=variant_id,
            detection_date=detection_date,
            allele_frequency=allele_frequency
        )
        return self.report_repository.save(report)


class GetPatientVariantReportByIdUseCase:
    def __init__(self, report_repository: PatientVariantReportRepository):
        self.report_repository = report_repository

    def execute(self, report_id: UUID) -> Optional[PatientVariantReport]:
        return self.report_repository.find_by_id(report_id)


class ListPatientVariantReportsByPatientUseCase:
    def __init__(self, report_repository: PatientVariantReportRepository):
        self.report_repository = report_repository

    def execute(self, patient_id: UUID) -> List[PatientVariantReport]:
        return self.report_repository.find_by_patient_id(patient_id)


class ListPatientVariantReportsUseCase:
    def __init__(self, report_repository: PatientVariantReportRepository):
        self.report_repository = report_repository

    def execute(self) -> List[PatientVariantReport]:
        return self.report_repository.find_all()


class DeletePatientVariantReportUseCase:
    def __init__(self, report_repository: PatientVariantReportRepository):
        self.report_repository = report_repository

    def execute(self, report_id: UUID) -> bool:
        return self.report_repository.delete(report_id)
