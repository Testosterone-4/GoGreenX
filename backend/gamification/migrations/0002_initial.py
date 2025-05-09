# Generated by Django 5.2 on 2025-04-28 23:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('gamification', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='gamification_notifications', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='pointstransaction',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='points_transactions', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='userbadge',
            name='badge',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='users', to='gamification.badge'),
        ),
        migrations.AddField(
            model_name='userbadge',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='badges', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='userpoints',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='points_account', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='userbadge',
            unique_together={('user', 'badge')},
        ),
    ]
