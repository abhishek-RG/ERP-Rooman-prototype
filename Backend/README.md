# ERP Rooman Prototype - Backend

## Technology Stack

### Core
- **Python 3.11+** - Programming language
- **Django 5.0** - Web framework
- **Django REST Framework 3.14+** - RESTful API framework

### Database
- **SQLite3** - Development (default)
- **PostgreSQL 15+** - Production (recommended)

### Authentication & Security
- **djangorestframework-simplejwt** - JWT token authentication
- **django-cors-headers** - CORS handling for React frontend

### Additional Packages
- **python-decouple** - Environment variable management
- **Pillow** - Image handling
- **psycopg2-binary** - PostgreSQL adapter

## Project Structure

```
Backend/
├── Backend/               # Main Django project
│   ├── __init__.py
│   ├── settings.py       # Project settings
│   ├── urls.py           # Main URL configuration
│   ├── wsgi.py          # WSGI configuration
│   └── asgi.py          # ASGI configuration
│
├── Auth/                 # Authentication app
│   ├── models.py        # Custom User model
│   ├── serializers.py   # User serializers
│   ├── views.py         # Auth views (login, register, etc.)
│   └── urls.py          # Auth endpoints
│
├── student/             # Student management app
│   ├── models.py        # Student, Course, Enrollment, Attendance, etc.
│   ├── serializers.py   # Student serializers
│   ├── views.py         # Student viewsets
│   └── urls.py          # Student endpoints
│
├── admin/               # Admin management app
│   ├── models.py        # AdminProfile, SystemSettings, AuditLog, etc.
│   ├── serializers.py   # Admin serializers
│   ├── views.py         # Admin viewsets
│   └── urls.py          # Admin endpoints
│
├── employee/            # Employee management app
│   ├── models.py        # Employee, Attendance, Leave, Tasks, etc.
│   ├── serializers.py   # Employee serializers
│   ├── views.py         # Employee viewsets
│   └── urls.py          # Employee endpoints
│
├── manage.py            # Django management script
├── requirements.txt     # Python dependencies
└── .env                 # Environment variables
```

## Installation & Setup

### 1. Create Virtual Environment

```bash
cd Backend
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Edit the `.env` file and set your configuration:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Run Development Server

```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000`

## API Endpoints

### Authentication (`/api/auth/`)
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile
- `POST /api/auth/change-password/` - Change password
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Student (`/api/student/`)
- `GET /api/student/students/` - List all students
- `POST /api/student/students/` - Create student
- `GET /api/student/students/{id}/` - Get student details
- `GET /api/student/students/my_profile/` - Get current student profile
- `GET /api/student/courses/` - List courses
- `GET /api/student/courses/my_courses/` - Get enrolled courses
- `GET /api/student/attendance/` - List attendance
- `GET /api/student/attendance/my_attendance/` - Get my attendance
- `GET /api/student/assignments/` - List assignments
- `POST /api/student/submissions/` - Submit assignment
- `GET /api/student/grades/` - List grades
- `GET /api/student/grades/my_grades/` - Get my grades

### Admin (`/api/admin/`)
- `GET /api/admin/profiles/` - List admin profiles
- `GET /api/admin/users/` - List all users
- `POST /api/admin/users/{id}/activate/` - Activate user
- `POST /api/admin/users/{id}/deactivate/` - Deactivate user
- `GET /api/admin/users/statistics/` - Get user statistics
- `GET /api/admin/settings/` - System settings
- `GET /api/admin/audit-logs/` - View audit logs
- `GET /api/admin/notifications/` - List notifications
- `GET /api/admin/reports/` - Generate reports

### Employee (`/api/employee/`)
- `GET /api/employee/employees/` - List employees
- `GET /api/employee/employees/my_profile/` - Get my profile
- `GET /api/employee/attendance/` - Attendance records
- `POST /api/employee/attendance/check_in/` - Check in
- `POST /api/employee/attendance/check_out/` - Check out
- `GET /api/employee/leave-requests/` - List leave requests
- `GET /api/employee/leave-requests/my_leaves/` - Get my leaves
- `POST /api/employee/leave-requests/{id}/approve/` - Approve leave
- `GET /api/employee/tasks/` - List tasks
- `GET /api/employee/tasks/my_tasks/` - Get my tasks
- `GET /api/employee/payroll/` - Payroll records
- `GET /api/employee/performance/` - Performance reviews

## User Roles

The system supports three user roles:
1. **Student** - Access to courses, assignments, grades, attendance
2. **Admin** - Full system access, user management, reports
3. **Employee** - Access to tasks, attendance, leave management, payroll

## Database Models

### Auth App
- **User** - Custom user model with role-based access

### Student App
- **Student** - Student profile
- **Course** - Course information
- **Enrollment** - Student course enrollments
- **Attendance** - Student attendance records
- **Assignment** - Course assignments
- **AssignmentSubmission** - Student submissions
- **Grade** - Student grades

### Admin App
- **AdminProfile** - Admin user profile
- **SystemSettings** - Application settings
- **AuditLog** - System audit logs
- **Notification** - User notifications
- **Report** - Generated reports

### Employee App
- **Employee** - Employee profile
- **EmployeeAttendance** - Employee attendance
- **LeaveRequest** - Leave requests
- **Task** - Employee tasks
- **Payroll** - Salary information
- **Performance** - Performance reviews

## Development Commands

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Run tests
python manage.py test

# Create app (if needed)
python manage.py startapp app_name

# Collect static files
python manage.py collectstatic
```

## Testing

Run tests with:
```bash
python manage.py test
```

## Production Deployment

### Using PostgreSQL

1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE erp_db;
CREATE USER erp_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE erp_db TO erp_user;
```

3. Update `.env`:
```env
DB_NAME=erp_db
DB_USER=erp_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

4. Update `settings.py` to use PostgreSQL configuration

5. Run migrations:
```bash
python manage.py migrate
```

### Security Checklist
- [ ] Change `SECRET_KEY` to a strong random value
- [ ] Set `DEBUG=False`
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS
- [ ] Configure proper CORS settings
- [ ] Set up proper logging
- [ ] Configure email backend
- [ ] Set up backup strategy

## API Authentication

All API endpoints (except registration and login) require JWT authentication.

### Getting Access Token

```bash
POST /api/auth/login/
{
    "username": "your_username",
    "password": "your_password"
}

Response:
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {...}
}
```

### Using Access Token

```bash
GET /api/student/courses/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### Refreshing Token

```bash
POST /api/auth/token/refresh/
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## License

This project is part of the ERP Rooman Prototype.
