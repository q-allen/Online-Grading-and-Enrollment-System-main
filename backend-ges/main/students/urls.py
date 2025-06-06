from django.urls import path
from .views import student_registration, student_login, StudentsByProgramListView

urlpatterns = [
    path('register/', student_registration, name='student_registration'),
    path('login/', student_login, name='student_login'),
    path('programs/<int:program_id>/students/', StudentsByProgramListView.as_view(), name='students-by-program'),
]