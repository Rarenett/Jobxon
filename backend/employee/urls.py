from django.urls import path, include
from django.urls import include
from rest_framework.routers import DefaultRouter
from .views import EmployeeCreateViewSet,EmployeeListViewSet

router = DefaultRouter()
router.register(r'add', EmployeeCreateViewSet, basename="employee")
router.register(r'employee-list', EmployeeListViewSet, basename='employee-list')
urlpatterns = [
    path('api/', include(router.urls)),
   
]