import uuid
from django.db import models
from users.models import User

# Create your models here.
class SustainabilityAction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='actions')
    action_type = models.CharField(max_length=50)  # e.g., "recycle", "bike"
    value = models.FloatField()  # e.g., kg, km
    date = models.DateTimeField(auto_now_add=True)
    points_earned = models.IntegerField(default=0)
    points_processed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.action_type} by {self.user.username}"