from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.core.validators import MinValueValidator

class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30, unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class Profile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    avatar = models.URLField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    points = models.IntegerField(default=0, validators=[MinValueValidator(0)])

class FitnessInput(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='fitness_input')
    weight = models.FloatField()
    height = models.FloatField()
    sex = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female')])
    age = models.IntegerField()
    goal = models.CharField(max_length=20, choices=[('bulking', 'Bulking'), ('dieting', 'Dieting')])
    created_at = models.DateTimeField(auto_now_add=True)