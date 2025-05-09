from django.db import models
import uuid
from users.models import User
from django.core.validators import MinValueValidator

class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    category = models.CharField(max_length=20, choices=[
        ('exercise', 'Exercise'),
        ('nutrition', 'Nutrition'),
        ('sustainability', 'Sustainability'),
    ])
    is_completed = models.BooleanField(default=False)
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    points_rewarded = models.IntegerField(default=10, validators=[MinValueValidator(0)])
    points_processed = models.BooleanField(default=False)

    def __str__(self):
        return self.title