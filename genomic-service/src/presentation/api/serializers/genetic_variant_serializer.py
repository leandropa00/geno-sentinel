from rest_framework import serializers


class GeneticVariantSerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    gene_id = serializers.UUIDField()
    chromosome = serializers.CharField(max_length=10)
    position = serializers.IntegerField(min_value=1)
    reference_base = serializers.CharField(max_length=10)
    alternate_base = serializers.CharField(max_length=10)
    impact = serializers.CharField(max_length=50)


class GeneticVariantCreateSerializer(serializers.Serializer):
    gene_id = serializers.UUIDField()
    chromosome = serializers.CharField(max_length=10)
    position = serializers.IntegerField(min_value=1)
    reference_base = serializers.CharField(max_length=10)
    alternate_base = serializers.CharField(max_length=10)
    impact = serializers.CharField(max_length=50)
