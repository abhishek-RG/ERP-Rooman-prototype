from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import get_user_model
from .models import AdminProfile, SystemSettings, AuditLog, Notification, Report
from .serializers import (
    AdminProfileSerializer, UserManagementSerializer,
    SystemSettingsSerializer, AuditLogSerializer, 
    NotificationSerializer, ReportSerializer
)

User = get_user_model()


class AdminProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Admin Profile operations
    """
    queryset = AdminProfile.objects.all()
    serializer_class = AdminProfileSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        """Get current admin's profile"""
        try:
            admin = AdminProfile.objects.get(user=request.user)
            serializer = self.get_serializer(admin)
            return Response(serializer.data)
        except AdminProfile.DoesNotExist:
            return Response(
                {'error': 'Admin profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class UserManagementViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing all users (admin functionality)
    """
    queryset = User.objects.all()
    serializer_class = UserManagementSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a user"""
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'message': 'User activated successfully'})
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a user"""
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'message': 'User deactivated successfully'})
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get user statistics"""
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        students = User.objects.filter(role='student').count()
        employees = User.objects.filter(role='employee').count()
        admins = User.objects.filter(role='admin').count()
        
        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'students': students,
            'employees': employees,
            'admins': admins
        })


class SystemSettingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for System Settings
    """
    queryset = SystemSettings.objects.all()
    serializer_class = SystemSettingsSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Audit Logs (read-only)
    """
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Notifications
    """
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_notifications(self, request):
        """Get notifications for current user"""
        notifications = Notification.objects.filter(user=request.user)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread notifications"""
        notifications = Notification.objects.filter(user=request.user, is_read=False)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'})


class ReportViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Reports
    """
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    @action(detail=False, methods=['post'])
    def generate(self, request):
        """Generate a new report"""
        # Report generation logic here
        return Response({'message': 'Report generation started'})
