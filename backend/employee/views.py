from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Employee
from .serializers import EmployeeCreateSerializer,EmployeeListSerializer

class EmployeeCreateViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeCreateSerializer
    permission_classes = [IsAdminUser]

class EmployeeListViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Employee.objects.all().order_by('name')
    serializer_class = EmployeeListSerializer
    permission_classes = [IsAdminUser]