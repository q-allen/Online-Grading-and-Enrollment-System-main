# programs/urls.py
from django.urls import path
from .views import ProgramListView, ProgramDetailView, SubjectListView, SubjectDetailView, ScheduleListView, ScheduleDetailView

urlpatterns = [
    path('programs/', ProgramListView.as_view(), name='program-list'),
    path('programs/<int:pk>/', ProgramDetailView.as_view(), name='program-detail'),
    path('subjects/', SubjectListView.as_view(), name='subject-list'),
    path('subjects/<int:pk>/', SubjectDetailView.as_view(), name='subject-detail'),
    path('schedules/', ScheduleListView.as_view(), name='schedule-list'),
    path('schedules/<int:pk>/', ScheduleDetailView.as_view(), name='schedule-detail'),
]