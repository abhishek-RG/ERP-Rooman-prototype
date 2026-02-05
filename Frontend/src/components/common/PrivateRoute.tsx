import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface PrivateRouteProps {
  children: React.ReactNode
  role?: 'student' | 'admin' | 'employee'
}

const PrivateRoute = ({ children, role }: PrivateRouteProps) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = `/${user.role}/dashboard`
    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}

export default PrivateRoute
