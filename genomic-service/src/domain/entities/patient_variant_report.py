from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from uuid import UUID


@dataclass
class PatientVariantReport:
    id: UUID
    patient_id: UUID
    variant_id: UUID
    detection_date: datetime
    allele_frequency: Decimal
