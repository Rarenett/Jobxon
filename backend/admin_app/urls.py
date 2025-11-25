from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CandidateProfileViewSet
from admin_app.views import CandidateResumeHeadlineView
from .views import CompanyProfileViewSet
from .views import PricingPlanViewSet

from backend.admin_app import views


router = DefaultRouter()
router.register(r'admin/candidates', CandidateProfileViewSet, basename='admin-candidates')
path('resume-headline/', CandidateResumeHeadlineView.as_view(), name='resume-headline'),
path('api/pricing-plans/', PricingPlanViewSet.as_view(), name='pricing-plans'),
router.register(r'companies', CompanyProfileViewSet, basename='company')



urlpatterns = [
    path('api/', include(router.urls)),
]

