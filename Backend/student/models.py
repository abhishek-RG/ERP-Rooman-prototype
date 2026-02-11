from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Student(models.Model):
    """
    Student Profile Model
    """
    CENTERS = [
        ('Electronic City PMKK Futureskill (TC016371)', 'Electronic City PMKK Futureskill (TC016371)'),
        ('Rajajinagar (123)', 'Rajajinagar (123)'),
        ('Rajajinagar Bangalore (RAJBAN)', 'Rajajinagar Bangalore (RAJBAN)'),
        ('Rooman Online (RON)', 'Rooman Online (RON)'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    student_id = models.CharField(max_length=20, unique=True)
    center = models.CharField(max_length=100, choices=CENTERS, blank=True, null=True)
    enrollment_date = models.DateField()
    department = models.CharField(max_length=100)
    semester = models.IntegerField()
    blood_group = models.CharField(max_length=5, blank=True, null=True)
    guardian_name = models.CharField(max_length=100)
    guardian_contact = models.CharField(max_length=15)
    emergency_contact = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'students'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student_id} - {self.user.get_full_name()}"


class Course(models.Model):
    """
    Course Model
    """
    course_code = models.CharField(max_length=20, unique=True)
    course_name = models.CharField(max_length=200)
    credits = models.IntegerField()
    department = models.CharField(max_length=100)
    semester = models.IntegerField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'courses'
        ordering = ['course_code']
    
    def __str__(self):
        return f"{self.course_code} - {self.course_name}"


class Enrollment(models.Model):
    """
    Student Course Enrollment Model
    """
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    batch = models.ForeignKey('custom_admin.Batch', on_delete=models.SET_NULL, null=True, blank=True, related_name='enrollments')
    enrollment_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=[
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('dropped', 'Dropped')
    ], default='active')
    
    class Meta:
        db_table = 'enrollments'
        unique_together = ['student', 'course']
        ordering = ['-enrollment_date']
    
    def __str__(self):
        return f"{self.student.student_id} - {self.course.course_code}"


class Attendance(models.Model):
    """
    Student Attendance Model
    """
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendances')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
        ('excused', 'Excused')
    ])
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'attendances'
        unique_together = ['student', 'course', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.student.student_id} - {self.course.course_code} - {self.date}"


class Assignment(models.Model):
    """
    Assignment Model
    """
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=200)
    description = models.TextField()
    due_date = models.DateTimeField()
    total_marks = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'assignments'
        ordering = ['-due_date']
    
    def __str__(self):
        return f"{self.course.course_code} - {self.title}"


class AssignmentSubmission(models.Model):
    """
    Assignment Submission Model
    """
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='submissions')
    submission_file = models.FileField(upload_to='assignments/')
    submitted_at = models.DateTimeField(auto_now_add=True)
    marks_obtained = models.IntegerField(blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'assignment_submissions'
        unique_together = ['assignment', 'student']
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"{self.student.student_id} - {self.assignment.title}"


class Grade(models.Model):
    """
    Student Grades Model
    """
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='grades')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='grades')
    semester = models.IntegerField()
    grade = models.CharField(max_length=5)
    grade_points = models.DecimalField(max_digits=3, decimal_places=2)
    remarks = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'grades'
        unique_together = ['student', 'course', 'semester']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student.student_id} - {self.course.course_code} - {self.grade}"
