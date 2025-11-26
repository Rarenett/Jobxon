# admin_app/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CandidateProfileViewSet, ResumeHeadlineView, KeySkillsView
from companies_app.views import CompanyProfileViewSet
from admin_app.views import CandidateEmploymentViewSet
from .views import CandidateEducationViewSet
from .views import CandidateITSkillViewSet

router = DefaultRouter()
router.register(r'admin/candidates', CandidateProfileViewSet, basename='admin-candidates')
from .views import CandidateProfileViewSet
from admin_app.views import ResumeHeadlineView
from companies_app.views import CompanyProfileViewSet
from .views import PricingPlanViewSet
from .views import CandidateProjectViewSet
from .views import DesiredCareerProfileViewSet
from .views import PersonalDetailViewSet
from .views import ResumeAttachmentViewSet
from .views import (
    OnlineProfileView, WorkSampleView,
    ResearchPublicationView, PresentationView,
    CertificationView, PatentView
)







router = DefaultRouter()
router.register(r'admin/candidates', CandidateProfileViewSet, basename='admin-candidates')
router.register(r'companies', CompanyProfileViewSet, basename='company')
router.register(r'employment', CandidateEmploymentViewSet, basename='employment')
router.register(r'education', CandidateEducationViewSet, basename='education')
router.register(r'it-skills', CandidateITSkillViewSet, basename='it-skills')
router.register(r'pricing-plans', PricingPlanViewSet, basename='pricing-plans')
router.register(r'projects', CandidateProjectViewSet, basename='projects')
router.register(r'desired-career', DesiredCareerProfileViewSet, basename='desired-career')
router.register(r'personal-details', PersonalDetailViewSet, basename='personal-details')
router.register(r'resume' , ResumeAttachmentViewSet, basename="resume")
router.register(r'online-profiles', OnlineProfileView, basename='online-profiles')
router.register(r'work-samples', WorkSampleView, basename='work-samples')
router.register(r'research-publications', ResearchPublicationView, basename='research-publications')
router.register(r'presentations', PresentationView, basename='presentations')
router.register(r'certifications', CertificationView, basename='certifications')
router.register(r'patents', PatentView, basename='patents')






urlpatterns = [
    path('api/', include(router.urls)),
    path('api/resume-headline/', ResumeHeadlineView.as_view(), name="resume-headline"),
    path('api/key-skills/', KeySkillsView.as_view(), name="key-skills"),
    path('resume-headline/', ResumeHeadlineView.as_view(), name='resume-headline'),


]

