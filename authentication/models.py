from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('Admin', 'Admin'),
        ('Staff', 'Staff'),
        ('User', 'User'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    height = models.PositiveSmallIntegerField(null=True, blank=True, help_text="Height in cm")
    profile_image = models.TextField(null=True, blank=True, help_text="Base64 or image URL string")
    preferred_thrill = models.PositiveSmallIntegerField(default=2)
    age = models.PositiveSmallIntegerField(null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='User')
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    gender = models.CharField(max_length=20, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=50, null=True, blank=True)
    state = models.CharField(max_length=50, null=True, blank=True)
    country = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()
    else:
        UserProfile.objects.get_or_create(user=instance)
