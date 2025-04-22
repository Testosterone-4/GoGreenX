from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.models import FitnessInput
from .models import Task
from .services import generate_fitness_plan
from .serializers import TaskSerializer, FitnessInputSerializer
import logging

logger = logging.getLogger(__name__)

class FitnessPlanView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data
        try:
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
            Task.objects.filter(user=user).delete()
            tasks = generate_fitness_plan(fitness_input)
            task_data = TaskSerializer(tasks, many=True).data
            logger.info(f"Generated fitness plan for {user.email}: {len(tasks)} tasks")
            return Response({
                'tasks': task_data,
                'fitness_input': FitnessInputSerializer(fitness_input).data
            }, status=status.HTTP_201_CREATED)
        except KeyError as e:
            logger.error(f"Missing field: {str(e)}")
            return Response({'error': f'Missing field: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error generating fitness plan: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            tasks = Task.objects.filter(user=request.user)
            task_data = TaskSerializer(tasks, many=True).data
            logger.info(f"Fetched {len(task_data)} tasks for {request.user.email}")
            return Response(task_data)
        except Exception as e:
            logger.error(f"Error fetching tasks: {str(e)}")
            return Response({'error': f'Failed to fetch tasks: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            logger.info(f"Created task '{task.title}' for {request.user.email}")
            return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)
        except KeyError as e:
            logger.error(f"Missing field: {str(e)}")
            return Response({'error': f'Missing field: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error creating task: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TaskUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id, user=request.user)
            task.is_completed = request.data.get('is_completed', task.is_completed)
            task.save()
            logger.info(f"Updated task '{task.title}' for {request.user.email}")
            return Response(TaskSerializer(task).data)
        except Task.DoesNotExist:
            logger.error(f"Task not found: {task_id}")
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error updating task {task_id}: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)