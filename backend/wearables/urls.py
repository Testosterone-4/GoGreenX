from django.urls import path
from .views import WearableAuthView, WearableCallbackView, WearableSyncView, HealthDataView

urlpatterns = [
      path('auth/', WearableAuthView.as_view(), name='wearable-auth'),
      path('callback/', WearableCallbackView.as_view(), name='wearable-callback'),
      path('sync/', WearableSyncView.as_view(), name='wearable-sync'),
      path('data/', HealthDataView.as_view(), name='health-data'),
  ]