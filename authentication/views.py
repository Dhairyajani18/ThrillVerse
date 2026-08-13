from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import UserProfile
from .serializers import RegisterSerializer, UserProfileSerializer, ChangePasswordSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username = attrs.get("username")
        if username and "@" in username:
            user = User.objects.filter(email__iexact=username.strip()).first()
            if user:
                attrs["username"] = user.username
        data = super().validate(attrs)
        return {
            "message": "Login Successful",
            "tokens": {
                "access": data["access"],
                "refresh": data["refresh"]
            }
        }

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Registration Successful",
            "tokens": {
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if request.method == 'PUT':
        data = request.data
        user = request.user

        if 'first_name' in data:
            user.first_name = str(data['first_name']).strip()
        if 'last_name' in data:
            user.last_name = str(data['last_name']).strip()
        if 'full_name' in data and data['full_name'] and not ('first_name' in data or 'last_name' in data):
            parts = str(data['full_name']).strip().split()
            user.first_name = parts[0] if parts else ''
            user.last_name = " ".join(parts[1:]) if len(parts) > 1 else ''

        if 'email' in data and data['email']:
            user.email = str(data['email']).strip()

        if 'phone_number' in data:
            profile.phone_number = str(data['phone_number']).strip()

        if 'height' in data and data['height'] is not None:
            try:
                val = int(data['height'])
                profile.height = val if val > 0 else None
            except (ValueError, TypeError):
                pass

        if 'profile_image' in data:
            profile.profile_image = data['profile_image']

        for field in ['gender', 'date_of_birth', 'address', 'city', 'state', 'country', 'preferred_thrill']:
            if field in data:
                val = data[field]
                if field == 'date_of_birth' and not val:
                    val = None
                setattr(profile, field, val)

        profile.save()
        user.save()
        
    serializer = UserProfileSerializer(profile)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({"old_password": "Wrong password."}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({"message": "Password Changed Successfully"}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
