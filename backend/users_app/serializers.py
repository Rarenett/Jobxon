from rest_framework import serializers
from .models import CustomUser,CustomUserManager,CandidateProfile
from companies_app.models import CompanyPhoto, CompanyProfile
from django.contrib.auth import authenticate


# -------------------------
# User Serializer
# -------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'user_type']


# -------------------------
# Register Serializer
# -------------------------
class RegisterSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(write_only=True, required=False)
    name = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'user_type', 'phone', 'name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        phone = validated_data.pop('phone', None)
        name = validated_data.pop('name', '')
        user_type = validated_data.get('user_type')
        
        # Create user
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            user_type=user_type
        )
        
        # Create profile based on user_type
        if user_type == 'candidate':
            CandidateProfile.objects.create(user=user, name=name, phone=phone)
        elif user_type == 'employer':
            CompanyProfile.objects.create(user=user, name=name, phone=phone)
        
        return user


# -------------------------
# Login Serializer
# -------------------------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        # Since USERNAME_FIELD = 'email', authenticate with email directly
        user = authenticate(request=self.context.get('request'), 
                          username=email,  # Django uses 'username' parameter even when USERNAME_FIELD is email
                          password=password)
        
        if not user:
            raise serializers.ValidationError({"non_field_errors": ["Invalid email or password"]})
        
        if not user.is_active:
            raise serializers.ValidationError({"non_field_errors": ["Account is disabled"]})
        
        return user

# -------------------------
# Candidate Profile Serializer
# -------------------------
class CandidateProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = CandidateProfile
        fields = '__all__'
        read_only_fields = ['user']


class CompanyPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyPhoto
        fields = ['id', 'image', 'caption', 'uploaded_at']


# -------------------------
# Company Profile Serializer (UPDATED)
# -------------------------
class CompanyProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    photos = CompanyPhotoSerializer(many=True, read_only=True)  # ✅ ADD THIS LINE
    
    class Meta:
        model = CompanyProfile
        fields = [
            'id', 'name', 'description', 'location', 'email', 'phone',
            'website', 'established_since', 'team_size', 'logo', 'banner_image',
            'video', 'facebook', 'twitter', 'linkedin', 'instagram', 'youtube',
            'whatsapp', 'pinterest', 'tumblr', 'youtube_links', 'vimeo_links',
            'photos',  # ✅ INCLUDE photos FIELD
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'id', 'email', 'created_at', 'updated_at']