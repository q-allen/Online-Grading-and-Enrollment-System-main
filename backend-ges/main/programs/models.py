from django.db import models

class Program(models.Model):
    code = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    department = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Subject(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='subjects')
    course_code = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    credits = models.IntegerField()

    def __str__(self):
        return self.title

class Schedule(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='schedules')
    day = models.CharField(max_length=10, choices=[
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
    ])
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.subject.title} - {self.day} {self.start_time}-{self.end_time}"