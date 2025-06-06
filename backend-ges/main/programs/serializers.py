# programs/serializers.py
from rest_framework import serializers
from .models import Program, Subject, Schedule

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ['id', 'code', 'name', 'department', 'description']
    
    def validate_code(self, value):
        if Program.objects.filter(code=value).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError("Program code must be unique.")
        return value

class SubjectSerializer(serializers.ModelSerializer):
    program = ProgramSerializer(read_only=True)  # Include nested program data
    program_id = serializers.PrimaryKeyRelatedField(
        queryset=Program.objects.all(), source='program', write_only=True
    )

    class Meta:
        model = Subject
        fields = ['id', 'course_code', 'title', 'description', 'credits', 'program', 'program_id']
    
    def validate_course_code(self, value):
        if Subject.objects.filter(course_code=value).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError("Subject course code must be unique.")
        return value
    
    def validate_credits(self, value):
        if not isinstance(value, int) or value <= 0:
            raise serializers.ValidationError("Credits must be a positive integer.")
        return value

class ScheduleSerializer(serializers.ModelSerializer):
    subject_id = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(), source='subject', write_only=True
    )

    class Meta:
        model = Schedule
        fields = ['id', 'subject_id', 'day', 'start_time', 'end_time', 'room']
    
    def validate(self, data):
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("End time must be after start time.")
        return data