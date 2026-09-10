from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import CustomUserManager

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    organizations = models.ManyToManyField(
        "organizations.Organization",
        blank=True,
        related_name="users",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()