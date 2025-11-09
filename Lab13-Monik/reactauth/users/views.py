from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer

User = get_user_model() 

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]  
    serializer_class = RegisterSerializer


class CustomTokenObtainPairView(TokenObtainPairView): 
    serializer_class = CustomTokenObtainPairSerializer
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Grade
from .serializers import GradeSerializer

class GradeListView(generics.ListCreateAPIView):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'instructor':
            return Grade.objects.all()
        elif user.role == 'student':
            return Grade.objects.filter(student=user)
        return Grade.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if user.role != 'instructor':
            raise PermissionDenied("Only instructors can add grades.")
        serializer.save()
