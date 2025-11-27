from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
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
    # Existing description field (kept for backward compatibility, or can be used as short bio)
    description = models.TextField(blank=True, null=True) 
    # New Requested Field
    about = models.TextField(blank=True, null=True, help_text="Detailed about section")
    
    location = models.CharField(max_length=255, blank=True, null=True)
    # New Requested Field
    address = models.TextField(blank=True, null=True, help_text="Full physical address")
    # New Requested Field
    map_iframe = models.TextField(blank=True, null=True, help_text="Google Maps Embed Iframe Code")
    
    phone = models.CharField(max_length=20, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    # Company Details
    established_since = models.CharField(max_length=10, blank=True, null=True)
    team_size = models.CharField(max_length=50, blank=True, null=True)
    
    # New Requested Field
    responsibilities = models.TextField(blank=True, null=True, help_text="General company responsibilities or culture")

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
    whatsapp = models.URLField(blank=True, null=True)
    pinterest = models.URLField(blank=True, null=True)
    tumblr = models.URLField(blank=True, null=True)

    # Video Links
    youtube_links = models.JSONField(default=list, blank=True, null=True)
    vimeo_links = models.JSONField(default=list, blank=True, null=True)

    # Status & Flags
    is_active = models.BooleanField(default=True)
    # New Requested Fields
    is_verified = models.BooleanField(default=False)
    is_favourite = models.BooleanField(default=False) # Global favourite/Featured status
    is_viewed = models.BooleanField(default=False) # Has been viewed/processed flag
    
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


class CompanyReview(models.Model):
    """Reviews for a specific company"""
    company = models.ForeignKey(
        CompanyProfile,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
   
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        default=5
    )
    review_title = models.CharField(max_length=200)
    review_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.company.name} by {self.user.username}"

    class Meta:
        verbose_name = "Company Review"
        verbose_name_plural = "Company Reviews"
        ordering = ['-created_at']