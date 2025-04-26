from rest_framework import serializers
from .models import Task
from users.models import FitnessInput

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'category', 'is_completed', 'due_date', 'created_at', 'points_rewarded', 'points_processed']

class FitnessInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = FitnessInput
        fields = ['id', 'weight', 'height', 'sex', 'age', 'goal', 'created_at']