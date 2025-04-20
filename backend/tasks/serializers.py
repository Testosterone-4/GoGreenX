from rest_framework import serializers
from users.models import FitnessInput
from .models import Task

class FitnessInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = FitnessInput
        fields = ['weight', 'height', 'sex', 'age', 'goal']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'category', 'is_completed', 'due_date']