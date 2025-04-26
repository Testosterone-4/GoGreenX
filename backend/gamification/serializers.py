from rest_framework import serializers
from .models import Badge, UserBadge, UserPoints, PointsTransaction, Notification

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'icon', 'points_required']

class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer()

    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'awarded_at']

class UserPointsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPoints
        fields = ['total_points', 'last_updated']

class PointsTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PointsTransaction
        fields = [ 'amount', 'source', 'reference_id', 'timestamp']


class NotificationSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'message', 'is_read', 'created_at', 'badge']

