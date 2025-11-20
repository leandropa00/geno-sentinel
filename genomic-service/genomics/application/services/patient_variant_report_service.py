from __future__ import annotations

from typing import List

from genomics.application.dto.patient_variant_report_dto import (
    CreatePatientVariantReportDto,
    PatientVariantReportResponseDto,
    UpdatePatientVariantReportDto,
)
from genomics.core.exceptions import NotFoundError
from genomics.domain.entities import PatientVariantReport
from genomics.infrastructure.clients.clinical_client import ClinicalApiClient
from genomics.infrastructure.repositories.gene_repository import GeneRepository
from genomics.infrastructure.repositories.genetic_variant_repository import (
    GeneticVariantRepository,
)
from genomics.infrastructure.repositories.patient_variant_report_repository import (
    PatientVariantReportRepository,
)


class PatientVariantReportService:
    def __init__(
        self,
        report_repository: PatientVariantReportRepository | None = None,
        variant_repository: GeneticVariantRepository | None = None,
        gene_repository: GeneRepository | None = None,
        clinical_client: ClinicalApiClient | None = None,
    ) -> None:
        self.report_repository = report_repository or PatientVariantReportRepository()
        self.variant_repository = variant_repository or GeneticVariantRepository()
        self.gene_repository = gene_repository or GeneRepository()
        self.clinical_client = clinical_client or ClinicalApiClient()

    def _build_variant_payload(self, variant_id: str) -> dict | None:
        try:
            variant = self.variant_repository.get_by_id(variant_id)
        except NotFoundError:
            return None

        gene_payload = None
        try:
            gene = self.gene_repository.get_by_id(variant.gene_id)
            gene_payload = {
                "id": gene.id,
                "symbol": gene.symbol,
                "fullName": gene.full_name,
            }
        except NotFoundError:
            gene_payload = None

        return {
            "id": variant.id,
            "chromosome": variant.chromosome,
            "position": variant.position,
            "referenceBase": variant.reference_base,
            "alternateBase": variant.alternate_base,
            "impact": variant.impact,
            "gene": gene_payload,
        }

    def _ensure_variant_exists(self, variant_id: str) -> None:
        self.variant_repository.get_by_id(variant_id)

    def _ensure_patient_exists(self, patient_id: str) -> None:
        patient = self.clinical_client.get_patient_summary(patient_id)
        if patient is None:
            raise NotFoundError(f"Patient {patient_id} not found in Clinical service")

    def _safe_patient_payload(self, patient_id: str) -> dict | None:
        try:
            return self.clinical_client.get_patient_summary(patient_id)
        except NotFoundError:
            return None

    def list_reports(
        self,
        *,
        patient_id: str | None = None,
        variant_id: str | None = None,
    ) -> List[PatientVariantReportResponseDto]:
        reports = self.report_repository.list(
            patient_id=patient_id,
            variant_id=variant_id,
        )
        response: List[PatientVariantReportResponseDto] = []
        for report in reports:
            response.append(
                PatientVariantReportResponseDto.from_entity(
                    report,
                    patient_payload=self._safe_patient_payload(report.patient_id),
                    variant_payload=self._build_variant_payload(report.variant_id),
                )
            )
        return response

    def get_report(self, report_id: str) -> PatientVariantReportResponseDto:
        report = self.report_repository.get_by_id(report_id)
        return PatientVariantReportResponseDto.from_entity(
            report,
            patient_payload=self._safe_patient_payload(report.patient_id),
            variant_payload=self._build_variant_payload(report.variant_id),
        )

    def create_report(
        self,
        dto: CreatePatientVariantReportDto,
    ) -> PatientVariantReportResponseDto:
        self._ensure_variant_exists(dto.variant_id)
        self._ensure_patient_exists(dto.patient_id)
        entity: PatientVariantReport = dto.to_entity()
        created = self.report_repository.create(entity)
        return PatientVariantReportResponseDto.from_entity(
            created,
            patient_payload=self._safe_patient_payload(created.patient_id),
            variant_payload=self._build_variant_payload(created.variant_id),
        )

    def update_report(
        self,
        report_id: str,
        dto: UpdatePatientVariantReportDto,
    ) -> PatientVariantReportResponseDto:
        report = self.report_repository.get_by_id(report_id)
        if dto.variant_id:
            self._ensure_variant_exists(dto.variant_id)
        if dto.patient_id:
            self._ensure_patient_exists(dto.patient_id)
        updated_entity = dto.apply(report)
        saved = self.report_repository.update(updated_entity)
        return PatientVariantReportResponseDto.from_entity(
            saved,
            patient_payload=self._safe_patient_payload(saved.patient_id),
            variant_payload=self._build_variant_payload(saved.variant_id),
        )

    def delete_report(self, report_id: str) -> None:
        self.report_repository.delete(report_id)
