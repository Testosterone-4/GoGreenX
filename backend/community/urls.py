from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import  GroupViewSet, PostViewSet, CommentViewSet,UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]