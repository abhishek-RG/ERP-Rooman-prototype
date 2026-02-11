from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.http import HttpResponse
import io
from datetime import datetime
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from .models_batches import Batch, Session, SessionAttendance
from .serializers import (
    AdminProfileSerializer, UserManagementSerializer,
    SystemSettingsSerializer, AuditLogSerializer, 
    NotificationSerializer, ReportSerializer, EnquirySerializer,
    FollowUpSerializer, ActivitySerializer, ActivityListSerializer,
    StudentInvoiceListSerializer, StudentInvoiceSerializer, StudentReceiptSerializer,
    CourseFeeStructureSerializer, BatchSerializer, SessionSerializer,
    SessionAttendanceSerializer
)
from student.models import Student
from .models import (
    AdminProfile, SystemSettings, AuditLog, Notification, Report, Activity, Enquiry, FollowUp,
    StudentInvoice, StudentReceipt, CourseFeeStructure
)



User = get_user_model()


class IsAdminOrHasAdminProfile(IsAdminUser):
    """
    Permission check that allows admins (is_staff or is_superuser) or users with admin profile
    """
    def has_permission(self, request, view):
        # Check if user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Allow staff/superuser
        if request.user.is_staff or request.user.is_superuser:
            return True
        
        # Allow users with admin profile and admin role
        if request.user.role == 'admin':
            return AdminProfile.objects.filter(user=request.user).exists()
        
        return False


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
    permission_classes = [IsAuthenticated, IsAdminOrHasAdminProfile]
    
    def get_queryset(self):
        """Filter users by role if role query parameter is provided"""
        queryset = User.objects.all()
        role = self.request.query_params.get('role', None)
        if role and role in ['student', 'employee', 'admin']:
            queryset = queryset.filter(role=role)
        return queryset

    def retrieve(self, request, pk=None):
        """Retrieve a user and include role-specific profile fields."""
        user = self.get_object()
        serializer = self.get_serializer(user)
        data = serializer.data

        # Attach student or employee profile details if available
        try:
            if hasattr(user, 'role') and user.role == 'student':
                from student.models import Student
                student = Student.objects.filter(user=user).first()
                if student:
                    data.update({
                        'student_id': getattr(student, 'student_id', None),
                        'center': getattr(student, 'center', None),
                        'enrollment_date': getattr(student, 'enrollment_date', None),
                        'courses': [e.course.course_name for e in student.enrollments.all()]
                    })
        except Exception:
            pass

        try:
            if hasattr(user, 'role') and user.role == 'employee':
                from employee.models import Employee
                emp = Employee.objects.filter(user=user).first()
                if emp:
                    data.update({
                        'employee_id': getattr(emp, 'employee_id', None),
                        'designation': getattr(emp, 'designation', None),
                        'department': getattr(emp, 'department', None),
                        'join_date': getattr(emp, 'join_date', None),
                        'salary': getattr(emp, 'salary', None),
                        'employment_type': getattr(emp, 'employment_type', None),
                    })
        except Exception:
            pass

        return Response(data)
    
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
    
    @action(detail=True, methods=['get'])
    def invoice(self, request, pk=None):
        """Generate and return a PDF invoice for the user."""
        user = self.get_object()

        # Gather profile identifier
        profile_id = ''
        if hasattr(user, 'role') and user.role == 'student':
            try:
                from student.models import Student
                student = Student.objects.filter(user=user).first()
                profile_id = student.student_id if student else ''
            except Exception:
                profile_id = ''
        elif hasattr(user, 'role') and user.role == 'employee':
            try:
                from employee.models import Employee
                emp = Employee.objects.filter(user=user).first()
                profile_id = emp.employee_id if emp else ''
            except Exception:
                profile_id = ''

        # Build invoice contents
        invoice_number = f"INV-{user.id}-{int(datetime.utcnow().timestamp())}"
        date_issued = datetime.utcnow().strftime('%Y-%m-%d')

        # Generate PDF in-memory using reportlab
        try:
            from reportlab.pdfgen import canvas
            buffer = io.BytesIO()
            p = canvas.Canvas(buffer)
            p.setFont('Helvetica-Bold', 16)
            p.drawString(40, 800, 'ERP Rooman')
            p.setFont('Helvetica', 12)
            p.drawString(40, 780, f'Invoice Number: {invoice_number}')
            p.drawString(40, 765, f'Date Issued: {date_issued}')
            p.drawString(40, 745, f'Name: {user.get_full_name() or user.username}')
            p.drawString(40, 730, f'Role: {user.role}')
            p.drawString(40, 715, f'Email: {user.email}')
            p.drawString(40, 700, f'ID: {profile_id}')
            p.drawString(40, 680, 'Thank you for using ERP Rooman.')
            p.showPage()
            p.save()
            buffer.seek(0)

            response = HttpResponse(buffer, content_type='application/pdf')
            filename = f"invoice_{user.username}.pdf"
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
        except Exception as e:
            return Response({'detail': f'Failed to generate invoice: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
    permission_classes = [IsAuthenticated, IsAdminOrHasAdminProfile]


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for Audit Logs (read-only)
    """
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, IsAdminOrHasAdminProfile]


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
    permission_classes = [IsAuthenticated, IsAdminOrHasAdminProfile]
    
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


class InvoiceDashboardViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing students with calculated invoice details
    """
    permission_classes = [IsAdminUser]
    serializer_class = StudentInvoiceListSerializer
    ordering_fields = ['student_id', 'enrollment_date']
    search_fields = ['student_id', 'user__first_name', 'user__last_name', 'user__email']

    def get_queryset(self):
        return Student.objects.all().select_related('user').prefetch_related('enrollments__course').order_by('-created_at')


class StudentInvoiceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = StudentInvoiceSerializer
    queryset = StudentInvoice.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['student__user__first_name', 'student__user__last_name', 'invoice_number']
    
    def get_queryset(self):
        qs = super().get_queryset()
        student_id = self.request.query_params.get('student_id')
        if student_id:
            qs = qs.filter(student_id=student_id)
        return qs

    @action(detail=True, methods=['get'])
    def download_pdf(self, request, pk=None):
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import A4
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.enums import TA_RIGHT, TA_CENTER, TA_LEFT
        from num2words import num2words
        import io 
        
        invoice = self.get_object()
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
        elements = []
        
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='RightAlign', alignment=TA_RIGHT))
        styles.add(ParagraphStyle(name='CenterAlign', alignment=TA_CENTER))
        
        def format_currency(amount):
            return "{:,.2f}".format(float(amount))
            
        # INVOICE Header
        elements.append(Paragraph("<b>INVOICE</b>", styles['RightAlign']))
        elements.append(Spacer(1, 10))
        
        # Table 1: Company Info | Invoice Details
        company_text = "<b>M/s. Rooman Technologies Pvt. Ltd.</b><br/>#30, 12th Cross, 1st Stage, Rajajinagar, Near Nalapaka Hotel, Bangalore-560010, Bangalore - 560010, Karnataka, India!"
        invoice_text = f"Invoice No.:<br/><b>{invoice.invoice_number}</b><br/><br/>Dated:<br/><b>{invoice.invoice_date.strftime('%d/%m/%Y')}</b><br/><br/>Student Reg. No.:<br/><b>{invoice.student.student_id}</b>"
        
        data = [[Paragraph(company_text, styles['Normal']), Paragraph(invoice_text, styles['Normal'])]]
        t1 = Table(data, colWidths=[350, 180])
        t1.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1, colors.black),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        elements.append(t1)
        
        # Table 2: Student Info
        student_addr = invoice.student.center if invoice.student.center else "Bangalore - , Karnataka, India."
        student_text = f"Student:<br/><b>{invoice.student.user.get_full_name()}</b><br/>{student_addr}"
        data = [[Paragraph(student_text, styles['Normal'])]]
        t2 = Table(data, colWidths=[530])
        t2.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1, colors.black),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        elements.append(t2)
        
        # Table 3: Fees
        data = [['Sl. #', 'Course', 'Amount in Rs.']]
        courses = invoice.courses.split(', ') if invoice.courses else []
        for idx, course_name in enumerate(courses, 1):
            fee_amount = ""
            try:
                cfs = CourseFeeStructure.objects.filter(course_name=course_name).first()
                if cfs:
                    fee_amount = format_currency(cfs.fee_amount)
            except:
                pass
            data.append([str(idx), Paragraph(course_name, styles['Normal']), fee_amount])
            
        # Spacer rows
        data.append(['', '', ''])
        
        # Totals
        totals = [
            ('Total Fee:', invoice.total_amount),
            ('Course Fee:', invoice.total_amount),
            ('Discount:', invoice.discount),
            ('Discounted Course Fee:', invoice.grand_total - invoice.registration_amount),
            ('Service Tax:', 0.00),
            ('Grand Total:', invoice.grand_total)
        ]
        
        for label, val in totals:
            style = styles['RightAlign']
            # Bold for Grand Total label and value
            lbl = f"<b>{label}</b>" if label == 'Grand Total:' else label
            v = f"<b>{format_currency(val)}</b>" if label == 'Grand Total:' else format_currency(val)
            data.append(['', Paragraph(lbl, style), Paragraph(v, style)])

        t3 = Table(data, colWidths=[40, 390, 100])
        t3.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1, colors.black),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
            ('ALIGN', (2,0), (2,-1), 'RIGHT'),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('SPAN', (0, len(data)-6), (0, -1)), # Span first col for totals area? No, simpler to leave empty.
        ]))
        elements.append(t3)
        
        # Table 4: Words
        try:
            amt_words = num2words(invoice.grand_total, lang='en_IN').title() + " Only/-"
        except:
            amt_words = f"{invoice.grand_total} Only/-"
            
        data = [[f"Amount chargeable (in words):\nRupees {amt_words}"]]
        t4 = Table(data, colWidths=[530])
        t4.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1, colors.black),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        elements.append(t4)
        
        # Table 5: Registration Receipt
        if invoice.registration_amount > 0:
            rec_no = "-------"
            # Attempt to find receipt
            rec = StudentReceipt.objects.filter(invoice=invoice, amount=invoice.registration_amount).first()
            if rec: rec_no = rec.receipt_number
            
            data = [[f"Received as registration amount vide receipt no. {rec_no}:", format_currency(invoice.registration_amount)]]
            t5 = Table(data, colWidths=[430, 100])
            t5.setStyle(TableStyle([
                ('BOX', (0,0), (-1,-1), 1, colors.black),
                ('GRID', (0,0), (-1,-1), 1, colors.black),
                ('ALIGN', (1,0), (1,0), 'RIGHT'),
            ]))
            elements.append(t5)
            
        # Table 6: Installment Payable
        inst_total = sum(i.amount for i in invoice.installments.all())
        data = [['Installment Payable:', format_currency(inst_total)]]
        t6 = Table(data, colWidths=[430, 100])
        t6.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1, colors.black),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
            ('ALIGN', (1,0), (1,0), 'RIGHT'),
        ]))
        elements.append(t6)
        
        # Table 7: Installments List
        data = [['Sl. #', 'Installment', 'Date', 'Amount in Rs.']]
        for idx, inst in enumerate(invoice.installments.all(), 1):
            data.append([str(idx), f"Installment {inst.installment_no}", inst.due_date.strftime('%d/%m/%Y'), format_currency(inst.amount)])
            
        t7 = Table(data, colWidths=[40, 250, 140, 100])
        t7.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1, colors.black),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
            ('ALIGN', (3,0), (3,-1), 'RIGHT'),
            ('ALIGN', (0,0), (0,-1), 'CENTER'),
            ('ALIGN', (2,0), (2,-1), 'CENTER'),
        ]))
        elements.append(t7)
        
        # Table 8: Footer
        terms = ("Terms and Conditions:<br/>"
                 "1. The course fee paid is Non-refundable/Non-Transferable.<br/>"
                 "2. Student must abide to the payment date mentioned for each installment.<br/>"
                 "3. Any payments made will be acknowledged by SMS/Email.<br/>"
                 "4. For detailed instruction, login to student's portal.")
        signatory = "<br/><br/><br/><br/>For M/s. Rooman Technologies Pvt. Ltd.<br/><br/><br/>Authorized Signatory"
        
        data = [[Paragraph(terms, styles['Normal']), Paragraph(signatory, styles['RightAlign'])]]
        t8 = Table(data, colWidths=[280, 250])
        t8.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1, colors.black),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        elements.append(t8)
        
        doc.build(elements)
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{invoice.invoice_number}.pdf"'
        return response


class StudentReceiptViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    serializer_class = StudentReceiptSerializer
    queryset = StudentReceipt.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['invoice__invoice_number', 'receipt_number']
    
    def perform_create(self, serializer):
        try:
            from .models import AdminProfile
            profile = AdminProfile.objects.get(user=self.request.user)
            serializer.save(created_by=profile)
        except:
             serializer.save()

    @action(detail=True, methods=['get'])
    def download_pdf(self, request, pk=None):
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import A4
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.enums import TA_RIGHT, TA_CENTER, TA_LEFT
        from num2words import num2words
        from django.db.models import Sum
        import io 

        receipt = self.get_object()
        invoice = receipt.invoice
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=30)
        elements = []
        
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='RightAlign', alignment=TA_RIGHT))
        styles.add(ParagraphStyle(name='CenterAlign', alignment=TA_CENTER))
        
        def format_currency(amount):
            return "{:,.2f}".format(float(amount))
            
        # Header
        elements.append(Paragraph("<b>RECEIPT</b>", styles['RightAlign']))
        elements.append(Spacer(1, 10))
        
        # Table 1: Company | Receipt Info
        company_text = "<b>M/s. Rooman Technologies Pvt. Ltd.</b><br/>#30, 12th Cross, 1st Stage, Rajajinagar, Near Nalapaka Hotel, Bangalore-560010, Bangalore - 560010, Karnataka, India."
        
        rec_date = receipt.receipt_date.strftime('%d/%m/%Y')
        receipt_info = f"Receipt No.: {receipt.receipt_number}<br/><br/>Dated:<br/>{rec_date}"
        
        data = [[Paragraph(company_text, styles['Normal']), Paragraph(receipt_info, styles['Normal'])]]
        t1 = Table(data, colWidths=[350, 180])
        t1.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1, colors.black),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        elements.append(t1)
        
        # Table 2: Student | Invoice Info
        student_addr = invoice.student.center if invoice.student.center else "Bangalore - , Karnataka, India."
        student_text = f"Student:<br/>{invoice.student.user.get_full_name()}<br/>, {student_addr}"
        
        inv_info = f"Invoice No.:<br/>{invoice.invoice_number}<br/>Student Reg. No.:<br/>{invoice.student.student_id}"
        
        data = [[Paragraph(student_text, styles['Normal']), Paragraph(inv_info, styles['Normal'])]]
        t2 = Table(data, colWidths=[350, 180])
        t2.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1, colors.black),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        elements.append(t2)
        
        # Table 3: Items
        data = [['Sl. #', 'Description', 'Amount in Rs.', 'Tax in Rs.', 'Total in Rs.']]
        
        desc = receipt.notes if receipt.notes else receipt.category
        
        amount = format_currency(receipt.amount)
        tax = "0.00"
        
        data.append(['1.', desc, amount, tax, amount])
        
        # Spacers
        data.append(['', '', '', '', ''])
        data.append(['', '', '', '', ''])
        
        # Totals
        data.append(['', '', 'Net Total Amount:', '', amount])
        data.append(['', '', 'Service Tax:', '', tax])
        data.append(['', '', 'Total:', '', amount])
        
        t3 = Table(data, colWidths=[40, 250, 90, 70, 80])
        t3.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1, colors.black),
            ('GRID', (0,0), (-1,0), 1, colors.black), # Header grid
            ('GRID', (0,1), (-1,1), 1, colors.black), # Item row grid
            ('ALIGN', (2,0), (-1,-1), 'RIGHT'),
            ('ALIGN', (0,0), (0,-1), 'CENTER'),
            ('ALIGN', (2,4), (2,6), 'RIGHT'),
            ('ALIGN', (4,4), (4,6), 'RIGHT'),
        ]))
        elements.append(t3)
        
        # Words
        try:
            amt_words = num2words(receipt.amount, lang='en_IN').title() + " Only/-"
        except:
            amt_words = f"{receipt.amount} Only/-"
        
        data = [[f"Amount chargeable (in words):\nRupees {amt_words}"]]
        t4 = Table(data, colWidths=[530])
        t4.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1, colors.black),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        elements.append(t4)
        
        # Footer
        total_paid = StudentReceipt.objects.filter(invoice=invoice).aggregate(Sum('amount'))['amount__sum'] or 0
        balance = invoice.grand_total - total_paid
        if balance < 0: balance = 0
        
        footer_data = [[
            f"Balance Due:\nRs.{format_currency(balance)}/-",
            "Student Signature:",
            f"For M/s. Rooman Technologies Pvt. Ltd.\n\n\n\n\nAuthorized Signatory"
        ]]
        
        t5 = Table(footer_data, colWidths=[176, 177, 177])
        t5.setStyle(TableStyle([
            ('BOX', (0,0), (-1,-1), 1, colors.black),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('ALIGN', (2,0), (2,0), 'RIGHT'),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        elements.append(t5)
        
        doc.build(elements)
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="receipt_{receipt.receipt_number}.pdf"'
        return response

class CourseFeeStructureViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAdminOrHasAdminProfile]
    serializer_class = CourseFeeStructureSerializer
    queryset = CourseFeeStructure.objects.all()

class BatchViewSet(viewsets.ModelViewSet):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer
    permission_classes = [IsAdminOrHasAdminProfile]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['course__course_name', 'faculty__first_name', 'faculty__last_name']
    ordering_fields = ['start_date', 'created_at']

    def perform_create(self, serializer):
        batch = serializer.save()
        
        # Auto-generate sessions
        from datetime import timedelta
        
        current_date = batch.start_date
        end_date = batch.end_date
        days_map = {
            'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4, 'Sat': 5, 'Sun': 6
        }
        target_days = [days_map[d] for d in batch.days if d in days_map]
        
        sessions_to_create = []
        while current_date <= end_date:
            if current_date.weekday() in target_days:
                sessions_to_create.append(Session(
                    batch=batch,
                    session_date=current_date,
                    start_time=batch.session_start_time,
                    end_time=batch.session_end_time,
                    status='scheduled'
                ))
            current_date += timedelta(days=1)
        
        if sessions_to_create:
            Session.objects.bulk_create(sessions_to_create)

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer
    permission_classes = [IsAdminOrHasAdminProfile]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['batch__course__course_name', 'session_date']
    ordering_fields = ['session_date', 'start_time']

    def get_queryset(self):
        queryset = Session.objects.all()
        batch_id = self.request.query_params.get('batch_id')
        if batch_id:
            queryset = queryset.filter(batch_id=batch_id)
        return queryset

class SessionAttendanceViewSet(viewsets.ModelViewSet):
    queryset = SessionAttendance.objects.all()
    serializer_class = SessionAttendanceSerializer
    permission_classes = [IsAdminOrHasAdminProfile]

    def get_queryset(self):
        queryset = SessionAttendance.objects.all()
        session_id = self.request.query_params.get('session_id')
        if session_id:
            queryset = queryset.filter(session_id=session_id)
        return queryset

    @action(detail=False, methods=['post'], url_path='initialize')
    def initialize_attendance(self, request):
        session_id = request.data.get('session_id')
        if not session_id:
            return Response({'error': 'session_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            session = Session.objects.get(id=session_id)
            # Find all students enrolled in the batch
            from student.models import Enrollment
            enrollments = Enrollment.objects.filter(batch=session.batch, student__user__is_active=True)
            
            attendances = []
            for enrollment in enrollments:
                # Check if attendance already exists
                attendance, created = SessionAttendance.objects.get_or_create(
                    session=session,
                    student=enrollment.student,
                    defaults={'status': 'present'}
                )
                attendances.append(attendance)
            
            serializer = self.get_serializer(attendances, many=True)
            return Response(serializer.data)
        except Session.DoesNotExist:
            return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)
