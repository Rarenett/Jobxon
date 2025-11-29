# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyProfileViewSet, CompanyPhotoViewSet, TopCompanyViewSet

router = DefaultRouter()
router.register(r'companies', CompanyProfileViewSet, basename='company')
router.register(r'company-photos', CompanyPhotoViewSet, basename='company-photo')
router.register(r'top-companies', TopCompanyViewSet, basename='top-company')

urlpatterns = [
    path('', include(router.urls)),
]
