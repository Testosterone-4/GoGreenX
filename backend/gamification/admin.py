from django.contrib import admin
from .models import Badge, UserBadge, UserPoints, PointsTransaction, Notification


admin.site.register(Badge)
admin.site.register(UserBadge)
admin.site.register(UserPoints)
admin.site.register(PointsTransaction)
admin.site.register(Notification)
# Register your models here.
