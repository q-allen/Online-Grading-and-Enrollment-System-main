# teachers/serializers.py
from rest_framework import serializers
from users.models import User

class TeacherSerializer(serializers.ModelSerializer):
    middle_name = serializers.CharField(required=False, allow_blank=True)
    student_id = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    contact_number = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'middle_name', 'last_name', 'email', 'username', 'role', 'student_id', 'gender', 'address', 'contact_number', 'avatar']
        read_only_fields = ["id"]