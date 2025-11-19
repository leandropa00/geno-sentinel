from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID
from src.domain.entities.patient_variant_report import PatientVariantReport


class PatientVariantReportRepository(ABC):
    @abstractmethod
    def save(self, report: PatientVariantReport) -> PatientVariantReport:
        pass

    @abstractmethod
    def find_by_id(self, report_id: UUID) -> Optional[PatientVariantReport]:
        pass

    @abstractmethod
    def find_by_patient_id(self, patient_id: UUID) -> List[PatientVariantReport]:
        pass

    @abstractmethod
    def find_by_variant_id(self, variant_id: UUID) -> List[PatientVariantReport]:
        pass

    @abstractmethod
    def find_all(self) -> List[PatientVariantReport]:
        pass

    @abstractmethod
    def delete(self, report_id: UUID) -> bool:
        pass
