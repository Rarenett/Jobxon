from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyProfileViewSet, CompanyPhotoViewSet

router = DefaultRouter()
router.register(r'profiles', CompanyProfileViewSet, basename='company-profile')
router.register(r'photos', CompanyPhotoViewSet, basename='company-photo')

urlpatterns = [
    path('api/', include(router.urls)),
]
