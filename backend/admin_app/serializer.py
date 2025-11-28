from rest_framework import serializers
from users_app.models import CandidateProfile
from .models import BankDetail,DocumentType,Department,Designation,EmployeeDocument


class CandidateProfileListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = [
            'id',
            'full_name',
            'phone',
            'email',
            'website',
            'qualification',
            'languages',
            'job_category',
            'experience',
            'current_salary',
            'expected_salary',
            'age',
            'country',
            'city',
            'postcode',
            'full_address',
            'description',
        ]

from rest_framework import serializers
from .models import ResumeHeadline

class ResumeHeadlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeHeadline
        fields = ['id', 'headline']


from rest_framework import serializers
from .models import CandidateKeySkills

class CandidateKeySkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateKeySkills
        fields = ['id', 'skills']

# admin_app/serializer.py

from rest_framework import serializers
from .models import CandidateEmployment

class EmploymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateEmployment
        fields = "__all__"
        read_only_fields = ["user"]
from rest_framework import serializers
from .models import CandidateEducation

class CandidateEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateEducation
        fields = "__all__"
        read_only_fields = ["user"]


from rest_framework import serializers
from .models import CandidateITSkill

class CandidateITSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateITSkill
        fields = "__all__"
        read_only_fields = ["user"]


from rest_framework import serializers
from .models import PricingPlan

class PricingPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingPlan
        fields = '__all__'

# Bank Details

class BankDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankDetail
        fields = [
            'id',
            'bank_name',
            'ifsc_code',
            'account_no',
            'mode_of_payment',
            'pan_no',
            'uan_no',
            'esic_no',
            'created_at',
            'employee'
        ]
        read_only_fields = ['employee']
# Employe Documents

# serializers.py

class DocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentType
        fields = ['id', 'name', 'description', 'created_at']




class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Designation
        fields = ["id", "department", "name", "description", "created_at"]

class DepartmentSerializer(serializers.ModelSerializer):
    designations = DesignationSerializer(many=True, read_only=True)

    class Meta:
        model = Department
        fields = ["id", "name", "description", "designations", "created_at"]




class EmployeeDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDocument
        fields = "__all__"


