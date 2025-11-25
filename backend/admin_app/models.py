from django.db import models

# Create your models here.
from django.db import models

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

    def __str__(self):
        return self.name
