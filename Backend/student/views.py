from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import (
    Student, Course, Enrollment,
    Attendance, Assignment, AssignmentSubmission, Grade
)
from .serializers import (
    StudentSerializer, CourseSerializer, EnrollmentSerializer,
    AttendanceSerializer, AssignmentSerializer, 
    AssignmentSubmissionSerializer, GradeSerializer
)


class StudentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Student operations
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Get current student's profile"""
        try:
            student = Student.objects.get(user=request.user)
            serializer = self.get_serializer(student)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response(
                {'error': 'Student profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class CourseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Course operations
    """
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_courses(self, request):
        """Get courses enrolled by current student"""
        try:
            student = Student.objects.get(user=request.user)
            enrollments = Enrollment.objects.filter(student=student, status='active')
            courses = [enrollment.course for enrollment in enrollments]
            serializer = self.get_serializer(courses, many=True)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response(
                {'error': 'Student profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class EnrollmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Enrollment operations
    """
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]


class AttendanceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Attendance operations
    """
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_attendance(self, request):
        """Get attendance records for current student"""
        try:
            student = Student.objects.get(user=request.user)
            attendances = Attendance.objects.filter(student=student)
            serializer = self.get_serializer(attendances, many=True)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response(
                {'error': 'Student profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class AssignmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Assignment operations
    """
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]


class AssignmentSubmissionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Assignment Submission operations
    """
    queryset = AssignmentSubmission.objects.all()
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_submissions(self, request):
        """Get submissions by current student"""
        try:
            student = Student.objects.get(user=request.user)
            submissions = AssignmentSubmission.objects.filter(student=student)
            serializer = self.get_serializer(submissions, many=True)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response(
                {'error': 'Student profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class GradeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Grade operations
    """
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_grades(self, request):
        """Get grades for current student"""
        try:
            student = Student.objects.get(user=request.user)
            grades = Grade.objects.filter(student=student)
            serializer = self.get_serializer(grades, many=True)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response(
                {'error': 'Student profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
