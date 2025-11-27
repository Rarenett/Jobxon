from django.db.models import Q
# DRF imports
from rest_framework import viewsets, status, permissions, generics
from rest_framework.decorators import action
from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
    IsAuthenticatedOrReadOnly
)
from rest_framework.response import Response
from rest_framework.views import APIView
# User & Candidate models
from users_app.models import CandidateProfile
# Company models & serializers
from companies_app.models import CompanyProfile, CompanyPhoto, CompanyReview
from companies_app.serializers import (
    CompanyProfileSerializer,
    CompanyBasicInfoSerializer,
    CompanyLogoSerializer,
    CompanyBannerSerializer,
    CompanySocialLinksSerializer,
    CompanyVideoLinksSerializer,
    CompanyPhotoSerializer,
    CompanyReviewSerializer,
)
# Admin serializers
from admin_app.serializer import (
    CandidateITSkillSerializer,
    EmploymentSerializer,
    PricingPlanSerializer,
)
# Local models
from .models import (
    ResumeHeadline,
    CandidateEducation,
    CandidateITSkill,
    CandidateKeySkills,
    PersonalDetail,
    CandidateProject,
    CandidateEmployment,
    ResumeAttachment,
    OnlineProfile,
    WorkSample,
    ResearchPublication,
    Presentation,
    Certification,
    Patent,
    PricingPlan,
    DesiredCareerProfile,
)
# Local serializers
from .serializer import (
    CandidateEducationSerializer,
    PersonalDetailSerializer,
    CandidateProjectSerializer,
    CandidateKeySkillSerializer,
    CandidateProfileListSerializer,
    ResumeAttachmentSerializer,
    OnlineProfileSerializer,
    WorkSampleSerializer,
    ResearchPublicationSerializer,
    PresentationSerializer,
    CertificationSerializer,
    PatentSerializer,
    DesiredCareerProfileSerializer,
)



class CandidateProfileViewSet(viewsets.ModelViewSet):
    queryset = CandidateProfile.objects.all().order_by('-id')
    serializer_class = CandidateProfileListSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            {"message": "Deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )



def destroy(self, request, *args, **kwargs):
    instance = self.get_object()
    instance.delete()
    return Response({"message": "Deleted successfully"}, status=status.HTTP_200_OK)



class ResumeHeadlineView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        obj, _ = ResumeHeadline.objects.get_or_create(user=request.user)
        return Response({"headline": obj.headline or ""})

    def put(self, request):
        headline = request.data.get("headline")

        if not headline:
            return Response({"error": "Headline is required"}, status=400)

        obj, _ = ResumeHeadline.objects.get_or_create(user=request.user)
        obj.headline = headline
        obj.save()

        return Response({"message": "Saved successfully"})



class CandidateKeySkillViewSet(viewsets.ModelViewSet):
    serializer_class = CandidateKeySkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return the single skill record for the authenticated user"""
        return CandidateKeySkills.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Create or update skills (handles duplicate user_id)"""
        skills_obj, created = CandidateKeySkills.objects.update_or_create(
            user=request.user,
            defaults={'skills': request.data.get('skills', '')}
        )
        serializer = self.get_serializer(skills_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class CompanyProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing company profiles
    """
    queryset = CompanyProfile.objects.select_related('user').prefetch_related('photos', 'reviews').all()
    serializer_class = CompanyProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminUser] 
    
    def get_queryset(self):
        """
        Optionally filter companies by search term and flags
        """
        queryset = super().get_queryset()
        
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(location__icontains=search) |
                Q(address__icontains=search) |
                Q(user__email__icontains=search) |
                Q(phone__icontains=search)
            )
        
        # Filters
        is_active = self.request.query_params.get('is_active', None)
        is_verified = self.request.query_params.get('is_verified', None)
        is_favourite = self.request.query_params.get('is_favourite', None)

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        if is_verified is not None:
            queryset = queryset.filter(is_verified=is_verified.lower() == 'true')
            
        if is_favourite is not None:
            queryset = queryset.filter(is_favourite=is_favourite.lower() == 'true')
        
        # Ordering (default: newest first)
        ordering = self.request.query_params.get('ordering', '-created_at')
        queryset = queryset.order_by(ordering)
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'update_basic_info':
            return CompanyBasicInfoSerializer
        elif self.action == 'update_logo':
            return CompanyLogoSerializer
        elif self.action == 'update_banner':
            return CompanyBannerSerializer
        elif self.action == 'update_social_links':
            return CompanySocialLinksSerializer
        elif self.action == 'update_video_links':
            return CompanyVideoLinksSerializer
        return CompanyProfileSerializer
    
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        company = self.get_object()
        company.is_active = not company.is_active
        company.save()
        return Response({'message': f'Status updated to {company.is_active}'})

    @action(detail=True, methods=['post'])
    def toggle_verified(self, request, pk=None):
        company = self.get_object()
        company.is_verified = not company.is_verified
        company.save()
        return Response({'message': f'Verified status updated to {company.is_verified}'})

    @action(detail=True, methods=['post'])
    def toggle_favourite(self, request, pk=None):
        company = self.get_object()
        company.is_favourite = not company.is_favourite
        company.save()
        return Response({'message': f'Favourite status updated to {company.is_favourite}'})
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        total = self.queryset.count()
        active = self.queryset.filter(is_active=True).count()
        verified = self.queryset.filter(is_verified=True).count()
        
        return Response({
            'total': total,
            'active': active,
            'verified': verified
        })
    
    @action(detail=True, methods=['patch'])
    def update_basic_info(self, request, pk=None):
        company = self.get_object()
        serializer = self.get_serializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_logo(self, request, pk=None):
        company = self.get_object()
        serializer = self.get_serializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_banner(self, request, pk=None):
        company = self.get_object()
        serializer = self.get_serializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_social_links(self, request, pk=None):
        company = self.get_object()
        serializer = self.get_serializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_video_links(self, request, pk=None):
        company = self.get_object()
        serializer = self.get_serializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
        
    @action(detail=True, methods=['post'])
    def add_photo(self, request, pk=None):
        company = self.get_object()
        serializer = CompanyPhotoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(company=company)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['delete'], url_path='photos/(?P<photo_id>[^/.]+)')
    def delete_photo(self, request, pk=None, photo_id=None):
        company = self.get_object()
        try:
            photo = company.photos.get(id=photo_id)
            photo.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CompanyPhoto.DoesNotExist:
            return Response({'error': 'Photo not found'}, status=status.HTTP_404_NOT_FOUND)
        
           
    @action(detail=False, methods=['get'], url_path='current')
    def current_profile(self, request):
        """Return the current user's complete company profile"""
        try:
            profile = CompanyProfile.objects.get(user=request.user)
            serializer = CompanyProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except CompanyProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
    @action(detail=True, methods=['post'])
    def toggle_verified(self, request, pk=None):
        company = self.get_object()
        company.is_verified = not company.is_verified
        company.save()
        serializer = CompanyProfileSerializer(company)
        return Response({
            'message': f'Verified status updated to {company.is_verified}',
            'profile': serializer.data
        })

    @action(detail=True, methods=['post'])
    def toggle_favourite(self, request, pk=None):
        company = self.get_object()
        company.is_favourite = not company.is_favourite
        company.save()
        serializer = CompanyProfileSerializer(company)
        return Response({
            'message': f'Favourite status updated to {company.is_favourite}',
            'profile': serializer.data
        })

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        company = self.get_object()
        company.is_active = not company.is_active
        company.save()
        serializer = CompanyProfileSerializer(company)
        return Response({
            'message': f'Status updated to {company.is_active}',
            'profile': serializer.data
        })




class CompanyReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling company reviews (Admin Only)
    """
    queryset = CompanyReview.objects.all()
    serializer_class = CompanyReviewSerializer
    permission_classes = [IsAuthenticated, IsAdminUser] # Only admins can create/edit reviews

    def get_queryset(self):
        queryset = super().get_queryset()
        company_id = self.request.query_params.get('company_id', None)
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        return queryset
    def get(self, request):
        try:
            obj = CandidateKeySkills.objects.get(user=request.user)
            return Response({"skills": obj.skills})
        except CandidateKeySkills.DoesNotExist:
            return Response({"skills": ""})

    def post(self, request):
        skills = request.data.get("skills", "")

        obj, created = CandidateKeySkills.objects.get_or_create(user=request.user)
        obj.skills = skills
        obj.save()

        return Response({"message": "Saved successfully"})




class CandidateEmploymentViewSet(viewsets.ModelViewSet):
    serializer_class = EmploymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CandidateEmployment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class CandidateEducationViewSet(viewsets.ModelViewSet):
    serializer_class = CandidateEducationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return logged-in user's data
        return CandidateEducation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically attach the logged-in user
        serializer.save(user=self.request.user)





class CandidateITSkillViewSet(viewsets.ModelViewSet):
    serializer_class = CandidateITSkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CandidateITSkill.objects.filter(user=self.request.user)
    
    
    def perform_create(self, serializer):
        # Automatically attach the logged-in user
        serializer.save(user=self.request.user)

    
 


#pricing

class PricingPlanViewSet(viewsets.ModelViewSet):
    queryset = PricingPlan.objects.all().order_by('id')
    serializer_class = PricingPlanSerializer
    




class CandidateProjectViewSet(viewsets.ModelViewSet):
    serializer_class = CandidateProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CandidateProject.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DesiredCareerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = DesiredCareerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DesiredCareerProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class PersonalDetailViewSet(viewsets.ModelViewSet):
    serializer_class = PersonalDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PersonalDetail.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class ResumeAttachmentViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ResumeAttachment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class BaseUserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OnlineProfileViewSet(BaseUserViewSet):
    queryset = OnlineProfile.objects.all()
    serializer_class = OnlineProfileSerializer


class WorkSampleViewSet(BaseUserViewSet):
    queryset = WorkSample.objects.all()
    serializer_class = WorkSampleSerializer


class ResearchPublicationViewSet(BaseUserViewSet):
    queryset = ResearchPublication.objects.all()
    serializer_class = ResearchPublicationSerializer


class PresentationViewSet(BaseUserViewSet):
    queryset = Presentation.objects.all()
    serializer_class = PresentationSerializer


class CertificationViewSet(BaseUserViewSet):
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer


class PatentViewSet(BaseUserViewSet):
    queryset = Patent.objects.all()
    serializer_class = PatentSerializer