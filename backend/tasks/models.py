from django.db import models
import uuid

class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=[('exercise', 'Exercise'), ('nutrition', 'Nutrition')])
    is_completed = models.BooleanField(default=False)
    due_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.user.username})"