from django.db import models
from django.contrib.auth import get_user_model
from student.models import Course

User = get_user_model()

class Batch(models.Model):
    CENTER_CHOICES = [
        ('Electronic City PMKK Futureskill (TC016371)', 'Electronic City PMKK Futureskill (TC016371)'),
        ('Rajajinagar (123)', 'Rajajinagar (123)'),
        ('Rajajinagar Bangalore (RAJBAN)', 'Rajajinagar Bangalore (RAJBAN)'),
        ('Rooman Online (RON)', 'Rooman Online (RON)'),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='batches')
    faculty = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='batches_taught')
    center = models.CharField(max_length=100, choices=CENTER_CHOICES, blank=True, null=True)
    classroom = models.CharField(max_length=100, blank=True, null=True)
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
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('conducted', 'Conducted'),
        ('cancelled', 'Cancelled'),
        ('rescheduled', 'Rescheduled'),
    ]

    batch = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name='sessions')
    session_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    
    # Conducted details
    conducted_date = models.DateField(null=True, blank=True)
    conducted_start_time = models.TimeField(null=True, blank=True)
    conducted_end_time = models.TimeField(null=True, blank=True)
    content_covered = models.TextField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sessions'
        ordering = ['session_date', 'start_time']

    def __str__(self):
        return f"{self.batch} - {self.session_date} ({self.start_time})"

class SessionAttendance(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='attendance')
    student = models.ForeignKey('student.Student', on_delete=models.CASCADE, related_name='session_attendances')
    status = models.CharField(max_length=20, choices=[
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('excused', 'Excused')
    ], default='present')
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'session_attendance'
        unique_together = ['session', 'student']
        ordering = ['student']

    def __str__(self):
        return f"{self.student} - {self.session} - {self.status}"
