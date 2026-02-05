from django.contrib import admin
from .models import (
    Student, Course, Enrollment,
    Attendance, Assignment, AssignmentSubmission, Grade
)


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['student_id', 'user', 'department', 'semester', 'enrollment_date']
    list_filter = ['department', 'semester', 'enrollment_date']
    search_fields = ['student_id', 'user__username', 'user__email']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['course_code', 'course_name', 'credits', 'department', 'semester']
    list_filter = ['department', 'semester']
    search_fields = ['course_code', 'course_name']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'enrollment_date', 'status']
    list_filter = ['status', 'enrollment_date']
    search_fields = ['student__student_id', 'course__course_code']


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'date', 'status']
    list_filter = ['status', 'date']
    search_fields = ['student__student_id', 'course__course_code']


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'due_date', 'total_marks']
    list_filter = ['course', 'due_date']
    search_fields = ['title', 'course__course_code']


@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(admin.ModelAdmin):
    list_display = ['assignment', 'student', 'submitted_at', 'marks_obtained']
    list_filter = ['submitted_at']
    search_fields = ['student__student_id', 'assignment__title']


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'semester', 'grade', 'grade_points']
    list_filter = ['semester', 'grade']
    search_fields = ['student__student_id', 'course__course_code']
