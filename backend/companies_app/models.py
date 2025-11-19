from django.db import models
from users_app.models import CustomUser

from django.db import models
from users_app.models import CustomUser


class CompanyProfile(models.Model):
    """Profile for employers/companies"""
    user = models.OneToOneField(
        CustomUser, 
        on_delete=models.CASCADE, 
        related_name='company_profile'
    )
    
    # Basic Information
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    # Company Details
    established_since = models.CharField(max_length=10, blank=True, null=True)
    team_size = models.CharField(max_length=50, blank=True, null=True)

    # Media
    logo = models.ImageField(upload_to='companies/logos/', blank=True, null=True)
    banner_image = models.ImageField(upload_to='companies/banners/', blank=True, null=True)
    video = models.FileField(upload_to='companies/videos/', blank=True, null=True)

    # Social Links
    facebook = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    youtube = models.URLField(blank=True, null=True)
    whatsapp = models.URLField(blank=True, null=True)  # Added
    pinterest = models.URLField(blank=True, null=True)  # Added
    tumblr = models.URLField(blank=True, null=True)  # Added

    # Video Links
    youtube_links = models.JSONField(default=list, blank=True, null=True)  # Added
    vimeo_links = models.JSONField(default=list, blank=True, null=True)  # Added

    # Status
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Company Profile"
        verbose_name_plural = "Company Profiles"


class CompanyPhoto(models.Model):
    """Multiple photos for a company"""
    company = models.ForeignKey(
        CompanyProfile, 
        on_delete=models.CASCADE, 
        related_name='photos'
    )
    image = models.ImageField(upload_to='companies/photos/')
    caption = models.CharField(max_length=100, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company.name} - Photo"
    
    class Meta:
        verbose_name = "Company Photo"
        verbose_name_plural = "Company Photos"
