from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import CompanyProfile, CompanyPhoto
from .serializers import (
    CompanyProfileSerializer,
    CompanyPhotoSerializer,
    CompanyBasicInfoSerializer,
    CompanyLogoSerializer,
    CompanyBannerSerializer,
    CompanySocialLinksSerializer,
    CompanyVideoLinksSerializer
)


class CompanyProfileViewSet(viewsets.ModelViewSet):
    queryset = CompanyProfile.objects.filter(is_active=True).order_by('name')
    serializer_class = CompanyProfileSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return CompanyProfile.objects.filter(user=self.request.user)
        return super().get_queryset()

    @action(detail=False, methods=['put'], url_path='update-basic-info')
    def update_basic_info(self, request):
        """Update basic company information"""
        try:
            profile = CompanyProfile.objects.get(user=request.user)
            serializer = CompanyBasicInfoSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Basic information updated successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CompanyProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['put'], url_path='update-logo', parser_classes=[MultiPartParser, FormParser])
    def update_logo(self, request):
        """Update company logo"""
        try:
            profile = CompanyProfile.objects.get(user=request.user)
            serializer = CompanyLogoSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Logo updated successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CompanyProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['put'], url_path='update-banner', parser_classes=[MultiPartParser, FormParser])
    def update_banner(self, request):
        """Update company banner image"""
        try:
            profile = CompanyProfile.objects.get(user=request.user)
            serializer = CompanyBannerSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Banner updated successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CompanyProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['put'], url_path='update-social-links')
    def update_social_links(self, request):
        """Update social media links"""
        try:
            profile = CompanyProfile.objects.get(user=request.user)
            serializer = CompanySocialLinksSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Social links updated successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CompanyProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['put'], url_path='update-video-links')
    def update_video_links(self, request):
        """Update video gallery links"""
        try:
            profile = CompanyProfile.objects.get(user=request.user)
            serializer = CompanyVideoLinksSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Video links updated successfully',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except CompanyProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)


class CompanyPhotoViewSet(viewsets.ModelViewSet):
    queryset = CompanyPhoto.objects.all()
    serializer_class = CompanyPhotoSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return CompanyPhoto.objects.filter(company__user=self.request.user)

    def perform_create(self, serializer):
        profile = CompanyProfile.objects.get(user=self.request.user)
        serializer.save(company=profile)
