from django.db import models

<<<<<<< HEAD
#
from django.db import models
from django.conf import settings


class CandidateAdditionalDetail(models.Model):
    TYPE_CHOICES = [
        ('online_profile', 'Online Profile'),
        ('work_sample', 'Work Sample'),
        ('research', 'Research / Publication'),
        ('presentation', 'Presentation'),
        ('certification', 'Certification'),
        ('patent', 'Patent'),
    ]

    candidate = models.ForeignKey(
        settings.AUTH_USER_MODEL,   # ✅ FIXED HERE
        on_delete=models.CASCADE,
        related_name='additional_details'
    )

    detail_type = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES
    )

    title = models.CharField(max_length=255, blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    organization = models.CharField(max_length=255, blank=True, null=True)
    application_number = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=100, blank=True, null=True)
    published_on = models.DateField(blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.candidate} - {self.detail_type}"
=======
# Create your models here.
>>>>>>> main
