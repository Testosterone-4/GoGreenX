from rest_framework import serializers
from .models import Post,Group,Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'email']




class GroupDetailSerializer(serializers.ModelSerializer):
    moderators = UserProfileSerializer(many=True, read_only=True)
    creator = UserProfileSerializer(read_only=True)
    members = UserProfileSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = '__all__'
        extra_kwargs = {
            'creator': {'read_only': True},
            'members': {'read_only': True},
            'moderators': {'read_only': True},
        }

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Group name cannot be empty")
        return value.strip()


class PostSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()
    author = UserProfileSerializer(read_only=True)

    class Meta:
        model = Post
        fields = '__all__'
        extra_kwargs = {
            'title': {'required': False, 'allow_blank': True},  # Make title optional
            'content': {'required': True},  # Content remains required
            'author': {'read_only': True},
            'likes': {'read_only': True},
        }

    def get_like_count(self, obj):
        return obj.likes.count()

    def validate(self, data):
        """
        Validate that at least content is provided
        """
        if not data.get('content', '').strip():
            raise serializers.ValidationError("Post content cannot be empty")
        return data


class CommentSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()
    author = UserProfileSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'
        extra_kwargs = {
            'likes': {'read_only': True},  # Make likes read-only
            'author': {'read_only': True},  # Author is set automatically
            'post': {'read_only': True}  # Post is set via URL
        }

    def get_like_count(self, obj):
        return obj.likes.count()

