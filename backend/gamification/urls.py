from django.urls import path
from .views import (
    BadgeListView,
    UserBadgeListView,
    UserPointsDetailView,
    LeaderboardView,
    PointsTransactionListView,
    NotificationListView,
    NotificationMarkAsReadView,
    NotificationMarkAllAsReadView
)

urlpatterns = [
    # Badges
    path('badges/', BadgeListView.as_view(), name='badge-list'),
    path('my-badges/', UserBadgeListView.as_view(), name='user-badge-list'),

    # Points
    path('points/', UserPointsDetailView.as_view(), name='user-points'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),

    # Transactions
    path('transactions/', PointsTransactionListView.as_view(), name='transactions'),

    # Notifications
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/mark-as-read/',
         NotificationMarkAsReadView.as_view(),
         name='notification-mark-read'),
    path('notifications/mark-all-read/',
         NotificationMarkAllAsReadView.as_view(),
         name='notification-mark-all-read'),
]