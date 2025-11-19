"""
Gene DTOs - Application Layer
Data Transfer Objects para transferencia entre capas
"""
from pydantic import BaseModel, Field
from typing import Optional


class GeneCreateDTO(BaseModel):
    """DTO para crear un gen"""
    id: str = Field(..., description="Gene ID (e.g., 'BRCA1')")
    symbol: str = Field(..., min_length=1, max_length=50, description="Gene symbol")
    full_name: str = Field(..., min_length=1, max_length=255, description="Full gene name")
    function_summary: str = Field(..., description="Function summary")


class GeneUpdateDTO(BaseModel):
    """DTO para actualizar un gen"""
    symbol: Optional[str] = Field(None, min_length=1, max_length=50)
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    function_summary: Optional[str] = None


class GeneResponseDTO(BaseModel):
    """DTO para respuesta de gen"""
    id: str
    symbol: str
    full_name: str
    function_summary: str

    class Config:
        from_attributes = True
