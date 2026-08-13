from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    profile_image = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    role = serializers.SerializerMethodField()
    member_since = serializers.SerializerMethodField()
    account_status = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = (
            'user', 'profile_image', 'full_name', 'first_name', 'last_name', 'username', 'email', 'phone_number',
            'height', 'role', 'member_since', 'account_status',
            'gender', 'date_of_birth', 'address', 'city', 'state', 'country', 'preferred_thrill', 'age'
        )

    def get_profile_image(self, obj):
        return obj.profile_image or None

    def get_role(self, obj):
        if obj.user.is_superuser or obj.user.is_staff or (obj.role and obj.role.lower() == 'admin'):
            return 'Admin'
        return obj.role or 'User'

    def get_member_since(self, obj):
        if obj.created_at:
            return obj.created_at.strftime('%B %Y')
        elif obj.user and obj.user.date_joined:
            return obj.user.date_joined.strftime('%B %Y')
        return 'July 2026'

    def get_account_status(self, obj):
        if obj.user and not obj.user.is_active:
            return 'Inactive'
        return 'Active'

    def get_full_name(self, obj):
        fn = (obj.user.first_name or '').strip()
        ln = (obj.user.last_name or '').strip()
        combined = f"{fn} {ln}".strip()
        if combined:
            return combined.title()
        un = (obj.user.username or '').strip()
        if un:
            return un.replace('_', ' ').replace('.', ' ').title()
        return "ThrillVerse Member"

class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=20)
    height = serializers.IntegerField(min_value=50, max_value=250)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    age = serializers.IntegerField(required=False, allow_null=True)
    preferred_thrill = serializers.IntegerField(required=False, allow_null=True)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "Username already exists."})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email address already registered."})
        
        # Age positive integer validation
        if data.get('age') is not None and data['age'] <= 0:
            raise serializers.ValidationError({"age": "Age must be a valid positive integer greater than 0."})

        # 10 digit phone number validation
        phone = str(data.get('phone_number', '')).strip()
        clean_phone = ''.join(filter(str.isdigit, phone))
        if len(clean_phone) != 10:
            raise serializers.ValidationError({"phone_number": "Mobile number must be exactly 10 digits."})
        
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        first_name = validated_data.pop('first_name', '').strip()
        last_name = validated_data.pop('last_name', '').strip()
        phone_number = validated_data.pop('phone_number', '').strip()
        clean_phone = ''.join(filter(str.isdigit, phone_number))
        height = validated_data.pop('height')
        age = validated_data.pop('age', None)
        preferred_thrill = validated_data.pop('preferred_thrill', None)

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        profile = user.profile
        profile.phone_number = clean_phone if len(clean_phone) == 10 else phone_number
        profile.height = height
        if age is not None:
            profile.age = age
        if preferred_thrill is not None:
            profile.preferred_thrill = preferred_thrill
        profile.save()

        return user

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True, required=False)

    def validate(self, data):
        if 'confirm_password' in data and data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"new_password": "New passwords do not match."})
        return data
