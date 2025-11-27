from django.db import models
from rest_framework import serializers

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')  # No translation
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('user_type', 'admin')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('candidate', 'Candidate'),
        ('employer', 'Employer'),
        ('admin', 'Admin'),
    )
    
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField('email address', unique=True)  # Simple string
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'user_type']
    
    objects = CustomUserManager()
    
    def __str__(self):
        return f"{self.email} ({self.user_type})"

from django.conf import settings
from django.db import models
from django.db import models
from django.conf import settings

class CandidateProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='candidate_profile'
    )

    # ✅ Profile Image
    profile_image = models.ImageField(
        upload_to="candidate_profiles/",
        blank=True,
        null=True
    )

    # Basic Info
    full_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=30, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    # Professional
    qualification = models.CharField(max_length=255, blank=True, null=True)
    languages = models.CharField(max_length=255, blank=True, null=True)
    job_category = models.CharField(max_length=255, blank=True, null=True)
    experience = models.CharField(max_length=100, blank=True, null=True)

    # Salary
    current_salary = models.CharField(max_length=100, blank=True, null=True)
    expected_salary = models.CharField(max_length=100, blank=True, null=True)
    age = models.PositiveIntegerField(blank=True, null=True)

    # Location
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    postcode = models.CharField(max_length=20, blank=True, null=True)
    full_address = models.TextField(blank=True, null=True)

    description = models.TextField(blank=True, null=True)

    # Meta
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name or f"Profile of {self.user.email}"

    class Meta:
        verbose_name = "Candidate Profile"
        verbose_name_plural = "Candidate Profiles"
