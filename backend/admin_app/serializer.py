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
