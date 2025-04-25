from rest_framework import generics, permissions
from .models import SustainabilityAction
from .serializers import SustainabilityActionSerializer, CreateSustainabilityActionSerializer


class SustainabilityActionListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        return CreateSustainabilityActionSerializer if self.request.method == 'POST' else SustainabilityActionSerializer

    def get_queryset(self):
        user = self.request.user
        return SustainabilityAction.objects.filter(user=user)  # Users only see their own actions

    def perform_create(self, serializer):
        action = serializer.save(user=self.request.user)


        action.points_earned = self._calculate_points(action.action_type, action.value)
        action.save()

    def _calculate_points(self, action_type, value):

        points_map = {
            'recycle': 10,
            'bike': 5,
            'public_transport': 2,
        }
        return int(value * points_map.get(action_type, 1))