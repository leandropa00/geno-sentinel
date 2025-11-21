"""
Custom schema view that handles the version attribute issue.
"""
import logging

from drf_spectacular.views import SpectacularAPIView
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

logger = logging.getLogger(__name__)


class CustomSpectacularAPIView(SpectacularAPIView):
    """Custom schema view that handles requests without version attribute."""

    def get(self, request, *args, **kwargs):
        try:
            # Ensure request has version attribute if it doesn't exist
            if not hasattr(request, 'version'):
                request.version = None
            # Convert to DRF Request if it's a Django request
            if not isinstance(request, Request):
                drf_request = Request(request)
                drf_request.version = None
                request = drf_request
            return super().get(request, *args, **kwargs)
        except Exception as e:
            logger.exception("Error generating schema")
            return Response(
                {"error": "Failed to generate schema", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

