from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.models import FitnessInput
from .models import Task
from .services import generate_fitness_plan

class FitnessPlanView(APIView):
    def post(self, request):
        user = request.user
        data = request.data

        # Update or create FitnessInput
        fitness_input, created = FitnessInput.objects.update_or_create(
            user=user,
            defaults={
                'weight': data['weight'],
                'height': data['height'],
                'sex': data['sex'],
                'age': data['age'],
                'goal': data['goal'],
            }
        )

        # Delete old tasks
        Task.objects.filter(user=user).delete()

        # Generate new tasks
        tasks = generate_fitness_plan(fitness_input)

        # Serialize tasks
        task_data = [{'id': t.id, 'title': t.title, 'category': t.category, 'due_date': t.due_date, 'is_completed': t.is_completed} for t in tasks]
        return Response(task_data, status=status.HTTP_201_CREATED)

class TaskListView(APIView):
    def get(self, request):
        tasks = Task.objects.filter(user=request.user)
        task_data = [{'id': t.id, 'title': t.title, 'category': t.category, 'due_date': t.due_date, 'is_completed': t.is_completed} for t in tasks]
        return Response(task_data)

    def post(self, request):
        data = request.data
        task = Task.objects.create(
            user=request.user,
            title=data['title'],
            category=data['category'],
            due_date=data['due_date'],
            is_completed=False
        )
        return Response({
            'id': task.id,
            'title': task.title,
            'category': task.category,
            'due_date': task.due_date,
            'is_completed': task.is_completed
        }, status=status.HTTP_201_CREATED)

class TaskCreateView(APIView):
    def post(self, request):
        data = request.data
        task = Task.objects.create(
            user=request.user,
            title=data['title'],
            category=data['category'],
            due_date=data['due_date'],
            is_completed=False
        )
        return Response({
            'id': task.id,
            'title': task.title,
            'category': task.category,
            'due_date': task.due_date,
            'is_completed': task.is_completed
        }, status=status.HTTP_201_CREATED)

class TaskUpdateView(APIView):
    def patch(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id, user=request.user)
            task.is_completed = request.data.get('is_completed', task.is_completed)
            task.save()
            return Response({'id': task.id, 'is_completed': task.is_completed})
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)