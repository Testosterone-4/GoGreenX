from rest_framework import serializers
from .models import User, Profile

class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['bio', 'avatar', 'location']
        extra_kwargs = {
            'points': {'read_only': True}
        }

class UserProfileSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(source='profile.bio')
    avatar = serializers.URLField(source='profile.avatar')
    location = serializers.CharField(source='profile.location')
    points = serializers.IntegerField(source='profile.points')
    weight = serializers.FloatField(source='fitness_input.weight', allow_null=True)
    height = serializers.FloatField(source='fitness_input.height', allow_null=True)
    age = serializers.IntegerField(source='fitness_input.age', allow_null=True)
    goal = serializers.CharField(source='fitness_input.goal', allow_null=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 
            'bio', 'avatar', 'location', 'points',
            'weight', 'height', 'age', 'goal'
        ]
        read_only_fields = ['id', 'email', 'points']