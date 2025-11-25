from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyProfileViewSet, PricingPlanListAPIView

router = DefaultRouter()
router.register(r'companies', CompanyProfileViewSet, basename='company')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/pricing-plans/', PricingPlanListAPIView.as_view(), name='pricing-plans'),
]