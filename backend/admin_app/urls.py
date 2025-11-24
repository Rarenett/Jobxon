from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyProfileViewSet

router = DefaultRouter()
router.register(r'companies', CompanyProfileViewSet, basename='company')

urlpatterns = [
    path('api/', include(router.urls)),
]