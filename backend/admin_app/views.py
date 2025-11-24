from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Q
from companies_app.models import CompanyProfile, CompanyPhoto
from companies_app.serializers import (
    CompanyProfileSerializer,
    CompanyBasicInfoSerializer,
    CompanyLogoSerializer,
    CompanyBannerSerializer,
    CompanySocialLinksSerializer,
    CompanyVideoLinksSerializer,
    CompanyPhotoSerializer
)


class CompanyProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing company profiles in admin panel
    Provides CRUD operations and custom actions
    """
    queryset = CompanyProfile.objects.select_related('user').prefetch_related('photos').all()
    serializer_class = CompanyProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get_queryset(self):
        """
        Optionally filter companies by search term and active status
        """
        queryset = super().get_queryset()
        
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(location__icontains=search) |
                Q(user__email__icontains=search) |
                Q(phone__icontains=search)
            )
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active', None)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Ordering (default: newest first)
        ordering = self.request.query_params.get('ordering', '-created_at')
        queryset = queryset.order_by(ordering)
        
        return queryset
    
    def get_serializer_class(self):
        """
        Return appropriate serializer based on action
        """
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
        """
        Toggle company active/inactive status
        """
        company = self.get_object()
        company.is_active = not company.is_active
        company.save()
        serializer = self.get_serializer(company)
        return Response({
            'message': f'Company status updated to {"Active" if company.is_active else "Inactive"}',
            'data': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get company statistics for admin dashboard
        """
        total = self.queryset.count()
        active = self.queryset.filter(is_active=True).count()
        inactive = self.queryset.filter(is_active=False).count()
        
        return Response({
            'total': total,
            'active': active,
            'inactive': inactive
        })
    
    @action(detail=True, methods=['patch'])
    def update_basic_info(self, request, pk=None):
        """
        Update only basic company information
        """
        company = self.get_object()
        serializer = self.get_serializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_logo(self, request, pk=None):
        """
        Update company logo
        """
        company = self.get_object()
        serializer = self.get_serializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_banner(self, request, pk=None):
        """
        Update company banner image
        """
        company = self.get_object()
        serializer = self.get_serializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_social_links(self, request, pk=None):
        """
        Update company social media links
        """
        company = self.get_object()
        serializer = self.get_serializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_video_links(self, request, pk=None):
        """
        Update company video links
        """
        company = self.get_object()
        serializer = self.get_serializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_photo(self, request, pk=None):
        """
        Add a photo to company gallery
        """
        company = self.get_object()
        serializer = CompanyPhotoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(company=company)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['delete'], url_path='photos/(?P<photo_id>[^/.]+)')
    def delete_photo(self, request, pk=None, photo_id=None):
        """
        Delete a specific photo from company gallery
        """
        company = self.get_object()
        try:
            photo = company.photos.get(id=photo_id)
            photo.delete()
            return Response({'message': 'Photo deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except CompanyPhoto.DoesNotExist:
            return Response({'error': 'Photo not found'}, status=status.HTTP_404_NOT_FOUND)
