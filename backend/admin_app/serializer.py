from rest_framework import serializers
from .models import CompanyProfile, CompanyPhoto


class CompanyPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyPhoto
        fields = ['id', 'image', 'caption']


class CompanyProfileSerializer(serializers.ModelSerializer):
    photos = CompanyPhotoSerializer(many=True, read_only=True)
    email = serializers.ReadOnlyField()

    class Meta:
        model = CompanyProfile
        fields = [
            'id', 'user', 'name', 'description', 'location',
            'phone', 'website', 'established_since', 'team_size',
            'logo', 'banner_image', 'office_photos', 'video',
            'facebook', 'twitter', 'linkedin', 'instagram', 'youtube',
            'is_active', 'created_at', 'updated_at', 'email', 'photos'
        ]
        read_only_fields = ['created_at', 'updated_at']
