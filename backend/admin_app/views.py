from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from .models import CompanyProfile, CompanyPhoto
from .serializers import CompanyProfileSerializer, CompanyPhotoSerializer

class CompanyProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = CompanyProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Get or create profile automatically
        profile, created = CompanyProfile.objects.get_or_create(user=self.request.user)
        return profile
class CompanyListView(generics.ListAPIView):
    queryset = CompanyProfile.objects.all()
    serializer_class = CompanyProfileSerializer
class CompanyPhotoUploadView(generics.CreateAPIView):
    serializer_class = CompanyPhotoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        company = CompanyProfile.objects.get(user=self.request.user)
        serializer.save(company=company)
class CompanyPhotoListView(generics.ListAPIView):
    serializer_class = CompanyPhotoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        company = CompanyProfile.objects.get(user=self.request.user)
        return CompanyPhoto.objects.filter(company=company)
from rest_framework import generics

class CompanyPhotoDeleteView(generics.DestroyAPIView):
    serializer_class = CompanyPhotoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        company = CompanyProfile.objects.get(user=self.request.user)
        return CompanyPhoto.objects.filter(company=company)

