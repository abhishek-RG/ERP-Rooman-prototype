import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

interface NavItem {
  name: string
  path: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

interface LayoutProps {
  children: React.ReactNode
  role: 'student' | 'admin' | 'employee'
}

const getNavItems = (role: string): NavItem[] => {
  const baseItems = {
    student: [
      { name: 'Dashboard', path: '/student/dashboard', icon: HomeIcon },
      { name: 'Courses', path: '/student/courses', icon: DocumentTextIcon },
      { name: 'Attendance', path: '/student/attendance', icon: ChartBarIcon },
      { name: 'Assignments', path: '/student/assignments', icon: DocumentTextIcon },
      { name: 'Grades', path: '/student/grades', icon: ChartBarIcon },
    ],
    employee: [
      { name: 'Dashboard', path: '/employee/dashboard', icon: HomeIcon },
      { name: 'Attendance', path: '/employee/attendance', icon: ChartBarIcon },
      { name: 'Tasks', path: '/employee/tasks', icon: DocumentTextIcon },
      { name: 'Leave', path: '/employee/leave', icon: DocumentTextIcon },
      { name: 'Payroll', path: '/employee/payroll', icon: ChartBarIcon },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
      { name: 'Enquiries', path: '/admin/users', icon: UserGroupIcon },
      { name: 'Students', path: '/admin/students', icon: UserGroupIcon },
      { name: 'Employees', path: '/admin/employees', icon: UserGroupIcon },
      { name: 'Reports', path: '/admin/reports', icon: ChartBarIcon },
      { name: 'Settings', path: '/admin/settings', icon: Cog6ToothIcon },
    ],
  }

  return baseItems[role as keyof typeof baseItems] || []
}

const Layout = ({ children, role }: LayoutProps) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const navItems = getNavItems(role)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-primary-600 text-white">
            <h1 className="text-xl font-bold">ERP Rooman</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile & Logout */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center">
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}

export default Layout
