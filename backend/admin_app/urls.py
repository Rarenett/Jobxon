from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyProfileViewSet, PricingPlanViewSet

router = DefaultRouter()
router.register(r'companies', CompanyProfileViewSet, basename='company')
router.register(r'pricing-plans', PricingPlanViewSet, basename='pricingplan')

urlpatterns = [
    path('api/', include(router.urls)),
]
