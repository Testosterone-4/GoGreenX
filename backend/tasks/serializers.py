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
        fields = ['id', 'title', 'category', 'is_completed', 'due_date', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_due_date(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("Due date cannot be in the past.")
        return value

    def validate_category(self, value):
        valid_categories = ['exercise', 'nutrition', 'sustainability']
        if value not in valid_categories:
            raise serializers.ValidationError(f"Category must be one of {valid_categories}.")
        return value