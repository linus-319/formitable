from rest_framework import serializers

from .models import Opportunity


class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = [
            "id",
            "organization",
            "name",
            "description",
            "status",
            "deadline",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "organization",
            "created_at",
            "updated_at",
        ]