# programs/admin.py
from django.contrib import admin
from .models import Program, Subject, Schedule

admin.site.register(Program)
admin.site.register(Subject)
admin.site.register(Schedule)  # Assuming Schedule is defined in models.py