from rest_framework import serializers
from .models import Task
from django.utils import timezone
from users.models import FitnessInput

class FitnessInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = FitnessInput
        fields = ['weight', 'height', 'sex', 'age', 'goal']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

    def validate_due_date(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("Due date cannot be in the past.")
        return value
        fields = ['id', 'title', 'category', 'is_completed', 'due_date']
