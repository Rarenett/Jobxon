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


class PricingPlan(models.Model):
    PLAN_CHOICES = [
        ('Basic', 'Basic'),
        ('Standard', 'Standard'),
        ('Extended', 'Extended'),
    ]
    name = models.CharField(max_length=50, choices=PLAN_CHOICES)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    frequency = models.CharField(max_length=20, default='Monthly')
    features = models.JSONField()  # Store list of features as JSON
    recommended = models.BooleanField(default=False)

    def _str_(self):
        return self.name



from django.db import models
from django.conf import settings


class CandidateProject(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="projects"
    )

    project_title = models.CharField(max_length=255)

    # From dropdown "Education"
    education = models.CharField(max_length=100, blank=True, null=True)

    client = models.CharField(max_length=255, blank=True, null=True)

    # Radio: In Progress / Finished
    STATUS_CHOICES = (
        ('in_progress', 'In Progress'),
        ('finished', 'Finished'),
    )
    project_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='in_progress'
    )

    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    project_details = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.project_title} - {self.user}"

from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class DesiredCareerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="desired_profile")

    industry = models.CharField(max_length=255, null=True, blank=True)
    functional_area = models.CharField(max_length=255, null=True, blank=True)
    role = models.CharField(max_length=255, null=True, blank=True)

    job_type = models.CharField(
        max_length=50,
        choices=[
            ('Permanent', 'Permanent'),
            ('Contractual', 'Contractual'),
        ],
        null=True, blank=True
    )

    employment_type = models.CharField(
        max_length=50,
        choices=[
            ('Full Time', 'Full Time'),
            ('Part Time', 'Part Time'),
        ],
        null=True, blank=True
    )

    preferred_shift = models.CharField(
        max_length=50,
        choices=[
            ('Day', 'Day'),
            ('Night', 'Night'),
            ('Part Time', 'Part Time'),
        ],
        null=True, blank=True
    )

    availability_to_join = models.DateField(null=True, blank=True)

    salary_currency = models.CharField(
        max_length=20,
        choices=[
            ('USD', 'US Dollars'),
            ('INR', 'Indian Rupees'),
        ],
        null=True, blank=True
    )

    salary_lakh = models.CharField(max_length=20, null=True, blank=True)
    salary_thousand = models.CharField(max_length=20, null=True, blank=True)

    desired_location = models.CharField(max_length=255, null=True, blank=True)
    desired_industry = models.CharField(max_length=255, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - Desired Career Profile"

from django.db import models
from django.conf import settings

class PersonalDetail(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="personal_detail"
    )

    date_of_birth = models.DateField(null=True, blank=True)

    gender = models.CharField(max_length=10, choices=[
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    ], null=True, blank=True)

    permanent_address = models.TextField(null=True, blank=True)
    hometown = models.CharField(max_length=150, null=True, blank=True)
    pincode = models.CharField(max_length=20, null=True, blank=True)

    marital_status = models.CharField(max_length=20, choices=[
        ('Single', 'Single'),
        ('Married', 'Married'),
    ], null=True, blank=True)

    passport_number = models.CharField(max_length=50, null=True, blank=True)

    assistance_needed = models.TextField(null=True, blank=True)

    work_permit_country = models.CharField(max_length=100, null=True, blank=True)

    languages = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.user} - Personal Details"


# models.py

from django.conf import settings
from django.db import models

class ResumeAttachment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="resume_attachments"
    )
    file = models.FileField(upload_to="resumes/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - Resume"



from django.conf import settings
from django.db import models


# 1️⃣ Online Profile (LinkedIn, Facebook, etc.)
class OnlineProfile(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="online_profiles"
    )
    profile_name = models.CharField(max_length=200)
    url = models.URLField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user} - {self.profile_name}"


# 2️⃣ Work Sample (GitHub, projects, etc.)
class WorkSample(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="work_samples"
    )
    work_title = models.CharField(max_length=200)
    url = models.URLField()
    duration_from = models.DateField(null=True, blank=True)
    duration_to = models.DateField(null=True, blank=True)
    currently_working = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user} - {self.work_title}"


# 3️⃣ Research Publication / White Paper
class ResearchPublication(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="research_publications"
    )
    title = models.CharField(max_length=255)
    url = models.URLField()
    published_on = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user} - {self.title}"


# 4️⃣ Presentation
class Presentation(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="presentations"
    )
    title = models.CharField(max_length=255)
    url = models.URLField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user} - {self.title}"


# 5️⃣ Certification
class Certification(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="certifications"
    )
    certification_name = models.CharField(max_length=255)
    certification_body = models.CharField(max_length=255)
    year = models.IntegerField()

    def __str__(self):
        return f"{self.user} - {self.certification_name}"


# 6️⃣ Patent
class Patent(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="patents"
    )
    title = models.CharField(max_length=255)
    url = models.URLField()
    patent_office = models.CharField(max_length=255)
    application_number = models.CharField(max_length=255)
    STATUS_CHOICES = (
        ("issued", "Patent Issued"),
        ("pending", "Patent Pending"),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    published_on = models.DateField(null=True, blank=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user} - {self.title}"
