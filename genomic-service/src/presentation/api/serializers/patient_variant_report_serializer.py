from rest_framework import serializers
from decimal import Decimal


class PatientVariantReportSerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    patient_id = serializers.UUIDField()
    variant_id = serializers.UUIDField()
    detection_date = serializers.DateTimeField()
    allele_frequency = serializers.DecimalField(max_digits=5, decimal_places=4, min_value=Decimal('0'), max_value=Decimal('1'))


class PatientVariantReportCreateSerializer(serializers.Serializer):
    patient_id = serializers.UUIDField()
    variant_id = serializers.UUIDField()
    detection_date = serializers.DateTimeField()
    allele_frequency = serializers.DecimalField(max_digits=5, decimal_places=4, min_value=Decimal('0'), max_value=Decimal('1'))
