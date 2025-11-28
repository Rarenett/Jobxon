from django.db import models
from users_app.models import CustomUser


class Employee(models.Model):
    employee_code = models.CharField(
        max_length=10,
        unique=True,
        editable=False,
        null=True,
        blank=True
    )

    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=200)

    department = models.ForeignKey(
        "admin_app.Department",
        on_delete=models.SET_NULL,
        null=True
    )
    designation = models.ForeignKey(
        "admin_app.Designation",
        on_delete=models.SET_NULL,
        null=True
    )

    user = models.OneToOneField(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    # ⭐ Auto-generate employee_code JXE001, JXE002, ...
    def save(self, *args, **kwargs):
        if not self.employee_code:
            last_emp = Employee.objects.order_by('-id').first()

            if last_emp and last_emp.employee_code:
                last_number = int(last_emp.employee_code.replace("JXE", ""))
                new_number = last_number + 1
            else:
                new_number = 1

            self.employee_code = f"JXE{new_number:03d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.employee_code})"
