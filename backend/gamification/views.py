from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    CreateAPIView,
    UpdateAPIView
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    BadgeSerializer,
    UserBadgeSerializer,
    UserPointsSerializer,
    PointsTransactionSerializer,
    NotificationSerializer
)
from .models import (
    Badge,
    UserBadge,
    UserPoints,
    PointsTransaction,
    Notification
)


class BadgeListView(ListAPIView):
    """
    List all available badges
    GET /api/gamification/badges/
    """
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [IsAuthenticated]




class UserBadgeListView(ListAPIView):
    """
    List badges earned by current user
    GET /api/gamification/my-badges/
    """
    serializer_class = UserBadgeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserBadge.objects.filter(user=self.request.user)


class UserPointsDetailView(RetrieveAPIView):
    """
    Get current user's points
    GET /api/gamification/points/
    """
    serializer_class = UserPointsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return UserPoints.objects.get(user=self.request.user)


class LeaderboardView(ListAPIView):
    """
    Get top 10 users by points
    GET /api/gamification/leaderboard/
    """
    serializer_class = UserPointsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserPoints.objects.order_by('-total_points')[:10]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class PointsTransactionListView(ListAPIView):
    """
    List all point transactions for current user
    GET /api/gamification/transactions/
    """
    serializer_class = PointsTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PointsTransaction.objects.filter(
            user=self.request.user
        ).order_by('-timestamp')


class NotificationListView(ListAPIView):
    """
    List all notifications for current user
    GET /api/gamification/notifications/
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        ).order_by('-created_at')


class NotificationMarkAsReadView(UpdateAPIView):
    """
    Mark notification as read
    PATCH /api/gamification/notifications/<id>/mark-as-read/
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_read = True
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class NotificationMarkAllAsReadView(CreateAPIView):
    """
    Mark all notifications as read
    POST /api/gamification/notifications/mark-all-read/
    """
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(is_read=True)
        return Response(
            {'status': 'All notifications marked as read'},
            status=status.HTTP_200_OK
        )