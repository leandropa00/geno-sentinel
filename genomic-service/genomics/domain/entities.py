from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass(slots=True)
class Gene:
    symbol: str
    full_name: str
    function_summary: str
    id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


@dataclass(slots=True)
class GeneticVariant:
    gene_id: str
    chromosome: str
    position: int
    reference_base: str
    alternate_base: str
    impact: str
    id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


@dataclass(slots=True)
class PatientVariantReport:
    patient_id: str
    variant_id: str
    detection_date: datetime
    allele_frequency: float
    id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
