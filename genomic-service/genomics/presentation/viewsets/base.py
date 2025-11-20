from __future__ import annotations

from rest_framework import status, viewsets
from rest_framework.response import Response

from genomics.core.exceptions import ApplicationError


class ApplicationViewSet(viewsets.ViewSet):
    """Base ViewSet with helper to translate application errors into HTTP responses."""

    def handle_application_error(self, exc: ApplicationError) -> Response:
        payload = {"message": exc.message}
        if exc.details is not None:
            payload["details"] = exc.details
        return Response(payload, status=exc.status_code)

    def handle_unexpected_error(self, exc: Exception) -> Response:  # pragma: no cover
        return Response(
            {"message": str(exc)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
