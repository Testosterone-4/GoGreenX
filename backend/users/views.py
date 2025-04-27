from rest_framework import viewsets, status, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.db import transaction
from django.contrib.auth import get_user_model
from .models import Profile
from .serializers import (
    UserCreateSerializer,
    UserProfileSerializer,
    ProfileSerializer
)
from urllib.parse import urlencode
from django.conf import settings
from django.shortcuts import redirect
from .mixins import PublicApiMixin, ApiErrorsMixin
from .utils import (
    google_get_access_token,
    google_get_user_info,
    generate_tokens_for_user
)

User = get_user_model()

class UserViewSet(viewsets.GenericViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    @action(detail=False, methods=['get'])
    def me(self, request):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['patch'])
    def update_profile(self, request):
        user = request.user
        serializer = ProfileSerializer(
            user.profile,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        
        # Get or create profile if missing
        if not hasattr(user, 'profile'):
            Profile.objects.create(user=user)
        
        serializer = self.get_serializer(user)
        return Response(serializer.data)

class GoogleLoginApi(PublicApiMixin, ApiErrorsMixin, APIView):
    class InputSerializer(serializers.Serializer):
        code = serializers.CharField(required=False)
        error = serializers.CharField(required=False)

    def get(self, request):
        serializer = self.InputSerializer(data=request.GET)
        serializer.is_valid(raise_exception=True)

        code = serializer.validated_data.get('code')
        error = serializer.validated_data.get('error')

        if error or not code:
            params = urlencode({'error': error})
            return redirect(f'{settings.BASE_FRONTEND_URL}?{params}')

        redirect_uri = f'{settings.BASE_FRONTEND_URL}/google'
        access_token = google_get_access_token(
            code=code,
            redirect_uri=redirect_uri
        )
        user_data = google_get_user_info(access_token=access_token)

        try:
            user = User.objects.get(email=user_data['email'])
        except User.DoesNotExist:
            with transaction.atomic():
                user = User.objects.create(
                    email=user_data['email'],
                    first_name=user_data.get('given_name', ''),
                    last_name=user_data.get('family_name', ''),
                    registration_method='google'
                )
                Profile.objects.create(user=user)

        access_token, refresh_token = generate_tokens_for_user(user)
        response_data = {
            'user': UserProfileSerializer(user).data,
            'access_token': str(access_token),
            'refresh_token': str(refresh_token)
        }
        return Response(response_data, status=status.HTTP_200_OK)