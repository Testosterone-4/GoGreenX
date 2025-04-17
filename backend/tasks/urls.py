from django.urls import path
from .views import FitnessPlanView, TaskListView

urlpatterns = [
    path('plan/', FitnessPlanView.as_view(), name='fitness-plan'),
    path('tasks/', TaskListView.as_view(), name='task-list'),
    path('tasks/<uuid:task_id>/', TaskListView.as_view(), name='task-update'),
]