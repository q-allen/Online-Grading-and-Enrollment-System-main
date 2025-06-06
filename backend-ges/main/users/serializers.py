from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'middle_name', 'last_name', 'email', 'username',
            'role', 'student_id', 'gender', 'address', 'contact_number', 'avatar'
        ]
        read_only_fields = ['id', 'role', 'email']

    def validate_student_id(self, value):
        role = self.instance.role if self.instance else self.initial_data.get('role', 'student')
        if role == 'student' and not value:
            raise serializers.ValidationError("Student ID is required for students.")
        if role != 'student' and value:
            raise serializers.ValidationError("Only students can have a student ID.")
        return value

    def validate_avatar(self, value):
        if value:
            max_size = 2 * 1024 * 1024  # 2MB
            if value.size > max_size:
                raise serializers.ValidationError("Avatar file size must be under 2MB.")
        return value