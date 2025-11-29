from rest_framework import serializers
from .models import CompanyProfile, CompanyPhoto, CompanyReview, TopCompany


class CompanyPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyPhoto
        fields = ['id', 'image', 'caption', 'uploaded_at']


class CompanyReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyReview
        # Removed user, user_name, user_avatar
        fields = ['id', 'company', 'rating', 'review_title', 'review_content', 'created_at']
        read_only_fields = ['created_at']


class CompanyBasicInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = [
            'name', 'phone', 'website', 'established_since', 
            'team_size', 'location', 'address', 'description', 
            'about', 'map_iframe', 'responsibilities'
        ]


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
    reviews = CompanyReviewSerializer(many=True, read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = CompanyProfile
        fields = [
            'id', 'name', 'description', 'about', 'location', 'address', 
            'map_iframe', 'responsibilities', 'email', 'phone', 
            'website', 'established_since', 'team_size', 'logo', 'banner_image',
            'video', 'facebook', 'twitter', 'linkedin', 'instagram', 'youtube',
            'whatsapp', 'pinterest', 'tumblr', 'youtube_links', 'vimeo_links',
            'photos', 'reviews', 'average_rating', 'review_count',
            'is_active', 'is_verified', 'is_favourite', 'is_viewed',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'email', 'created_at', 'updated_at', 'reviews']

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return sum([r.rating for r in reviews]) / len(reviews)
        return 0

    def get_review_count(self, obj):
        return obj.reviews.count()
    read_only_fields = ['id', 'email', 'created_at', 'updated_at']


class TopCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = TopCompany
        fields = ['id', 'name', 'logo', 'website_url', 'is_featured', 'display_order', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate_logo(self, value):
        """Validate logo file size and type"""
        if value:
            # Check file size (max 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Logo file size should not exceed 5MB")
            
            # Check file type
            if not value.content_type.startswith('image/'):
                raise serializers.ValidationError("Only image files are allowed")
        
        return value