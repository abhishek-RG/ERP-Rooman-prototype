from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth import get_user_model
from .models import AdminProfile, SystemSettings, AuditLog, Notification, Report, Enquiry
from .serializers import (
    AdminProfileSerializer, UserManagementSerializer,
    SystemSettingsSerializer, AuditLogSerializer, 
    NotificationSerializer, ReportSerializer, EnquirySerializer,
    FollowUpSerializer
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


class EnquiryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Enquiry operations
    """
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer
    permission_classes = [AllowAny]  # Allow anyone to submit enquiries
    
    def list(self, request, *args, **kwargs):
        """List all enquiries with pagination"""
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({'results': serializer.data})
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Enquiry submitted successfully', 'data': serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {'message': 'Failed to submit enquiry', 'errors': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        """Update the lead_status of an enquiry"""
        enquiry = self.get_object()
        lead_status = request.data.get('lead_status')
        
        if lead_status not in ['cold', 'warm', 'hot']:
            return Response(
                {'error': 'Invalid lead_status. Must be cold, warm, or hot.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        enquiry.lead_status = lead_status
        enquiry.save()
        serializer = self.get_serializer(enquiry)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'], url_path='update-stage')
    def update_stage(self, request, pk=None):
        """Update the stage of an enquiry"""
        enquiry = self.get_object()
        new_stage = request.data.get('new_stage')
        
        if new_stage not in ['ENQUIRY', 'LEAD', 'CONVERTED']:
            return Response(
                {'error': 'Invalid stage. Must be ENQUIRY, LEAD, or CONVERTED.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        enquiry.stage = new_stage
        enquiry.save()
        serializer = self.get_serializer(enquiry)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='add-followup')
    def add_followup(self, request, pk=None):
        """Add a follow-up for an enquiry"""
        enquiry = self.get_object()
        data = request.data.copy()
        data['enquiry'] = enquiry.id
        
        serializer = FollowUpSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'], url_path='followups')
    def get_followups(self, request, pk=None):
        """Get all follow-ups for an enquiry"""
        enquiry = self.get_object()
        followups = enquiry.followups.all()
        serializer = FollowUpSerializer(followups, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='send-email')
    def send_email(self, request):
        """Send HTML email follow-up to enquiry user"""
        from django.core.mail import EmailMultiAlternatives
        from django.conf import settings
        
        to_email = request.data.get('to_email')
        subject = request.data.get('subject')
        message = request.data.get('message')
        
        if not to_email or not subject or not message:
            return Response(
                {'error': 'to_email, subject, and message are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Create HTML email template
            html_content = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>{subject}</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px; text-align: center;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">{subject}</h1>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <div style="color: #333333; font-size: 16px; line-height: 1.6;">
                                            {message.replace(chr(10), '<br>')}
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                                        <p style="color: #888888; font-size: 14px; margin: 0;">
                                            © 2026 Rooman Technologies. All rights reserved.
                                        </p>
                                        <p style="color: #888888; font-size: 12px; margin: 10px 0 0 0;">
                                            This email was sent to {to_email}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """
            
            # Create plain text version as fallback
            text_content = message
            
            # Create email with both HTML and plain text versions
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[to_email]
            )
            email.attach_alternative(html_content, "text/html")
            email.send(fail_silently=False)
            
            return Response({
                'success': True,
                'message': 'Email sent successfully'
            })
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
