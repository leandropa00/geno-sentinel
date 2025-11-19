from rest_framework import serializers


class GeneSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=255)
    symbol = serializers.CharField(max_length=50)
    full_name = serializers.CharField(max_length=255)
    function_summary = serializers.CharField()


class GeneCreateSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=255, required=False, allow_blank=True)
    symbol = serializers.CharField(max_length=50)
    full_name = serializers.CharField(max_length=255)
    function_summary = serializers.CharField()
