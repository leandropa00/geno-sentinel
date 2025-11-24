from __future__ import annotations

import logging
from typing import Any, Dict, Optional

import requests
from django.conf import settings

from genomics.core.exceptions import ExternalServiceError

logger = logging.getLogger(__name__)


class ClinicalApiClient:
    """HTTP client to retrieve patient metadata from the Clinical service."""

    def __init__(self, base_url: str | None = None, timeout: int = 5) -> None:
        self.base_url = base_url or settings.CLINICAL_SERVICE_BASE_URL
        self.timeout = timeout

    def get_patient_summary(self, patient_id: str) -> Optional[Dict[str, Any]]:
        if not self.base_url:
            logger.warning("Clinical service base URL not configured")
            return None

        url = f"{self.base_url.rstrip('/')}/patients/{patient_id}"
        try:
            response = requests.get(url, timeout=self.timeout)
        except requests.RequestException as exc:  # pragma: no cover - network errors
            logger.error("Clinical service unavailable: %s", exc)
            raise ExternalServiceError(
                message="Clinical service unavailable",
                details=str(exc),
            ) from exc

        if response.status_code == 404:
            return None

        if response.status_code >= 500:
            raise ExternalServiceError(
                message="Clinical service error",
                details=response.text,
            )

        response.raise_for_status()
        payload = response.json()
        return {
            "id": payload.get("id"),
            "firstName": payload.get("firstName"),
            "lastName": payload.get("lastName"),
            "status": payload.get("status"),
        }
