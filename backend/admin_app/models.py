from django.db import models 
from employee.models import Employee

from django.conf import settings
from django.contrib.auth.models import User


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

class FAQ(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question


# Bank Details
class BankDetail(models.Model):
    employee = models.ForeignKey(Employee,on_delete=models.CASCADE,null=True,blank=True)

    bank_name = models.CharField(max_length=255)
    ifsc_code = models.CharField(max_length=50)
    account_no = models.CharField(max_length=50)
    mode_of_payment = models.CharField(max_length=100)
    pan_no = models.CharField(max_length=20)
    uan_no = models.CharField(max_length=20)
    esic_no = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.bank_name

#Employe Documents
# models.py

class DocumentType(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)   # NEW FIELD
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Department(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
class Designation(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="designations")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("department", "name")

    def __str__(self):
        return f"{self.department.name} - {self.name}"




class EmployeeDocument(models.Model):
    employee = models.ForeignKey(Employee,on_delete=models.CASCADE,null=True,blank=True)
    document_type = models.ForeignKey(DocumentType, on_delete=models.CASCADE)
    document = models.FileField(upload_to="employee_documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.Employee.name} - {self.document_type.name}"
