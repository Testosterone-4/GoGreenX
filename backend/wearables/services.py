from django.utils import timezone
from django.conf import settings
from .models import Wearable, HealthData
from users.models import User
import requests
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

def authenticate_wearable(user, provider):
      """Generate OAuth URL for Google Fit"""
      if provider.lower() != 'google':
          return {"error": f"Provider {provider} not supported"}
      try:
          auth_url = (
              f"https://accounts.google.com/o/oauth2/v2/auth?"
              f"client_id={settings.GOOGLE_CLIENT_ID}&"
              f"redirect_uri={settings.GOOGLE_REDIRECT_URI}&"
              f"response_type=code&"
              f"scope=https://www.googleapis.com/auth/fitness.activity.read+"
              f"https://www.googleapis.com/auth/fitness.heart_rate.read+"
              f"https://www.googleapis.com/auth/fitness.sleep.read+"
              f"https://www.googleapis.com/auth/fitness.nutrition.read&"
              f"state={user.id}&access_type=offline&prompt=consent"
          )
          logger.info(f"Generated OAuth URL for user {user.username}: {provider}")
          return {"auth_url": auth_url}
      except Exception as e:
          logger.error(f"Error generating OAuth URL for {user.username}: {str(e)}")
          return {"error": str(e)}

def handle_oauth_callback(code, user_id):
      """Exchange Google Fit OAuth code for tokens"""
      try:
          user = User.objects.get(id=user_id)
          response = requests.post(
              "https://oauth2.googleapis.com/token",
              data={
                  "client_id": settings.GOOGLE_CLIENT_ID,
                  "client_secret": settings.GOOGLE_CLIENT_SECRET,
                  "code": code,
                  "grant_type": "authorization_code",
                  "redirect_uri": settings.GOOGLE_REDIRECT_URI
              }
          )
          response.raise_for_status()
          data = response.json()
          expires_at = timezone.now() + timedelta(seconds=data['expires_in'])
          wearable, created = Wearable.objects.update_or_create(
              user=user,
              provider='google',
              defaults={
                  'access_token': data['access_token'],
                  'refresh_token': data.get('refresh_token', ''),
                  'expires_at': expires_at
              }
          )
          logger.info(f"Stored OAuth tokens for user {user.username}: google")
          return wearable
      except Exception as e:
          logger.error(f"Error handling OAuth callback for user_id {user_id}: {str(e)}")
          return None

def refresh_access_token(wearable):
      """Refresh Google Fit access token"""
      if wearable.provider != 'google':
          return False
      try:
          response = requests.post(
              "https://oauth2.googleapis.com/token",
              data={
                  "client_id": settings.GOOGLE_CLIENT_ID,
                  "client_secret": settings.GOOGLE_CLIENT_SECRET,
                  "refresh_token": wearable.refresh_token,
                  "grant_type": "refresh_token"
              }
          )
          response.raise_for_status()
          data = response.json()
          wearable.access_token = data['access_token']
          wearable.refresh_token = data.get('refresh_token', wearable.refresh_token)
          wearable.expires_at = timezone.now() + timedelta(seconds=data['expires_in'])
          wearable.save()
          logger.info(f"Refreshed access token for {wearable.user.username}: google")
          return True
      except Exception as e:
          logger.error(f"Error refreshing token for {wearable.user.username}: {str(e)}")
          return False

def sync_health_data(wearable):
      """Sync health data from Google Fit"""
      if wearable.provider != 'google':
          return 0
      if wearable.expires_at < timezone.now():
          if not refresh_access_token(wearable):
              return 0
      try:
          date = timezone.now().date()
          start_time = int(datetime.combine(date, datetime.min.time()).timestamp() * 1000)
          end_time = int(datetime.combine(date, datetime.max.time()).timestamp() * 1000)
          headers = {"Authorization": f"Bearer {wearable.access_token}"}
          data = {
              "aggregateBy": [
                  {"dataTypeName": "com.google.step_count.delta"},
                  {"dataTypeName": "com.google.heart_rate.bpm"},
                  {"dataTypeName": "com.google.calories.expended"},
                  {"dataTypeName": "com.google.sleep.segment"}
              ],
              "bucketByTime": {"durationMillis": 86400000},  # Daily buckets
              "startTimeMillis": start_time,
              "endTimeMillis": end_time
          }
          response = requests.post(
              "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
              headers=headers,
              json=data
          )
          response.raise_for_status()
          buckets = response.json()['bucket']
          steps = heart_rate = calories = sleep_hours = None
          for bucket in buckets:
              for dataset in bucket['dataset']:
                  if dataset['dataSourceId'].endswith('derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'):
                      steps = sum(point['value'][0]['intVal'] for point in dataset['point'] if point['value']) if dataset['point'] else 0
                  elif dataset['dataSourceId'].endswith('derived:com.google.heart_rate.bpm:com.google.android.gms:merged'):
                      heart_rates = [point['value'][0]['fpVal'] for point in dataset['point'] if point['value']]
                      heart_rate = sum(heart_rates) / len(heart_rates) if heart_rates else None
                  elif dataset['dataSourceId'].endswith('derived:com.google.calories.expended:com.google.android.gms:merged'):
                      calories = sum(point['value'][0]['fpVal'] for point in dataset['point'] if point['value']) if dataset['point'] else 0
                  elif dataset['dataSourceId'].endswith('derived:com.google.sleep.segment:com.google.android.gms:merged'):
                      sleep_hours = sum(
                          (point['endTimeNanos'] - point['startTimeNanos']) / 3600000000000.0
                          for point in dataset['point'] if point['value']
                      ) if dataset['point'] else None

          health_data, created = HealthData.objects.update_or_create(
              wearable=wearable,
              date=date,
              defaults={
                  'steps': steps or 0,
                  'heart_rate': heart_rate,
                  'calories': calories or 0,
                  'sleep_hours': sleep_hours
              }
          )
          wearable.last_synced = timezone.now()
          wearable.save()
          logger.info(f"Synced health data for {wearable.user.username}: {date}")
          return 1
      except Exception as e:
          logger.error(f"Error syncing health data for {wearable.user.username}: {str(e)}")
          return 0