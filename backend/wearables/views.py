from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Wearable, HealthData
from .serializers import WearableSerializer, HealthDataSerializer
from .services import authenticate_wearable, handle_oauth_callback, sync_health_data
import logging

logger = logging.getLogger(__name__)

class WearableAuthView(APIView):
      permission_classes = [IsAuthenticated]

      def post(self, request):
          try:
              provider = request.data.get('provider')
              if not provider:
                  return Response({'error': 'Provider is required'}, status=status.HTTP_400_BAD_REQUEST)
              result = authenticate_wearable(request.user, provider)
              if 'error' in result:
                  return Response({'error': result['error']}, status=status.HTTP_400_BAD_REQUEST)
              return Response({'auth_url': result['auth_url']}, status=status.HTTP_200_OK)
          except Exception as e:
              logger.error(f"Error in wearable auth for {request.user.username}: {str(e)}")
              return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WearableCallbackView(APIView):
      def get(self, request):
          try:
              code = request.GET.get('code')
              state = request.GET.get('state')  # user_id
              if not code or not state:
                  return Response({'error': 'Missing code or state'}, status=status.HTTP_400_BAD_REQUEST)
              wearable = handle_oauth_callback(code, state)
              if not wearable:
                  return Response({'error': 'Failed to authenticate wearable'}, status=status.HTTP_400_BAD_REQUEST)
              return Response({'message': 'Wearable connected successfully'}, status=status.HTTP_200_OK)
          except Exception as e:
              logger.error(f"Error in wearable callback: {str(e)}")
              return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WearableSyncView(APIView):
      permission_classes = [IsAuthenticated]

      def post(self, request):
          try:
              provider = request.data.get('provider')
              if not provider:
                  return Response({'error': 'Provider is required'}, status=status.HTTP_400_BAD_REQUEST)
              wearable = Wearable.objects.filter(user=request.user, provider=provider).first()
              if not wearable:
                  return Response({'error': 'Wearable not connected'}, status=status.HTTP_400_BAD_REQUEST)
              count = sync_health_data(wearable)
              return Response({'message': f'Synced {count} data points'}, status=status.HTTP_200_OK)
          except Exception as e:
              logger.error(f"Error in wearable sync for {request.user.username}: {str(e)}")
              return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HealthDataView(APIView):
      permission_classes = [IsAuthenticated]

      def get(self, request):
          try:
              data = HealthData.objects.filter(wearable__user=request.user)
              serializer = HealthDataSerializer(data, many=True)
              logger.info(f"Fetched {len(serializer.data)} health data points for {request.user.username}")
              return Response(serializer.data)
          except Exception as e:
              logger.error(f"Error fetching health data: {str(e)}")
              return Response({'error': f'Failed to fetch health data: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)