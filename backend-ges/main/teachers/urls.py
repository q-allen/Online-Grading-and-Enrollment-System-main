# teachers/urls.py
from django.urls import path
from .views import teacher_login

urlpatterns = [
    path('login/', teacher_login, name='teacher-login'),
]