from django.urls import path
from .views import FitnessPlanView, TaskListView, TaskCreateView, TaskUpdateView

urlpatterns = [
    path('plan/', FitnessPlanView.as_view(), name='fitness-plan'),
    path('tasks/', TaskListView.as_view(), name='task-list'),
    path('tasks/create/', TaskCreateView.as_view(), name='task-create'),
    path('tasks/<uuid:task_id>/', TaskUpdateView.as_view(), name='task-update'),
    path('list/', TaskListView.as_view(), name='task-list'),
    path('list/<uuid:task_id>/', TaskListView.as_view(), name='task-update'),
]
