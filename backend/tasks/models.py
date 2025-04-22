from django.db import models
import uuid

class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    category = models.CharField(max_length=20, choices=[
        ('exercise', 'Exercise'),
        ('nutrition', 'Nutrition'),
        ('sustainability', 'Sustainability'),
    ])
    is_completed = models.BooleanField(default=False)
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title