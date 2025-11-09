from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re
from .models import Grade

User = get_user_model()

# ---------------------------
# Register Serializer
# ---------------------------
class RegisterSerializer(serializers.ModelSerializer):
    password_confirmation = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    role = serializers.CharField(read_only=True)      # role ditentukan otomatis
    username = serializers.CharField(read_only=True)  # username diambil dari email

    class Meta:
        model = User
        fields = ('email', 'username', 'full_name', 'major', 'role', 'password', 'password_confirmation')
        extra_kwargs = {
            'password': {'write_only': True, 'style': {'input_type': 'password'}},
            'full_name': {'required': True},
            'major': {'required': True},
        }

    def validate_email(self, value):
        email = value.lower()
        student_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@student\.prasetiyamulya\.ac\.id$')
        instructor_pattern = re.compile(r'^[a-zA-Z0-9._%+-]+@prasetiyamulya\.ac\.id$')

        if not (student_pattern.match(email) or instructor_pattern.match(email)):
            raise serializers.ValidationError("Email must be a valid student or instructor email address.")
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email is already in use.")
        return email

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirmation']:
            raise serializers.ValidationError({"password": "Password fields didn't match"})
        return attrs

    def create(self, validated_data):
        email = validated_data['email'].lower()
        username = email.split('@')[0]
        domain = email.split('@')[1]

        if domain == 'student.prasetiyamulya.ac.id':
            role = 'student'
        elif domain == 'prasetiyamulya.ac.id':
            role = 'instructor'

        user = User.objects.create_user(
            email=email,
            username=username,
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            major=validated_data.get('major'),
            role=role
        )
        return user

# ---------------------------
# JWT Serializer
# ---------------------------
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user_instance):
        token = super().get_token(user_instance)
        # Add custom claims
        token['email'] = user_instance.email
        token['username'] = user_instance.username
        token['full_name'] = user_instance.full_name
        token['major'] = user_instance.major
        token['role'] = user_instance.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        token_data = {
            'access': data['access'],
            'refresh': data['refresh'],
        }
        data.update({
            'email': self.user.email,
            'username': self.user.username,
            'full_name': self.user.full_name,
            'major': self.user.major,
            'role': self.user.role,
            'token': token_data
        })
        return data

# ---------------------------
# Grade Serializer
# ---------------------------
class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    student_email = serializers.EmailField(source='student.email', read_only=True)
    instructor_name = serializers.CharField(source='instructor.full_name', read_only=True)
    instructor_email = serializers.EmailField(source='instructor.email', read_only=True)

    class Meta:
        model = Grade
        fields = [
            'id',
            'student',
            'student_name',
            'student_email',
            'instructor',
            'instructor_name',
            'instructor_email',
            'course_name',
            'score',
            'created_at',
        ]
        read_only_fields = ['created_at', 'student_name', 'student_email', 'instructor_name', 'instructor_email']
