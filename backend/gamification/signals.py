from django.dispatch import receiver
from django.db.models.signals import post_save
from users.models import User
from .models import UserPoints, PointsTransaction, UserBadge, Badge, Notification
from tasks.models import Task
from sustainability.models import SustainabilityAction

@receiver(post_save, sender=Task)
def update_points_from_task(sender, instance, created, **kwargs):
    if instance.is_completed and not getattr(instance, 'points_processed', False):
        # update user points
        user = instance.user
        points_to_add = instance.points_rewarded
        user_points, created = UserPoints.objects.get_or_create(user=user)
        user_points.total_points += points_to_add
        user_points.save()

        # create points transaction
        PointsTransaction.objects.create(
            user=user,
            amount=points_to_add,
            source='task',
            reference_id=instance.id
        )

        check_and_award_badges(user)
        instance.points_processed = True
        instance.save()

@receiver(post_save, sender=SustainabilityAction)
def update_points_from_sustainability(sender, instance, created, **kwargs):
    if created and not getattr(instance, 'points_processed', False):
        user = instance.user
        points_to_add = instance.points_rewarded
        user_points, created = UserPoints.objects.get_or_create(user=user)
        user_points.total_points += points_to_add
        user_points.save()

        # create points transaction
        PointsTransaction.objects.create(
            user=user,
            amount=points_to_add,
            source='sustainability',
            reference_id=instance.id
        )

        check_and_award_badges(user)
        instance.points_processed = True
        instance.save()

def check_and_award_badges(user):
    user_points = UserPoints.objects.get(user=user)
    badges = Badge.objects.filter(points_required__lte=user_points.total_points).exclude(
        id__in=user.badges.values_list('badge', flat=True)
    )

    for badge in badges:
        UserBadge.objects.create(user=user, badge=badge)

@receiver(post_save, sender=UserBadge)
def notify_user_about_new_badge(sender, instance, created, **kwargs):
    """
    Notify the user when they earn a new badge.
    """
    if created:
        user = instance.user
        badge = instance.badge
        message = f"Congratulations! You've earned the '{badge.name}' badge."

        # Create a new notification for the user
        Notification.objects.create(
            user=user,
            message=message,
            badge=badge
        )

@receiver(post_save, sender=User)
def notify_user_about_new_badge(sender, instance, created, **kwargs):

    if created:
        UserPoints.objects.create(user = instance)










