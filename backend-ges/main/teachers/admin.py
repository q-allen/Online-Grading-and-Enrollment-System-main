# teachers/admin.py
from django.contrib import admin
from .models import Teacher
from programs.models import Program, Subject

admin.site.register(Teacher)