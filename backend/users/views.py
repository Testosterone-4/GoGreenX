from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import User, Profile
from .serializers import UserCreateSerializer, ProfileSerializer

class RegisterView(APIView):
    def post(self, request):
        user_data = {
            'email': request.data.get('email'),
            'username': request.data.get('username'),
            'password': request.data.get('password'),
            'first_name': request.data.get('first_name', ''),
            'last_name': request.data.get('last_name', '')
        }
        serializer = UserCreateSerializer(data=user_data)
        if serializer.is_valid():
            user = serializer.save()
            profile_data = {
                'user': user.id,
                'location': request.data.get('address', ''),
            }
            profile_serializer = ProfileSerializer(data=profile_data)
            if profile_serializer.is_valid():
                profile_serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)