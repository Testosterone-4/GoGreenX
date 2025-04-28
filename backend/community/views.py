from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import Group, Post, Comment
from .serializers import (
    UserProfileSerializer, GroupDetailSerializer,
    PostSerializer, CommentSerializer
)
User = get_user_model()




class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer



class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupDetailSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the creator to the current user
        serializer.save(creator=self.request.user)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        group = self.get_object()
        group.members.add(request.user)
        return Response({'status': 'joined'})

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        group = self.get_object()
        group.members.remove(request.user)
        return Response({'status': 'left'})

    @action(detail=True, methods=['post'])
    def add_moderator(self, request, pk=None):
        group = self.get_object()
        user_id = request.data.get('user_id')
        if group.creator != request.user:
            return Response({'error': 'Only group creator can add moderators'},
                            status=status.HTTP_403_FORBIDDEN)
        user = User.objects.get(id=user_id)
        group.moderators.add(user)

        return Response({'status': 'moderator added'})

    @action(detail=True, methods=['get'])
    def posts(self, request, pk=None):
        group = self.get_object()
        posts = group.posts_group.all().order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_create(self, serializer):
        # Automatically set the author to the current user
        serializer.save(author=self.request.user)
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        post.likes.add(request.user)

        return Response({'status': 'liked'})

    @action(detail=True, methods=['post'])
    def unlike(self, request, pk=None):
        post = self.get_object()
        post.likes.remove(request.user)
        return Response({'status': 'unliked'})

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        post = self.get_object()
        comments = post.comments.all().order_by('-created_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def group_name(self, request, pk=None):
        post = self.get_object()  # Handles 404 automatically

        if not post.group:
            return Response(
                {"detail": "This post does not belong to any group."},
                status=status.HTTP_204_NO_CONTENT
            )

        return Response(
            {"group_name": post.group.name},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['get'])
    def author_posts(self, request, pk=None):
        queryset = Post.objects.filter(author=pk)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]  # Require authentication

    def perform_create(self, serializer):
        # Automatically set the author and post
        post_id = self.request.data.get('post')
        post = get_object_or_404(Post, id=post_id)
        serializer.save(author=self.request.user, post=post)


    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        comment = self.get_object()
        comment.likes.add(request.user)


        return Response({'status': 'liked'})

    @action(detail=True, methods=['post'])
    def unlike(self, request, pk=None):
        comment = self.get_object()
        comment.likes.remove(request.user)
        return Response({'status': 'unliked'})


