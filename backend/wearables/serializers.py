from rest_framework import serializers
from .models import Wearable, HealthData

class WearableSerializer(serializers.ModelSerializer):
      class Meta:
          model = Wearable
          fields = ['id', 'provider', 'last_synced']

class HealthDataSerializer(serializers.ModelSerializer):
      class Meta:
          model = HealthData
          fields = ['date', 'steps', 'heart_rate', 'calories', 'sleep_hours']