from __future__ import annotations

from rest_framework.routers import DefaultRouter

from genomics.presentation.viewsets.gene_viewset import GeneViewSet
from genomics.presentation.viewsets.genetic_variant_viewset import GeneticVariantViewSet
from genomics.presentation.viewsets.patient_variant_report_viewset import (
    PatientVariantReportViewSet,
)

router = DefaultRouter(trailing_slash=False)
router.register(r"genes", GeneViewSet, basename="gene")
router.register(r"genetic-variants", GeneticVariantViewSet, basename="genetic-variant")
router.register(
    r"patient-variant-reports",
    PatientVariantReportViewSet,
    basename="patient-variant-report",
)

urlpatterns = router.urls
