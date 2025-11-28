# admin_app/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CandidateKeySkillViewSet, CandidateProfileViewSet, CompanyProfileViewSet, PricingPlanViewSet, assign_menu_permissions_api
from .views import CompanyProfileViewSet, CompanyReviewViewSet
from .views import CandidateProfileViewSet, ResumeHeadlineView
from companies_app.views import CompanyProfileViewSet
from admin_app.views import CandidateEmploymentViewSet
from .views import CandidateEducationViewSet
from .views import CandidateITSkillViewSet
from admin_app.views import MenuViewSet, SubMenuViewSet
from .views import assign_menu_permissions_api



router = DefaultRouter()
from .views import CandidateProfileViewSet
from admin_app.views import ResumeHeadlineView
from companies_app.views import CompanyProfileViewSet
from .views import PricingPlanViewSet
from .views import CandidateProjectViewSet
from .views import DesiredCareerProfileViewSet
from .views import PersonalDetailViewSet
from .views import ResumeAttachmentViewSet
from .views import ProfileSummaryViewSet

from .views import (
    OnlineProfileViewSet, WorkSampleViewSet,
    ResearchPublicationViewSet, PresentationViewSet,
    CertificationViewSet, PatentViewSet    

)

router = DefaultRouter()

# Register ViewSets
router.register(r'admin/candidates', CandidateProfileViewSet, basename='admin-candidates')
router.register(r'companies', CompanyProfileViewSet, basename='company')

router.register(r'reviews', CompanyReviewViewSet, basename='review')  

router.register(r'employment', CandidateEmploymentViewSet, basename='employment')
router.register(r'education', CandidateEducationViewSet, basename='education')
router.register(r'it-skills', CandidateITSkillViewSet, basename='it-skills')
router.register(r'pricing-plans', PricingPlanViewSet, basename='pricing-plans')
router.register(r'projects', CandidateProjectViewSet, basename='projects')
router.register(r'desired-career', DesiredCareerProfileViewSet, basename='desired-career')
router.register(r'personal-details', PersonalDetailViewSet, basename='personal-details')
router.register(r'resume' , ResumeAttachmentViewSet, basename="resume")
router.register(r'online-profiles', OnlineProfileViewSet, basename='online-profiles')
router.register(r'work-samples', WorkSampleViewSet, basename='work-samples')
router.register(r'research-publications', ResearchPublicationViewSet, basename='research-publications')
router.register(r'presentations', PresentationViewSet, basename='presentations')
router.register(r'certifications', CertificationViewSet, basename='certifications')
router.register(r'patents', PatentViewSet, basename='patents')
router.register(r'key-skills', CandidateKeySkillViewSet, basename='keyskill')
router.register(r'profile-summary', ProfileSummaryViewSet, basename='profile-summary')
router.register(r"add-menu", MenuViewSet)
router.register(r"add-submenu", SubMenuViewSet)




urlpatterns = [
    path('api/', include(router.urls)),
path('api/resume-headline/', ResumeHeadlineView.as_view(), name='resume-headline'),
path("assign-menu-permissions-api/<int:user_id>/", assign_menu_permissions_api),





]

    
