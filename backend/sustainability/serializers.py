from rest_framework import serializers
from .models import SustainabilityAction
from users.serializers import UserCreateSerializer


class SustainabilityActionSerializer(serializers.ModelSerializer):
    user = UserCreateSerializer(read_only=True)

    class Meta:
        model = SustainabilityAction
        fields = ['id', 'user', 'action_type', 'value', 'date', 'points_earned']
        read_only_fields = ['id', 'user', 'date', 'points_earned']


class CreateSustainabilityActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SustainabilityAction
        fields = ['action_type', 'value']