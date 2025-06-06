# users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username', 'first_name', 'middle_name', 'last_name', 'role', 'student_id', 'gender', 'address', 'contact_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 'role', 'password1', 'password2', 'gender'),
        }),
    )
    list_display = ('email', 'username', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('email', 'username')
    ordering = ('email',)
    filter_horizontal = ()

admin.site.register(User, UserAdmin)