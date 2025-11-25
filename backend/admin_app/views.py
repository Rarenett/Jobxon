from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly
from django.db.models import Q
from companies_app.models import CompanyProfile, CompanyPhoto, CompanyReview
from companies_app.serializers import (
    CompanyProfileSerializer,
    CompanyBasicInfoSerializer,
    CompanyLogoSerializer,
    CompanyBannerSerializer,
    CompanySocialLinksSerializer,
    CompanyVideoLinksSerializer,
    CompanyPhotoSerializer,
    CompanyReviewSerializer
)


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