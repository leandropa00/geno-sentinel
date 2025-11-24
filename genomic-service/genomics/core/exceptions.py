from __future__ import annotations

from dataclasses import dataclass
from http import HTTPStatus
from typing import Any


@dataclass(slots=True)
class ApplicationError(Exception):
    message: str
    status_code: int = HTTPStatus.BAD_REQUEST
    details: Any | None = None

    def __str__(self) -> str:  # pragma: no cover - debug helper
        return self.message


class NotFoundError(ApplicationError):
    status_code = HTTPStatus.NOT_FOUND


class ConflictError(ApplicationError):
    status_code = HTTPStatus.CONFLICT


class ExternalServiceError(ApplicationError):
    status_code = HTTPStatus.BAD_GATEWAY


class InfrastructureError(ApplicationError):
    status_code = HTTPStatus.INTERNAL_SERVER_ERROR
