from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.models import FitnessInput
from .models import Task
from .services import generate_fitness_plan
from .serializers import TaskSerializer, FitnessInputSerializer
import logging
from django.utils import timezone
from datetime import timedelta
from rest_framework.exceptions import NotFound

logger = logging.getLogger(__name__)

class FitnessPlanView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data
        try:
            # Check for recent plan generation (within 60 seconds)
            recent_tasks = Task.objects.filter(
                user=user,
                created_at__gte=timezone.now() - timedelta(seconds=60)
            )
            if recent_tasks.exists():
                logger.warning(f"Duplicate plan generation attempt by {user.email} within 60 seconds")
                return Response({
                    'error': 'A fitness plan was recently generated. Please wait a moment before trying again.'
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)

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
        except Task.DoesNotExist:
            logger.error(f"Task not found: {task_id}")
            return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Updated task '{task.title}' for {request.user.email}")
            return Response(serializer.data)
        else:
            logger.error(f"Invalid data for task {task_id}: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class TaskDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id, user=request.user)
            task.delete()
            logger.info(f"Deleted task '{task.title}' for {request.user.email}")
            return Response({'message': 'Task deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Task.DoesNotExist:
            logger.error(f"Task not found: {task_id}")
            raise NotFound({'error': 'Task not found'})
        except Exception as e:
            logger.error(f"Error deleting task {task_id}: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)