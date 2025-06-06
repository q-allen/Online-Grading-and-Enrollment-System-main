# students/admin.py
from django.contrib import admin
from .models import Student
from programs.models import Program, Subject

admin.site.register(Student)
