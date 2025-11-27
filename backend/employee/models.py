from django.db import models
from users_app.models import CustomUser


class Employee(models.Model):
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=200)

    department = models.ForeignKey("admin_app.Department", on_delete=models.SET_NULL, null=True)   # ⭐ NEW
    designation = models.ForeignKey("admin_app.Designation", on_delete=models.SET_NULL, null=True) # ⭐ NEW

    user = models.OneToOneField(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
