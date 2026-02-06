from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import AdminProfile, SystemSettings, AuditLog, Notification, Report, Activity
from .serializers import (
    AdminProfileSerializer, UserManagementSerializer,
    SystemSettingsSerializer, AuditLogSerializer, 
    NotificationSerializer, ReportSerializer,
    ActivitySerializer, ActivityListSerializer
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


class ActivityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Activity CRUD operations
    
    Endpoints:
    - GET /api/activities/ - List all activities (with filters)
    - POST /api/activities/ - Create new activity
    - GET /api/activities/{id}/ - Retrieve activity details
    - PUT /api/activities/{id}/ - Update activity
    - DELETE /api/activities/{id}/ - Delete activity
    - GET /api/activities/my-activities/ - Get activities for logged-in user
    """
    
    queryset = Activity.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['activity_description', 'person_to_contact', 'venue']
    ordering_fields = ['activity_date', 'created_at', 'priority']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Use different serializer for list vs detail views"""
        if self.action == 'list':
            return ActivityListSerializer
        return ActivitySerializer
    
    def get_queryset(self):
        """
        Filter activities based on user role and permissions
        Admin/Executive can see all activities, others can only see their own
        """
        user = self.request.user
        
        # Admin users can see all activities
        if hasattr(user, 'role') and user.role == 'admin':
            return Activity.objects.all()
        
        # Other users: show activities they created OR activities created by any admin
        # (Employees must be able to view activities created by Admins)
        return Activity.objects.filter(
            Q(executive=user) | Q(executive__role='admin')
        )
    
    def perform_create(self, serializer):
        """Auto-assign the current user as the executive if not provided"""
        # If executive not provided, use current user
        if 'executive' not in serializer.validated_data:
            serializer.save(executive=self.request.user)
        else:
            serializer.save()
    
    def create(self, request, *args, **kwargs):
        """Create a new activity with enhanced response"""
        # If executive is not provided, use current user
        data = request.data.copy()
        if 'executive' not in data or not data['executive']:
            data['executive'] = request.user.id
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(
            {
                'data': serializer.data,
                'message': 'Activity created successfully'
            },
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, *args, **kwargs):
        """Update activity with enhanced response"""
        # For non-admin users, only allow updating the `status` field.
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        user = request.user
        is_admin = hasattr(user, 'role') and user.role == 'admin'

        data = request.data.copy()

        if not is_admin:
            # Only allow status updates from non-admins
            allowed = {'status'}
            # If request contains other fields, ignore them and only keep status
            data = {k: v for k, v in data.items() if k in allowed}
            # If there's nothing to update, return bad request
            if 'status' not in data:
                return Response({'detail': 'Only status updates are allowed.'}, status=status.HTTP_400_BAD_REQUEST)
            # Force partial to True for safety
            partial = True

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(
            {
                'data': serializer.data,
                'message': 'Activity updated successfully'
            },
            status=status.HTTP_200_OK
        )
    
    def destroy(self, request, *args, **kwargs):
        """Delete activity with enhanced response"""
        instance = self.get_object()
        self.perform_destroy(instance)
        
        return Response(
            {'message': 'Activity deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )
    
    @action(detail=False, methods=['get'])
    def my_activities(self, request):
        """
        Get all activities for the current user (executive)
        Endpoint: GET /api/activities/my-activities/
        """
        activities = Activity.objects.filter(executive=request.user).order_by('-created_at')
        serializer = ActivityListSerializer(activities, many=True)
        
        return Response({
            'count': activities.count(),
            'results': serializer.data
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def by_date(self, request):
        """
        Filter activities by date range
        Query params: start_date, end_date (YYYY-MM-DD format)
        Endpoint: GET /api/activities/by-date/?start_date=2026-01-01&end_date=2026-12-31
        """
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        queryset = self.get_queryset()
        
        if start_date:
            queryset = queryset.filter(activity_date__gte=start_date)
        
        if end_date:
            queryset = queryset.filter(activity_date__lte=end_date)
        
        serializer = ActivityListSerializer(
            queryset.order_by('-activity_date'),
            many=True
        )
        
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def by_status(self, request):
        """
        Filter activities by status
        Query params: status (planned, in_progress, completed, cancelled, pending)
        Endpoint: GET /api/activities/by-status/?status=completed
        """
        status_filter = request.query_params.get('status')
        
        queryset = self.get_queryset()
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        serializer = ActivityListSerializer(queryset, many=True)
        
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def by_priority(self, request):
        """
        Filter activities by priority
        Query params: priority (low, medium, high, urgent)
        Endpoint: GET /api/activities/by-priority/?priority=high
        """
        priority_filter = request.query_params.get('priority')
        
        queryset = self.get_queryset()
        
        if priority_filter:
            queryset = queryset.filter(priority=priority_filter)
        
        serializer = ActivityListSerializer(queryset, many=True)
        
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        }, status=status.HTTP_200_OK)

