from rest_framework import serializers
from users_app.models import CustomUser
from .models import Employee

class EmployeeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            'id', 'name', 'phone', 'email', 'password',
            'department', 'designation'   #ADDED
        ]

    def create(self, validated_data):
        employee = Employee.objects.create(**validated_data)

        user = CustomUser.objects.create_user(
            username=employee.name,
            email=employee.email,
            password=employee.password,
            user_type="employee"
        )

        employee.user = user
        employee.save()

        return employee

class EmployeeListSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    designation_name = serializers.CharField(source="designation.name", read_only=True)

    class Meta:
        model = Employee
        fields = [
            "id",
            "employee_code",      # ⭐ MUST BE HERE
            "name",
            "phone",
            "email",
            "department_name",
            "designation_name",
        ]
