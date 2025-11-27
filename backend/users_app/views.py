from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .models import CustomUser,CandidateProfile,CustomUserManager
from .serializers import (
    CandidateBasicInfoSerializer,
    RegisterSerializer, 
    LoginSerializer, 
    UserSerializer,
    CandidateProfileSerializer,
    CompanyProfileSerializer

)
# -------------------------
# Register ViewSet
# -------------------------
class RegisterViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = RefreshToken.for_user(user)
            return Response({
                "user": UserSerializer(user).data,
                "refresh": str(token),
                "access": str(token.access_token),
                "message": "Registration successful"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# Login ViewSet
# -------------------------
class LoginViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token = RefreshToken.for_user(user)
            return Response({
                "user": UserSerializer(user).data,
                "refresh": str(token),
                "access": str(token.access_token),
                "message": "Login successful"
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# Google Login (Optional)
# -------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    token = request.data.get('credential')
    if not token:
        return Response({"detail": "No token provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Validate token with Google
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            '151808131440-2mbq1163sb3i49fkao08225v2ea0rg5p.apps.googleusercontent.com'
        )

        email = idinfo.get('email')
        name = idinfo.get('name', 'Google User')
        if not email:
            return Response({"detail": "Email not found in token"}, status=status.HTTP_400_BAD_REQUEST)

        # Get or create user
        user, created = CustomUser.objects.get_or_create(
            email=email, 
            defaults={
                'username': email.split('@')[0],
                'user_type': 'candidate'  # Default to candidate
            }
        )
        
        # Create profile if new user
        if created:
            CandidateProfile.objects.create(user=user, name=name)

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "message": "Google login successful"
        })

    except ValueError:
        return Response({"detail": "Invalid Google token"}, status=status.HTTP_400_BAD_REQUEST)


# -------------------------
# Profile View
# -------------------------
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    
    if request.method == 'GET':
        # Get profile based on user_type
        if user.user_type == 'candidate':
            profile = getattr(user, 'candidate_profile', None)
            if profile:
                return Response({
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "user_type": user.user_type,
                    "profile": CandidateProfileSerializer(profile).data
                })
        elif user.user_type == 'employer':
            profile = getattr(user, 'company_profile', None)
            if profile:
                return Response({
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "user_type": user.user_type,
                    "profile": CompanyProfileSerializer(profile).data
                })
        
        return Response({"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
    
    elif request.method == 'PUT':
        # Update profile
        if user.user_type == 'candidate':
            profile = getattr(user, 'candidate_profile', None)
            if profile:
                serializer = CandidateProfileSerializer(profile, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif user.user_type == 'employer':
            profile = getattr(user, 'company_profile', None)
            if profile:
                serializer = CompanyProfileSerializer(profile, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import CandidateProfile
from .serializers import CandidateProfileSerializer, CandidateBasicInfoSerializer

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import CandidateProfile
from .serializers import CandidateProfileSerializer, CandidateBasicInfoSerializer


class CandidateProfileViewSet(viewsets.ModelViewSet):
    queryset = CandidateProfile.objects.filter(is_active=True)
    serializer_class = CandidateProfileSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    authentication_classes = [JWTAuthentication]

    def get_permissions(self):
        """Public read, authenticated write"""
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        # Only allow users to update their own profile
        if self.action in ["update", "partial_update", "destroy"]:
            if self.request.user.is_authenticated:
                return CandidateProfile.objects.filter(user=self.request.user)
            return CandidateProfile.objects.none()
        return super().get_queryset()

    # ✅ PUT – UPDATE BASIC INFO
    @action(detail=False, methods=['put'], url_path='update-basic-info')
    def update_basic_info(self, request):
        print("User:", request.user)
        print("Is authenticated:", request.user.is_authenticated)
        print("Data received:", request.data)

        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

        profile, created = CandidateProfile.objects.get_or_create(user=request.user)

        serializer = CandidateBasicInfoSerializer(
            profile,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Profile updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            "message": "Validation failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    # ✅ GET – FETCH BASIC INFO
    @action(detail=False, methods=['get'], url_path='get-basic-info', permission_classes=[IsAuthenticated])
    def get_basic_info(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
        except CandidateProfile.DoesNotExist:
            return Response({}, status=status.HTTP_200_OK)

        serializer = CandidateBasicInfoSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
