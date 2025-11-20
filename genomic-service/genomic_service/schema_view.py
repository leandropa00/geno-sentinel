"""
Custom schema view that handles the version attribute issue.
"""
from drf_spectacular.views import SpectacularAPIView
from rest_framework.request import Request


class CustomSpectacularAPIView(SpectacularAPIView):
    """Custom schema view that handles requests without version attribute."""

    def get(self, request, *args, **kwargs):
        # Ensure request has version attribute if it doesn't exist
        if not hasattr(request, 'version'):
            request.version = None
        # Convert to DRF Request if it's a Django request
        if not isinstance(request, Request):
            drf_request = Request(request)
            drf_request.version = None
            request = drf_request
        return super().get(request, *args, **kwargs)

