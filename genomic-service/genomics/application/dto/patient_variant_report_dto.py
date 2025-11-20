from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Any, Dict

from genomics.domain.entities import PatientVariantReport


@dataclass(slots=True)
class PatientVariantReportResponseDto:
    id: str
    patient_id: str
    variant_id: str
    detection_date: datetime
    allele_frequency: float
    created_at: datetime | None
    updated_at: datetime | None
    patient: Dict[str, Any] | None = None
    variant: Dict[str, Any] | None = None

    @classmethod
    def from_entity(
        cls,
        report: PatientVariantReport,
        *,
        patient_payload: Dict[str, Any] | None = None,
        variant_payload: Dict[str, Any] | None = None,
    ) -> "PatientVariantReportResponseDto":
        return cls(
            id=report.id or "",
            patient_id=report.patient_id,
            variant_id=report.variant_id,
            detection_date=report.detection_date,
            allele_frequency=report.allele_frequency,
            created_at=report.created_at,
            updated_at=report.updated_at,
            patient=patient_payload,
            variant=variant_payload,
        )

    def to_representation(self) -> Dict[str, Any]:
        data = asdict(self)
        data["patientId"] = data.pop("patient_id")
        data["variantId"] = data.pop("variant_id")
        data["detectionDate"] = data.pop("detection_date")
        data["alleleFrequency"] = data.pop("allele_frequency")
        data["createdAt"] = data.pop("created_at")
        data["updatedAt"] = data.pop("updated_at")
        return data


@dataclass(slots=True)
class CreatePatientVariantReportDto:
    patient_id: str
    variant_id: str
    detection_date: datetime
    allele_frequency: float

    def to_entity(self) -> PatientVariantReport:
        return PatientVariantReport(
            patient_id=self.patient_id,
            variant_id=self.variant_id,
            detection_date=self.detection_date,
            allele_frequency=self.allele_frequency,
        )


@dataclass(slots=True)
class UpdatePatientVariantReportDto:
    patient_id: str | None = None
    variant_id: str | None = None
    detection_date: datetime | None = None
    allele_frequency: float | None = None

    def apply(self, report: PatientVariantReport) -> PatientVariantReport:
        if self.patient_id is not None:
            report.patient_id = self.patient_id
        if self.variant_id is not None:
            report.variant_id = self.variant_id
        if self.detection_date is not None:
            report.detection_date = self.detection_date
        if self.allele_frequency is not None:
            report.allele_frequency = self.allele_frequency
        return report
