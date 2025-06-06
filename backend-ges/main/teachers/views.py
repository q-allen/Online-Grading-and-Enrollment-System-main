# teachers/views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User
from .serializers import TeacherSerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def teacher_login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        logger.error(f"Missing email or password in teacher login request: email={email}")
        return Response(
            {"error": "Email and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email, role='teacher')
    except User.DoesNotExist:
        logger.error(f"No teacher found with email={email}")
        return Response(
            {"error": "Invalid email or user not found"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.check_password(password):
        logger.error(f"Incorrect password for email={email}")
        return Response(
            {"error": "Incorrect password"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)
    logger.info(f"Successful teacher login for email={email}")
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'user': TeacherSerializer(user).data
    }, status=status.HTTP_200_OK)