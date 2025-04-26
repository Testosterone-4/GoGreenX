from django.urls import path
from .views import SustainabilityActionListCreateView

urlpatterns = [
    path('actions/', SustainabilityActionListCreateView.as_view(), name='sustainability-actions'),
]