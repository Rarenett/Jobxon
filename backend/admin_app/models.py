from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings  # for custom user model

class CompanyProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='company_profile')

    name = models.CharField(max_length=200, unique=True)
    description = models.TextField()
    location = models.CharField(max_length=255)

    # Removed email field since it comes from user.email

    phone = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    established_since = models.CharField(max_length=10, blank=True, null=True)
    team_size = models.CharField(max_length=50, blank=True, null=True)

    # Media
    logo = models.ImageField(upload_to='companies/logo/', blank=True, null=True)
    banner_image = models.ImageField(upload_to='companies/banner/', blank=True, null=True)
    office_photos = models.ImageField(upload_to='companies/photos/', blank=True, null=True)
    video = models.FileField(upload_to='companies/videos/', blank=True, null=True)

    # Social Links
    facebook = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    youtube = models.URLField(blank=True, null=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def email(self):
        return self.user.email
    
class CompanyPhoto(models.Model):
    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='companies/photos/')
    caption = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.company.name} Photo"

