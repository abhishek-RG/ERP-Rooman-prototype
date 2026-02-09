import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'
import { userManagementService } from '../../services/userManagementService'

export interface UserCardData {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: 'student' | 'employee' | 'admin'
  phone_number?: string
  is_active: boolean
  date_joined: string
}

interface UserCardProps {
  user: UserCardData
  onDelete?: (userId: number) => void
  onView?: (userId: number) => void
  isLoading?: boolean
}

const UserCard = ({ user, onDelete, onView, isLoading = false }: UserCardProps) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-800'
      case 'employee':
        return 'bg-green-100 text-green-800'
      case 'admin':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }


  const navigate = useNavigate()

  const handleInvoiceAction = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Feature: Redirect students to Invoice Dashboard
    if (user.role === 'student') {
      navigate('/admin/invoices', { state: { highlightUserId: user.id } })
      return
    }

    // Fallback: Download invoice for other roles (e.g. employees)
    try {
      await userManagementService.downloadInvoice(user.id)
    } catch (err) {
      console.error('Error downloading invoice:', err)
      alert('Failed to download invoice')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header with name and role */}
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">@{user.username}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)} flex-shrink-0 ml-3`}>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </div>

      {/* Content section */}
      <div className="px-5 py-3 space-y-2.5 text-sm">
        {/* Email */}
        <div className="flex items-start gap-2">
          <span className="text-gray-500 font-medium min-w-fit">Email:</span>
          <span className="text-gray-700 break-all">{user.email}</span>
        </div>

        {/* Phone - if available */}
        {user.phone_number && (
          <div className="flex items-start gap-2">
            <span className="text-gray-500 font-medium min-w-fit">Phone:</span>
            <span className="text-gray-700">{user.phone_number}</span>
          </div>
        )}

        {/* Joined date */}
        <div className="flex items-start gap-2">
          <span className="text-gray-500 font-medium min-w-fit">Joined:</span>
          <span className="text-gray-700">{formatDate(user.date_joined)}</span>
        </div>
      </div>

      {/* Status and actions footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-gray-400'
              }`}
          ></div>
          <span className="text-xs text-gray-600 font-medium">
            {user.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleInvoiceAction}
            disabled={isLoading}
          >
            Invoice
          </Button>
          {onView && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onView(user.id)}
              disabled={isLoading}
            >
              View
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(user.id)}
              disabled={isLoading}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserCard
