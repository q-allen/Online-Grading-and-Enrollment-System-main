# students/views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User
from .serializers import StudentSerializer, StudentRegistrationSerializer
from rest_framework import generics,permissions
from rest_framework.permissions import IsAuthenticated
from django.http import Http404
from programs.models import Program
from .models import Student


class IsTeacherOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ['teacher', 'admin'] or request.user.is_superuser


class StudentsByProgramListView(generics.ListAPIView):
    serializer_class = StudentSerializer
    permission_classes =[IsTeacherOrAdmin]

    def get_queryset(self):
        program_id = self.kwargs.get('program_id')
        try:
            program = Program.objects.get(id=program_id)
            return Student.objects.filter(program=program)
        except Program.DoesNotExist:
            raise Http404("Program does not exist")
        
@api_view(['POST'])
@permission_classes([AllowAny])
def student_registration(request):
    serializer = StudentRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(StudentSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def student_login(request):
    student_id = request.data.get('student_id')
    password = request.data.get('password')

    if not student_id or not password:
        return Response({"error": "Student ID and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(student_id=student_id, role='student')
    except User.DoesNotExist:
        return Response({"error": "Invalid student ID or user not found"}, status=status.HTTP_404_NOT_FOUND)

    if not user.check_password(password):
        return Response({"error": "Incorrect password"}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': StudentSerializer(user).data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def teacher_login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email, role='teacher')
    except User.DoesNotExist:
        return Response({"error": "Invalid email or user not found"}, status=status.HTTP_404_NOT_FOUND)

    if not user.check_password(password):
        return Response({"error": "Incorrect password"}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': StudentSerializer(user).data  # Reusing StudentSerializer; can create TeacherSerializer if needed
    }, status=status.HTTP_200_OK)