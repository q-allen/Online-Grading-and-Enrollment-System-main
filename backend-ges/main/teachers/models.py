# teachers/models.py
from django.db import models

class Teacher(models.Model):
    teacher_id = models.CharField(max_length=15, unique=True)
    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    contact_number = models.CharField(max_length=20, blank=True, null=True)
    username = models.CharField(max_length=150, unique=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    department = models.CharField(max_length=255, blank=True, null=True)
    program = models.ForeignKey('programs.Program', on_delete=models.SET_NULL, null=True, blank=True, related_name='teachers')
    assigned_subjects = models.ManyToManyField('programs.Subject', related_name='assigned_teachers')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.teacher_id} - {self.first_name} {self.middle_name or ''} {self.last_name}"