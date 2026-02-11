import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import LoadingSpinner from '../ui/LoadingSpinner'

interface UserDetail {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: 'student' | 'employee' | 'admin'
  phone_number?: string
  is_active: boolean
  date_joined: string
  // Student fields
  student_id?: string
  center?: string
  enrollment_date?: string
  // Employee fields
  employee_id?: string
  designation?: string
  department?: string
  join_date?: string
  salary?: string
  employment_type?: string
  courses?: string[]
}

interface ViewUserModalProps {
  isOpen: boolean
  onClose: () => void
  userId: number | null
  onDownloadInvoice?: (userId: number) => void
}

import { userManagementService } from '../../services/userManagementService'

const ViewUserModal = ({ isOpen, onClose, userId, onDownloadInvoice }: ViewUserModalProps) => {
  const [user, setUser] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails()
    }
  }, [isOpen, userId])

  const fetchUserDetails = async () => {
    if (!userId) return

    try {
      setIsLoading(true)
      setError(null)
      const data = await userManagementService.getUser(userId)
      setUser(data as unknown as UserDetail)
    } catch (err) {
      setError('Could not load user details')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">User Details</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <p className="text-red-600 text-center py-8">{error}</p>
          ) : user ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">First Name</p>
                    <p className="text-gray-900 font-medium">{user.first_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Last Name</p>
                    <p className="text-gray-900 font-medium">{user.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Username</p>
                    <p className="text-gray-900 font-medium">@{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="text-gray-900 font-medium break-all">{user.email}</p>
                  </div>
                  {user.phone_number && (
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Phone</p>
                      <p className="text-gray-900 font-medium">{user.phone_number}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Role Info */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Role & Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Role</p>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${user.role === 'student' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'employee' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Status</p>
                    <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Student Info */}
              {user.role === 'student' && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {user.student_id && (
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Student ID</p>
                        <p className="text-gray-900 font-medium">{user.student_id}</p>
                      </div>
                    )}
                    {user.center && (
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Center</p>
                        <p className="text-gray-900 font-medium">{user.center}</p>
                      </div>
                    )}
                    {user.enrollment_date && (
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Enrollment Date</p>
                        <p className="text-gray-900 font-medium">
                          {new Date(user.enrollment_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                    {user.courses && user.courses.length > 0 && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500 font-medium">Courses</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {user.courses.map((course, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Employee Info */}
              {user.role === 'employee' && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {user.employee_id && (
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Employee ID</p>
                        <p className="text-gray-900 font-medium">{user.employee_id}</p>
                      </div>
                    )}
                    {user.designation && (
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Designation</p>
                        <p className="text-gray-900 font-medium">{user.designation}</p>
                      </div>
                    )}
                    {user.department && (
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Department</p>
                        <p className="text-gray-900 font-medium">{user.department}</p>
                      </div>
                    )}
                    {user.employment_type && (
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Employment Type</p>
                        <p className="text-gray-900 font-medium capitalize">{user.employment_type}</p>
                      </div>
                    )}
                    {user.join_date && (
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Join Date</p>
                        <p className="text-gray-900 font-medium">
                          {new Date(user.join_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                    {user.salary && (
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Salary</p>
                        <p className="text-gray-900 font-medium">₹{parseFloat(String(user.salary)).toLocaleString('en-IN')}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Dates */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dates</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Date Joined</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(user.date_joined).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          {onDownloadInvoice && user && (
            <Button
              variant="secondary"
              onClick={() => onDownloadInvoice(user.id)}
            >
              Download Invoice
            </Button>
          )}
          <Button
            variant="primary"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div >
  )
}

export default ViewUserModal
