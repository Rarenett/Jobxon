from django.db import models
from django.utils.text import slugify

from companies_app.models import CompanyProfile
from users_app.models import CustomUser


class JobCategory(models.Model):
    name = models.CharField(max_length=255)
    icon = models.CharField(max_length=100, blank=True, null=True, help_text="FontAwesome icon class (e.g., fa-solid fa-laptop)")
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super(JobCategory, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Job Categories"


class JobType(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Job Types"



#post a new job

class Job(models.Model):
    title = models.CharField(max_length=200)
    category = models.ForeignKey(JobCategory, on_delete=models.SET_NULL, null=True)
    job_type = models.ForeignKey(JobType, on_delete=models.SET_NULL, null=True)
    company = models.ForeignKey(CompanyProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='jobs')  # NEW FIELD
    offered_salary = models.CharField(max_length=50, blank=True, null=True)
    experience = models.CharField(max_length=100, blank=True, null=True)
    qualification = models.CharField(max_length=200, null=True, blank=True)
    gender = models.CharField(
        max_length=10,
        choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other'), ('Any', 'Any')]
    )
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    location = models.CharField(max_length=255, null=True, blank=True)
    latitude = models.CharField(max_length=50, blank=True, null=True)
    longitude = models.CharField(max_length=50, null=True, blank=True)
    email = models.EmailField()
    website = models.URLField(null=True, blank=True)
    est_since = models.CharField(max_length=100, blank=True)
    complete_address = models.TextField(blank=True, null=True)
    description = models.TextField()
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    posted_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(max_length=250, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            orig = self.slug
            cnt = 1
            while Job.objects.filter(slug=self.slug).exists():
                self.slug = f'{orig}-{cnt}'
                cnt += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title