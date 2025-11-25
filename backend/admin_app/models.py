from django.db import models

from django.conf import settings

class ResumeHeadline(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resume_headline_profile"
    )
    
    headline = models.CharField(max_length=255, blank=True, null=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - Headline"

from django.db import models
from django.conf import settings

class CandidateKeySkills(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    skills = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

# users_app/models.py (or wherever your model lives)

from django.db import models
from django.conf import settings

class CandidateEmployment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="employments")

    designation = models.CharField(max_length=255)
    organization = models.CharField(max_length=255)

    is_current_company = models.BooleanField(default=False)

    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    job_description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - {self.designation}"


# models.py
from django.db import models
from django.conf import settings

class CandidateEducation(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="educations"
    )

    # Level of education
    level = models.CharField(
        max_length=100,
        choices=[
            ("Graduation/Diploma", "Graduation/Diploma"),
            ("Masters/Post-Graduation", "Masters/Post-Graduation"),
            ("PhD/Doctorate", "PhD/Doctorate"),
        ]
    )

    # Course name
    course = models.CharField(max_length=255)

    # University / Institute
    university = models.CharField(max_length=255)

    # Duration
    start_year = models.IntegerField(null=True, blank=True)
    end_year = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - {self.course}"



from django.db import models
from django.conf import settings

class CandidateITSkill(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="it_skills"
    )

    skill_name = models.CharField(max_length=255)
    version = models.CharField(max_length=50, blank=True, null=True)

    last_used_year = models.IntegerField(blank=True, null=True)

    experience_years = models.IntegerField(blank=True, null=True)
    experience_months = models.IntegerField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - {self.skill_name}"
