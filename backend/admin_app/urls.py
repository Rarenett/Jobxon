from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CandidateProfileViewSet, CompanyProfileViewSet, PricingPlanViewSet
from admin_app.views import CandidateResumeHeadlineView

router = DefaultRouter()

# Register ViewSets
router.register(r'admin/candidates', CandidateProfileViewSet, basename='admin-candidates')
router.register(r'companies', CompanyProfileViewSet, basename='company')
router.register(r'pricing-plans', PricingPlanViewSet, basename='pricing-plans')

urlpatterns = [
    path('api/', include(router.urls)),

    # Normal API views (non-viewsets)
    path('api/resume-headline/', CandidateResumeHeadlineView.as_view(), name='resume-headline'),
]