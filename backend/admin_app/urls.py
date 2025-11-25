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
router.register(r'companies', CompanyProfileViewSet, basename='company')
router.register(r'employment', CandidateEmploymentViewSet, basename='employment')
router.register(r'education', CandidateEducationViewSet, basename='education')
router.register(r'it-skills', CandidateITSkillViewSet, basename='it-skills')




urlpatterns = [
    path('api/', include(router.urls)),
    path('api/resume-headline/', ResumeHeadlineView.as_view(), name="resume-headline"),
    path('api/key-skills/', KeySkillsView.as_view(), name="key-skills"),
]

