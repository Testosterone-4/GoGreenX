from django.db import models
from django.conf import settings



class Group(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='group_memberships')
    moderators = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='moderated_groups')
    is_private = models.BooleanField(default=False)

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, null=True, blank=True,related_name='posts_group')
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL,related_name='liked_posts')

class Comment(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_comments')


