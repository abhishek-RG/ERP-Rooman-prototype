from django.db import models
from django.contrib.auth import get_user_model
from student.models import Course

User = get_user_model()

class Batch(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='batches')
    faculty = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='batches_taught')
    start_date = models.DateField()
    end_date = models.DateField()
    days = models.JSONField(default=list, help_text="List of days (e.g., ['Mon', 'Wed', 'Fri'])")
    session_start_time = models.TimeField()
    session_end_time = models.TimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'batches'
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.course.course_name} - {self.start_date}"

class Session(models.Model):
    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='sessions')
    session_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=[('scheduled', 'Scheduled'), ('completed', 'Completed')], default='scheduled')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sessions'
        ordering = ['session_date', 'start_time']

    def __str__(self):
        return f"{self.batch} - {self.session_date} ({self.start_time})"
