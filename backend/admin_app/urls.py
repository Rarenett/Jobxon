# admin_app/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
<<<<<<< HEAD
from .views import CandidateKeySkillViewSet, CandidateProfileViewSet, CompanyProfileViewSet, PricingPlanViewSet
from .views import CompanyProfileViewSet, CompanyReviewViewSet
=======
from .views import CandidateKeySkillViewSet, CompanyProfileViewSet, CompanyReviewViewSet
>>>>>>> main
from .views import CandidateProfileViewSet, ResumeHeadlineView
from companies_app.views import CompanyProfileViewSet
from admin_app.views import CandidateEmploymentViewSet
from .views import CandidateEducationViewSet
from .views import CandidateITSkillViewSet

router = DefaultRouter()
router.register(r'admin/candidates', CandidateProfileViewSet, basename='admin-candidates')
from .views import CandidateProfileViewSet
<<<<<<< HEAD
from admin_app.views import ResumeHeadlineView
=======
from .views import ResumeHeadlineView
from .views import CompanyProfileViewSet
from .views import PricingPlanViewSet

from admin_app import views

>>>>>>> main

router = DefaultRouter()

# Register ViewSets
router.register(r'admin/candidates', CandidateProfileViewSet, basename='admin-candidates')
router.register(r'companies', CompanyProfileViewSet, basename='company')
router.register(r'pricing-plans', PricingPlanViewSet, basename='pricing-plans')


router.register(r'reviews', CompanyReviewViewSet, basename='review')  

router.register(r'employment', CandidateEmploymentViewSet, basename='employment')
router.register(r'education', CandidateEducationViewSet, basename='education')
router.register(r'it-skills', CandidateITSkillViewSet, basename='it-skills')
<<<<<<< HEAD
router.register(r'key-skills', CandidateKeySkillViewSet, basename='keyskill')
=======
router.register(r'pricing-plans', PricingPlanViewSet, basename='pricing-plans')
router.register(r'key-skills', CandidateKeySkillViewSet, basename='keyskill')

>>>>>>> main






urlpatterns = [
    path('api/', include(router.urls)),
<<<<<<< HEAD
    path('api/resume-headline/', ResumeHeadlineView.as_view(), name="resume-headline"),
    
=======
path('api/resume-headline/', ResumeHeadlineView.as_view(), name='resume-headline'),

>>>>>>> main
]

    
