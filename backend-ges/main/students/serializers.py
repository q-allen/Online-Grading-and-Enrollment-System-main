# students/serializers.py
from rest_framework import serializers
from users.models import User

class StudentSerializer(serializers.ModelSerializer):
    middle_name = serializers.CharField(required=False, allow_blank=True)
    student_id = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    contact_number = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ["id", "first_name", "middle_name", "last_name", "email", "username", "role", "student_id", "address", "contact_number"]
        read_only_fields = ["id"]

class StudentRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ["id", "first_name", "middle_name", "last_name", "email", "username", "password", "gender", "role", "student_id", "address", "contact_number"]
        extra_kwargs = {
            'role': {'default': 'student'},
            'middle_name': {'required': False, 'allow_blank': True},
            'student_id': {'required': False, 'allow_blank': True},
            'address': {'required': False, 'allow_blank': True},
            'contact_number': {'required': False, 'allow_blank': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            middle_name=validated_data.get('middle_name', ''),
            last_name=validated_data['last_name'],
            password=validated_data['password'],
            gender=validated_data.get('gender', 'other'),
            role="student",
            student_id=validated_data.get('student_id', ''),
            address=validated_data.get('address', ''),
            contact_number=validated_data.get('contact_number', '')
        )
        return user