from django.urls import path
from .views import FitnessPlanView, TaskListView

urlpatterns = [
    path('plan/', FitnessPlanView.as_view(), name='fitness-plan'),
    path('list/', TaskListView.as_view(), name='task-list'),
    path('list/<uuid:task_id>/', TaskListView.as_view(), name='task-update'),
]