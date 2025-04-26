from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('password/reset/confirm/<uidb64>/<token>/',
         auth_views.PasswordResetConfirmView.as_view(
             template_name='registration/password_reset_confirm.html',
             success_url='/password/reset/complete/'
         ),
         name='password_reset_confirm'),
    path('password/reset/complete/',
         auth_views.PasswordResetCompleteView.as_view(
             template_name='registration/password_reset_complete.html'
         ),
         name='password_reset_complete'),
    path('api/tasks/', include('tasks.urls')),  # Include tasks URLs
    path('api/', include('gamification.urls')),
    path('auth/', include('djoser.urls.authtoken')),
    path('api/', include('sustainability.urls')),
    path('social/', include('social_django.urls', namespace='social')),
    path('api/wearables/', include('wearables.urls')),
    path('api/', include('community.urls')),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)