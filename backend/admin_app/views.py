from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from users_app.models import CandidateProfile
from .serializer import CandidateProfileListSerializer


class CandidateProfileViewSet(viewsets.ModelViewSet):
    queryset = CandidateProfile.objects.all().order_by('-id')
    serializer_class = CandidateProfileListSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(
            {"message": "Deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import ResumeHeadline

class ResumeHeadlineView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        obj, _ = ResumeHeadline.objects.get_or_create(user=request.user)
        return Response({"headline": obj.headline or ""})

    def put(self, request):
        headline = request.data.get("headline")

        if not headline:
            return Response({"error": "Headline is required"}, status=400)

        obj, _ = ResumeHeadline.objects.get_or_create(user=request.user)
        obj.headline = headline
        obj.save()

        return Response({"message": "Saved successfully"})

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CandidateKeySkills

class KeySkillsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            obj = CandidateKeySkills.objects.get(user=request.user)
            return Response({"skills": obj.skills})
        except CandidateKeySkills.DoesNotExist:
            return Response({"skills": ""})

    def post(self, request):
        skills = request.data.get("skills", "")

        obj, created = CandidateKeySkills.objects.get_or_create(user=request.user)
        obj.skills = skills
        obj.save()

        return Response({"message": "Saved successfully"})


from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CandidateEmployment
from admin_app.serializer import EmploymentSerializer

class CandidateEmploymentViewSet(viewsets.ModelViewSet):
    serializer_class = EmploymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CandidateEmployment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CandidateEducation
from .serializer import CandidateEducationSerializer

class CandidateEducationViewSet(viewsets.ModelViewSet):
    serializer_class = CandidateEducationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return logged-in user's data
        return CandidateEducation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically attach the logged-in user
        serializer.save(user=self.request.user)



from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import CandidateITSkill
from admin_app.serializer import CandidateITSkillSerializer

class CandidateITSkillViewSet(viewsets.ModelViewSet):
    serializer_class = CandidateITSkillSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CandidateITSkill.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
