from dataclasses import dataclass


@dataclass
class Gene:
    id: str
    symbol: str
    full_name: str
    function_summary: str
