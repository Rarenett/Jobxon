from rest_framework import serializers
from users_app.models import CandidateProfile
from .models import CandidateKeySkills
from .models import ResumeHeadline
from .models import CandidateEmployment
from .models import CandidateEducation
from .models import CandidateITSkill
from .models import PricingPlan
from .models import PersonalDetail
from .models import DesiredCareerProfile
from .models import CandidateProject
from .models import ResumeAttachment
from .models import ProfileSummary



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


class ResumeHeadlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeHeadline
        fields = ['id', 'headline']



class CandidateKeySkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateKeySkills
        fields = ['id', 'skills']

# admin_app/serializer.py


class EmploymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateEmployment
        fields = "__all__"
        read_only_fields = ["user"]

class CandidateEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateEducation
        fields = "__all__"
        read_only_fields = ["user"]



class CandidateITSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateITSkill
        fields = "__all__"
        read_only_fields = ["user"]



class PricingPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingPlan
        fields = '__all__'




class CandidateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProject
        fields = "__all__"
        read_only_fields = ['user', 'created_at', 'updated_at']



class DesiredCareerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DesiredCareerProfile
        fields = "__all__"
        read_only_fields = ["user", "created_at"]



class PersonalDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonalDetail
        fields = '__all__'
        read_only_fields = ['user']


class ResumeAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeAttachment
        fields = ["id", "file", "uploaded_at"]


from .models import (
    OnlineProfile, WorkSample, ResearchPublication,
    Presentation, Certification, Patent
)


class OnlineProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnlineProfile
        fields = "__all__"
        read_only_fields = ["user"]


class WorkSampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkSample
        fields = "__all__"
        read_only_fields = ["user"]


class ResearchPublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchPublication
        fields = "__all__"
        read_only_fields = ["user"]


class PresentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presentation
        fields = "__all__"
        read_only_fields = ["user"]


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = "__all__"
        read_only_fields = ["user"]

class PatentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patent
        fields = '__all__'
        read_only_fields = ['user']



class ProfileSummarySerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = ProfileSummary
        fields = "__all__"
