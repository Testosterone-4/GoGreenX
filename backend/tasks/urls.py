# backend/tasks/urls.py
from django.urls import path
from .views import FitnessPlanView, TaskListView, TaskUpdateView, TaskDeleteView

urlpatterns = [
    path('plan/', FitnessPlanView.as_view(), name='fitness-plan'),       # /api/tasks/plan/
    path('list/', TaskListView.as_view(), name='task-list'),             # /api/tasks/list/
    path('list/<uuid:task_id>/', TaskUpdateView.as_view(), name='task-update'),  # /api/tasks/list/{task_id}/
]