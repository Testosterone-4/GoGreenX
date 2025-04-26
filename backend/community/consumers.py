import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Notification

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if self.user.is_anonymous:
            await self.close()
        else:
            self.group_name = f'notifications_{self.user.id}'
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()

    async def disconnect(self, close_code):
        if not self.user.is_anonymous:
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def send_notification(self, event):
        notification = event['notification']
        await self.send(text_data=json.dumps(notification))

    @database_sync_to_async
    def get_notification_data(self, notification_id):
        notification = Notification.objects.get(id=notification_id)
        return {
            'id': notification.id,
            'type': notification.notification_type,
            'sender': notification.sender.username,
            'message': self.get_notification_message(notification),
            'is_read': notification.is_read,
            'created_at': notification.created_at.strftime('%Y-%m-%d %H:%M'),
        }

    def get_notification_message(self, notification):
        if notification.notification_type == 'like_post':
            return f"{notification.sender.username} liked your post"
        elif notification.notification_type == 'like_comment':
            return f"{notification.sender.username} liked your comment"
        elif notification.notification_type == 'comment':
            return f"{notification.sender.username} commented on your post"
        elif notification.notification_type == 'follow':
            return f"{notification.sender.username} started following you"
        elif notification.notification_type == 'group_invite':
            return f"{notification.sender.username} invited you to moderate {notification.group.name}"
        return "New notification"