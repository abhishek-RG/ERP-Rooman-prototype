from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import (
    Employee, EmployeeAttendance, LeaveRequest,
    Task, Payroll, Performance
)
from .serializers import (
    EmployeeSerializer, EmployeeAttendanceSerializer,
    LeaveRequestSerializer, TaskSerializer,
    PayrollSerializer, PerformanceSerializer
)


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Employee operations
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Get current employee's profile"""
        try:
            employee = Employee.objects.get(user=request.user)
            serializer = self.get_serializer(employee)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(
                {'error': 'Employee profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class EmployeeAttendanceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Employee Attendance operations
    """
    queryset = EmployeeAttendance.objects.all()
    serializer_class = EmployeeAttendanceSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_attendance(self, request):
        """Get attendance records for current employee"""
        try:
            employee = Employee.objects.get(user=request.user)
            attendances = EmployeeAttendance.objects.filter(employee=employee)
            serializer = self.get_serializer(attendances, many=True)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(
                {'error': 'Employee profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'])
    def check_in(self, request):
        """Check in for current employee"""
        try:
            employee = Employee.objects.get(user=request.user)
            # Check-in logic here
            return Response({'message': 'Checked in successfully'})
        except Employee.DoesNotExist:
            return Response(
                {'error': 'Employee profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'])
    def check_out(self, request):
        """Check out for current employee"""
        try:
            employee = Employee.objects.get(user=request.user)
            # Check-out logic here
            return Response({'message': 'Checked out successfully'})
        except Employee.DoesNotExist:
            return Response(
                {'error': 'Employee profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class LeaveRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Leave Request operations
    """
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_leaves(self, request):
        """Get leave requests for current employee"""
        try:
            employee = Employee.objects.get(user=request.user)
            leaves = LeaveRequest.objects.filter(employee=employee)
            serializer = self.get_serializer(leaves, many=True)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(
                {'error': 'Employee profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a leave request"""
        leave = self.get_object()
        leave.status = 'approved'
        leave.approved_by = request.user
        leave.save()
        return Response({'message': 'Leave request approved'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a leave request"""
        leave = self.get_object()
        leave.status = 'rejected'
        leave.approved_by = request.user
        leave.save()
        return Response({'message': 'Leave request rejected'})


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Task operations
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        """Get tasks assigned to current employee"""
        try:
            employee = Employee.objects.get(user=request.user)
            tasks = Task.objects.filter(assigned_to=employee)
            serializer = self.get_serializer(tasks, many=True)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(
                {'error': 'Employee profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def mark_complete(self, request, pk=None):
        """Mark task as completed"""
        task = self.get_object()
        task.status = 'completed'
        task.save()
        return Response({'message': 'Task marked as completed'})


class PayrollViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Payroll operations
    """
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_payroll(self, request):
        """Get payroll records for current employee"""
        try:
            employee = Employee.objects.get(user=request.user)
            payrolls = Payroll.objects.filter(employee=employee)
            serializer = self.get_serializer(payrolls, many=True)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(
                {'error': 'Employee profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class PerformanceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Performance Review operations
    """
    queryset = Performance.objects.all()
    serializer_class = PerformanceSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_reviews(self, request):
        """Get performance reviews for current employee"""
        try:
            employee = Employee.objects.get(user=request.user)
            reviews = Performance.objects.filter(employee=employee)
            serializer = self.get_serializer(reviews, many=True)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(
                {'error': 'Employee profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
