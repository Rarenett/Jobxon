from django.db import models
from rest_framework import serializers
from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager


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


from django.db import models
from django.conf import settings

class CandidateProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='candidate_profile'
    )

    # ✅ Add candidate_id field
    candidate_id = models.CharField(
        max_length=20, 
        unique=True, 
        editable=False,
        blank=True,
        null=True,
        help_text="Auto-generated unique candidate ID (e.g., JXCAN001)"
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

    def save(self, *args, **kwargs):
        """Generate candidate_id automatically on first save"""
        if not self.candidate_id:
            self.candidate_id = self.generate_candidate_id()
        super().save(*args, **kwargs)

    @staticmethod
    def generate_candidate_id():
        """Generate unique candidate ID in format JXCAN001"""
        # Get the last candidate ID
        last_candidate = CandidateProfile.objects.all().order_by('id').last()
        
        if last_candidate and last_candidate.candidate_id:
            # Extract number from last ID (e.g., JXCAN001 -> 1)
            try:
                last_number = int(last_candidate.candidate_id.replace('JXCAN', ''))
                new_number = last_number + 1
            except (ValueError, AttributeError):
                new_number = 1
        else:
            new_number = 1
        
        # Format: JXCAN + 3-digit padded number
        return f'JXCAN{new_number:03d}'

    def __str__(self):
        return f"{self.candidate_id} - {self.full_name or self.user.email}"

    class Meta:
        verbose_name = "Candidate Profile"
        verbose_name_plural = "Candidate Profiles"
