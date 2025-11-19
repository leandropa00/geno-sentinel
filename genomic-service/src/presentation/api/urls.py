from django.urls import path, include
from rest_framework.routers import DefaultRouter

from src.presentation.api.views.gene_views import GeneViewSet
from src.presentation.api.views.genetic_variant_views import GeneticVariantViewSet
from src.presentation.api.views.patient_variant_report_views import PatientVariantReportViewSet

router = DefaultRouter()
router.register(r'genes', GeneViewSet, basename='gene')
router.register(r'variants', GeneticVariantViewSet, basename='variant')
router.register(r'reports', PatientVariantReportViewSet, basename='report')

urlpatterns = [
    path('', include(router.urls)),
]
