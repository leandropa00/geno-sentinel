"""
PatientVariantReport DTOs - Application Layer
Data Transfer Objects para transferencia entre capas
"""
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal


class PatientVariantReportCreateDTO(BaseModel):
    """DTO para crear un reporte de variante"""
    patient_id: UUID = Field(..., description="Patient UUID (from clinical-service)")
    variant_id: UUID = Field(..., description="Variant UUID")
    detection_date: datetime = Field(..., description="Detection date")
    allele_frequency: Decimal = Field(..., ge=0, le=1, description="Allele frequency (0.0-1.0)")


class PatientVariantReportUpdateDTO(BaseModel):
    """DTO para actualizar un reporte de variante"""
    detection_date: Optional[datetime] = None
    allele_frequency: Optional[Decimal] = Field(None, ge=0, le=1)


class PatientVariantReportResponseDTO(BaseModel):
    """DTO para respuesta de reporte"""
    id: UUID
    patient_id: UUID
    variant_id: UUID
    detection_date: datetime
    allele_frequency: Decimal

    class Config:
        from_attributes = True
