from __future__ import annotations

from datetime import datetime

from rest_framework import serializers

from genomics.application.dto.patient_variant_report_dto import (
    CreatePatientVariantReportDto,
    PatientVariantReportResponseDto,
    UpdatePatientVariantReportDto,
)


class _DateTimeField(serializers.DateTimeField):
    def __init__(self, *args, **kwargs) -> None:
        kwargs.setdefault("input_formats", ["%Y-%m-%d", "iso-8601"])
        kwargs.setdefault("format", "iso-8601")
        super().__init__(*args, **kwargs)


from decimal import Decimal


class CreatePatientVariantReportSerializer(serializers.Serializer):
    patientId = serializers.CharField()
    variantId = serializers.CharField()
    detectionDate = _DateTimeField()
    alleleFrequency = serializers.DecimalField(
        max_digits=4,
        decimal_places=3,
        min_value=Decimal("0"),
    )

    def to_dto(self) -> CreatePatientVariantReportDto:
        detection_dt: datetime = self.validated_data["detectionDate"]
        allele = float(self.validated_data["alleleFrequency"])
        return CreatePatientVariantReportDto(
            patient_id=self.validated_data["patientId"],
            variant_id=self.validated_data["variantId"],
            detection_date=detection_dt,
            allele_frequency=allele,
        )


class UpdatePatientVariantReportSerializer(serializers.Serializer):
    patientId = serializers.CharField(required=False)
    variantId = serializers.CharField(required=False)
    detectionDate = _DateTimeField(required=False)
    alleleFrequency = serializers.DecimalField(
        max_digits=4,
        decimal_places=3,
        min_value=Decimal("0"),
        required=False,
    )

    def to_dto(self) -> UpdatePatientVariantReportDto:
        detection_dt = self.validated_data.get("detectionDate")
        allele = self.validated_data.get("alleleFrequency")
        return UpdatePatientVariantReportDto(
            patient_id=self.validated_data.get("patientId"),
            variant_id=self.validated_data.get("variantId"),
            detection_date=detection_dt,
            allele_frequency=float(allele) if allele is not None else None,
        )


class PatientVariantReportResponseSerializer(serializers.Serializer):
    id = serializers.CharField()
    patientId = serializers.CharField()
    variantId = serializers.CharField()
    detectionDate = serializers.DateTimeField()
    alleleFrequency = serializers.FloatField()
    createdAt = serializers.DateTimeField(allow_null=True)
    updatedAt = serializers.DateTimeField(allow_null=True)
    patient = serializers.DictField(required=False, allow_null=True)
    variant = serializers.DictField(required=False, allow_null=True)

    def to_representation(self, instance: PatientVariantReportResponseDto | dict):
        if isinstance(instance, PatientVariantReportResponseDto):
            return instance.to_representation()
        return instance
