"""
Simple health check endpoint for Kubernetes probes.
"""
from django.http import JsonResponse


def health_check(request):
    """Simple health check endpoint that returns 200 OK."""
    return JsonResponse({"status": "ok"}, status=200)

