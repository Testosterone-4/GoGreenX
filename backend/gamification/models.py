import uuid
from django.db import models

from users.models import User

# Create your models here.
class Badge(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.URLField()
    points_required = models.IntegerField()

    def __str__(self):
        return self.name

class UserBadge(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='users')
    awarded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')

    def __str__(self):
        return f"{self.user.username} - {self.badge.name}"

class UserPoints(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='points_account')
    total_points = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

class PointsTransaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='points_transactions')
    amount = models.IntegerField()
    source = models.CharField(max_length=20, choices=[
        ('task', 'Task Completion'),
        ('sustainability', 'Sustainability Action'),
        ('bonus', 'Bonus'),
    ])
    reference_id = models.UUIDField()
    timestamp = models.DateTimeField(auto_now_add=True)


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message}"

    def mark_as_read(self):
        self.is_read = True
        self.save()
