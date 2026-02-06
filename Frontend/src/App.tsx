import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/common/PrivateRoute'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import StudentCourses from './pages/student/Courses'
import StudentAttendance from './pages/student/Attendance'
import StudentAssignments from './pages/student/Assignments'
import StudentGrades from './pages/student/Grades'

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard'
import EmployeeAttendance from './pages/employee/Attendance'
import EmployeeTasks from './pages/employee/Tasks'
import EmployeeLeave from './pages/employee/Leave'
import EmployeePayroll from './pages/employee/Payroll'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminStudents from './pages/admin/Students'
import AdminEmployees from './pages/admin/Employees'
import AdminReports from './pages/admin/Reports'
import AdminSettings from './pages/admin/Settings'
import AdminUserDetails from './pages/admin/UserDetails'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute role="student">
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/courses"
            element={
              <PrivateRoute role="student">
                <StudentCourses />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <PrivateRoute role="student">
                <StudentAttendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/assignments"
            element={
              <PrivateRoute role="student">
                <StudentAssignments />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/grades"
            element={
              <PrivateRoute role="student">
                <StudentGrades />
              </PrivateRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={
              <PrivateRoute role="employee">
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee/attendance"
            element={
              <PrivateRoute role="employee">
                <EmployeeAttendance />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee/tasks"
            element={
              <PrivateRoute role="employee">
                <EmployeeTasks />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee/leave"
            element={
              <PrivateRoute role="employee">
                <EmployeeLeave />
              </PrivateRoute>
            }
          />
          <Route
            path="/employee/payroll"
            element={
              <PrivateRoute role="employee">
                <EmployeePayroll />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute role="admin">
                <AdminUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users/details/:id"
            element={
              <PrivateRoute role="admin">
                <AdminUserDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <PrivateRoute role="admin">
                <AdminStudents />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <PrivateRoute role="admin">
                <AdminEmployees />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/admin/reports"
            element={
              <PrivateRoute role="admin">
                <AdminReports />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <PrivateRoute role="admin">
                <AdminSettings />
              </PrivateRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
