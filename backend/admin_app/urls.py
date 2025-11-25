from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyProfileViewSet, CompanyReviewViewSet

router = DefaultRouter()
router.register(r'companies', CompanyProfileViewSet, basename='company')
router.register(r'reviews', CompanyReviewViewSet, basename='review')  # <-- add this line


urlpatterns = [
    path('api/', include(router.urls)),
]