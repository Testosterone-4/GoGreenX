from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.models import FitnessInput
from .models import Task
from .services import generate_fitness_plan
from .serializers import TaskSerializer

class FitnessPlanView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        try:
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
            task_data = TaskSerializer(tasks, many=True).data
            return Response({
                'tasks': task_data,
                'fitness_input_id': str(fitness_input.id)
            }, status=status.HTTP_201_CREATED)
        except KeyError as e:
            return Response({'error': f'Missing field: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.filter(user=request.user)
        task_data = TaskSerializer(tasks, many=True).data
        return Response(task_data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        try:
            task = Task.objects.create(
                user=request.user,
                title=data['title'],
                category=data['category'],
                due_date=data['due_date'],
                is_completed=False
            )
            return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)
        except KeyError as e:
            return Response({'error': f'Missing field: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TaskUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id, user=request.user)
            task.is_completed = request.data.get('is_completed', task.is_completed)
            task.save()
            return Response(TaskSerializer(task).data, status=status.HTTP_200_OK)
        except Task.DoesNotExist:
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)