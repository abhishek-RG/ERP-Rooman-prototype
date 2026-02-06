import { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CreateUserModal from '../../components/admin/CreateUserModal'
import { CreateUserData } from '../../types/createUser'
import ViewUserModal from '../../components/admin/ViewUserModal'
import UserCard, { UserCardData } from '../../components/admin/UserCard'
import { userManagementService } from '../../services/userManagementService'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

type RoleFilter = 'student' | 'employee'

const AdminUsers = () => {
  const [activeRole, setActiveRole] = useState<RoleFilter>('student')
  const [users, setUsers] = useState<UserCardData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Fetch users on component mount and when role changes
  useEffect(() => {
    fetchUsers()
  }, [activeRole])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await userManagementService.getUsers(activeRole)
      setUsers(data)
    } catch (err) {
      setError('Failed to load users. Please try again.')
      console.error('Error fetching users:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      setIsCreating(true)
      setError(null)
      const newUser = await userManagementService.createUser(userData)
      
      // Add new user to list if it matches current role filter
      if (newUser.role === activeRole) {
        setUsers(prev => [newUser, ...prev])
      }
    } catch (err: any) {
      // Show detailed error from backend validation
      let errorMessage = 'Failed to create user'
      if (err.response?.data) {
        const data = err.response.data
        // Handle field-specific errors
        if (typeof data === 'object') {
          const errors = Object.entries(data)
            .map(([key, value]: [string, any]) => {
              const msg = Array.isArray(value) ? value[0] : value
              return `${key}: ${msg}`
            })
            .join('\n')
          errorMessage = errors || errorMessage
        } else if (data.detail) {
          errorMessage = data.detail
        }
      }
      setError(errorMessage)
      throw err
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!userId || !Number.isInteger(userId)) {
      setError('Invalid user ID')
      return
    }
    if (!window.confirm('Are you sure you want to delete this user?')) return

    try {
      setError(null)
      await userManagementService.deleteUser(userId)
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (err) {
      setError('Failed to delete user')
      console.error('Error deleting user:', err)
    }
  }

  const handleViewUser = (userId: number) => {
    setSelectedUserId(userId)
    setIsViewModalOpen(true)
  }

  const handleDownloadInvoice = async (userId: number) => {
    try {
      await userManagementService.downloadInvoice(userId)
    } catch (err) {
      setError('Failed to download invoice')
      console.error('Error downloading invoice:', err)
    }
  }

  return (
    <Layout role="admin">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Role Toggle and Create Button */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={activeRole === 'student' ? 'primary' : 'secondary'}
              onClick={() => setActiveRole('student')}
              size="md"
            >
              Student
            </Button>
            <Button
              variant={activeRole === 'employee' ? 'primary' : 'secondary'}
              onClick={() => setActiveRole('employee')}
              size="md"
            >
              Employee
            </Button>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            size="md"
          >
            + Create User
          </Button>
        </div>

        {/* User Cards */}
        <Card title={`${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}s`}>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : users.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No {activeRole}s found. Create one to get started.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  onDelete={handleDeleteUser}
                  onView={handleViewUser}
                  isLoading={false}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Create User Modal */}
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateUser}
          isLoading={isCreating}
        />

        {/* View User Modal */}
        <ViewUserModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setSelectedUserId(null)
          }}
          userId={selectedUserId}
          onDownloadInvoice={handleDownloadInvoice}
        />
      </div>
    </Layout>
  )
}

export default AdminUsers
