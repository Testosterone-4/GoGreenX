from rest_framework import serializers
from .models import User, Profile

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password')

class UserProfileSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(source='profile.bio', allow_blank=True, required=False)
    avatar = serializers.URLField(source='profile.avatar', allow_blank=True, required=False)
    location = serializers.CharField(source='profile.location', allow_blank=True, required=False)
    points = serializers.IntegerField(source='profile.points', read_only=True)
    gender = serializers.CharField(source='fitness_input.sex', allow_blank=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 
                  'bio', 'avatar', 'location', 'points', 'gender')
        read_only_fields = ('email', 'points')  # email and points are read-only

    def update(self, instance, validated_data):
        # Update User fields
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()

        # Update Profile fields
        profile_data = validated_data.get('profile', {})
        profile = instance.profile
        profile.bio = profile_data.get('bio', profile.bio)
        profile.avatar = profile_data.get('avatar', profile.avatar)
        profile.location = profile_data.get('location', profile.location)
        profile.save()

        # Update FitnessInput fields
        fitness_input_data = validated_data.get('fitness_input', {})
        if hasattr(instance, 'fitness_input'):
            fitness_input = instance.fitness_input
            fitness_input.sex = fitness_input_data.get('sex', fitness_input.sex)
            fitness_input.save()

        return instance