"""
GeneticVariant DTOs - Application Layer
Data Transfer Objects para transferencia entre capas
"""
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID


class GeneticVariantCreateDTO(BaseModel):
    """DTO para crear una variante genética"""
    gene_id: UUID = Field(..., description="Gene UUID")
    chromosome: str = Field(..., description="Chromosome (e.g., 'chr17')")
    position: int = Field(..., gt=0, description="Genomic position")
    reference_base: str = Field(..., min_length=1, max_length=10, description="Reference base")
    alternate_base: str = Field(..., min_length=1, max_length=10, description="Alternate base")
    impact: str = Field(..., description="Impact type (e.g., 'Missense', 'Frameshift')")


class GeneticVariantUpdateDTO(BaseModel):
    """DTO para actualizar una variante genética"""
    chromosome: Optional[str] = None
    position: Optional[int] = Field(None, gt=0)
    reference_base: Optional[str] = Field(None, min_length=1, max_length=10)
    alternate_base: Optional[str] = Field(None, min_length=1, max_length=10)
    impact: Optional[str] = None


class GeneticVariantResponseDTO(BaseModel):
    """DTO para respuesta de variante genética"""
    id: UUID
    gene_id: UUID
    chromosome: str
    position: int
    reference_base: str
    alternate_base: str
    impact: str

    class Config:
        from_attributes = True
