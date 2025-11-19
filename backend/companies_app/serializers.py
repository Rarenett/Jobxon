from rest_framework import serializers
from .models import CompanyProfile, CompanyPhoto


class CompanyPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyPhoto
        fields = ['id', 'image', 'caption', 'uploaded_at']


class CompanyBasicInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = ['name', 'phone', 'website', 'established_since', 'team_size', 'location', 'description']  # ✅ Added 'location'


class CompanyLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = ['logo']


class CompanyBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = ['banner_image']


class CompanySocialLinksSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = ['facebook', 'twitter', 'linkedin', 'whatsapp', 'instagram', 'pinterest', 'tumblr', 'youtube']


class CompanyVideoLinksSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = ['youtube_links', 'vimeo_links', 'video']


class CompanyProfileSerializer(serializers.ModelSerializer):
    photos = CompanyPhotoSerializer(many=True, read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = CompanyProfile
        fields = [
            'id', 'name', 'description', 'location', 'email', 'phone', 
            'website', 'established_since', 'team_size', 'logo', 'banner_image',
            'video', 'facebook', 'twitter', 'linkedin', 'instagram', 'youtube',
            'whatsapp', 'pinterest', 'tumblr', 'youtube_links', 'vimeo_links',
            'photos', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'email', 'created_at', 'updated_at']
