from rest_framework import serializers
from users_app.models import CandidateProfile


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
