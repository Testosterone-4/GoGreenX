from django.urls import path
from . import views

urlpatterns = [
   path("auth/google/", views.GoogleLoginApi.as_view(),
         name="login-with-google"),
         path('me/', views.UserProfileView.as_view(), name='user-profile'),
]