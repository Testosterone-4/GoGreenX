from django.urls import path
from .views import FitnessPlanView, TaskListView, TaskUpdateView, TaskDeleteView

urlpatterns = [
    path('tasks/plan/', FitnessPlanView.as_view(), name='fitness-plan'),
    path('tasks/list/', TaskListView.as_view(), name='task-list'),
    path('tasks/list/<uuid:task_id>/', TaskUpdateView.as_view(), name='task-update'),
    path('tasks/delete/<uuid:task_id>/', TaskDeleteView.as_view(), name='task-delete'),
]