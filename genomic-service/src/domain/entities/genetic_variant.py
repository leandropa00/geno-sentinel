from dataclasses import dataclass
from uuid import UUID


@dataclass
class GeneticVariant:
    id: UUID
    gene_id: UUID
    chromosome: str
    position: int
    reference_base: str
    alternate_base: str
    impact: str
