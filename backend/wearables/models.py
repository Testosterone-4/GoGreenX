import uuid
from django.db import models
from users.models import User

class Wearable(models.Model):
      id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
      user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wearables')
      provider = models.CharField(
          max_length=50,
          choices=[('google', 'Google Fit'), ('apple', 'Apple Health')]
      )
      access_token = models.CharField(max_length=255)
      refresh_token = models.CharField(max_length=255, blank=True)
      expires_at = models.DateTimeField()
      last_synced = models.DateTimeField(null=True, blank=True)

      class Meta:
          unique_together = ['user', 'provider']

      def __str__(self):
          return f"{self.user.username}'s {self.provider}"

class HealthData(models.Model):
      id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
      wearable = models.ForeignKey(Wearable, on_delete=models.CASCADE, related_name='health_data')
      date = models.DateField()
      steps = models.IntegerField(default=0)
      heart_rate = models.FloatField(null=True, blank=True)
      calories = models.FloatField(default=0.0)
      sleep_hours = models.FloatField(null=True, blank=True)

      class Meta:
          unique_together = ('wearable', 'date')

      def __str__(self):
          return f"Data for {self.wearable} on {self.date}"