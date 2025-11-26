# admin_app/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyProfileViewSet, CompanyReviewViewSet
from .views import CandidateProfileViewSet, ResumeHeadlineView, KeySkillsView
from companies_app.views import CompanyProfileViewSet
from admin_app.views import CandidateEmploymentViewSet
from .views import CandidateEducationViewSet
from .views import CandidateITSkillViewSet

router = DefaultRouter()
router.register(r'admin/candidates', CandidateProfileViewSet, basename='admin-candidates')
from .views import CandidateProfileViewSet
from .views import ResumeHeadlineView
from .views import CompanyProfileViewSet
from .views import PricingPlanViewSet

from admin_app import views


router = DefaultRouter()
router.register(r'admin/candidates', CandidateProfileViewSet, basename='admin-candidates')
router.register(r'companies', CompanyProfileViewSet, basename='company')
router.register(r'reviews', CompanyReviewViewSet, basename='review')  # <-- add this line

router.register(r'employment', CandidateEmploymentViewSet, basename='employment')
router.register(r'education', CandidateEducationViewSet, basename='education')
router.register(r'it-skills', CandidateITSkillViewSet, basename='it-skills')
router.register(r'pricing-plans', PricingPlanViewSet, basename='pricing-plans')







urlpatterns = [
    path('api/', include(router.urls)),
    path('api/key-skills/', KeySkillsView.as_view(), name="key-skills"),
path('api/resume-headline/', ResumeHeadlineView.as_view(), name='resume-headline'),

]

