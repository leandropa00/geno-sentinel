from __future__ import annotations

from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Any, Dict

from genomics.domain.entities import Gene


@dataclass(slots=True)
class GeneResponseDto:
    id: str
    symbol: str
    full_name: str
    function_summary: str
    created_at: datetime | None
    updated_at: datetime | None

    @classmethod
    def from_entity(cls, gene: Gene) -> "GeneResponseDto":
        return cls(
            id=gene.id or "",
            symbol=gene.symbol,
            full_name=gene.full_name,
            function_summary=gene.function_summary,
            created_at=gene.created_at,
            updated_at=gene.updated_at,
        )

    def to_representation(self) -> Dict[str, Any]:
        data = asdict(self)
        data["fullName"] = data.pop("full_name")
        data["functionSummary"] = data.pop("function_summary")
        data["createdAt"] = data.pop("created_at")
        data["updatedAt"] = data.pop("updated_at")
        return data


@dataclass(slots=True)
class CreateGeneDto:
    symbol: str
    full_name: str
    function_summary: str

    def to_entity(self) -> Gene:
        return Gene(
            symbol=self.symbol,
            full_name=self.full_name,
            function_summary=self.function_summary,
        )


@dataclass(slots=True)
class UpdateGeneDto:
    symbol: str | None = None
    full_name: str | None = None
    function_summary: str | None = None

    def apply(self, gene: Gene) -> Gene:
        if self.symbol is not None:
            gene.symbol = self.symbol
        if self.full_name is not None:
            gene.full_name = self.full_name
        if self.function_summary is not None:
            gene.function_summary = self.function_summary
        return gene
