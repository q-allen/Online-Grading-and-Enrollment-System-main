from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.text import slugify
import os

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)
    
def user_avatar_path(instance, filename):
    # Sanitize filename by replacing spaces with underscores
    base, ext = os.path.splitext(filename)
    sanitized_filename = f"{slugify(base)}{ext}"
    return f"avatars/{sanitized_filename}"

class User(AbstractBaseUser):
    first_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], default="Other")
    role = models.CharField(max_length=20, choices=[('teacher', 'Teacher'), ('student', 'Student'), ('admin', 'Admin')])
    student_id = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    program = models.ForeignKey('programs.Program', on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser