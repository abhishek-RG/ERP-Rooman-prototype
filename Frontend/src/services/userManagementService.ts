import api from './api'
import { CreateUserData } from '../types/createUser'
import { UserCardData } from '../components/admin/UserCard'

export interface UserResponse extends UserCardData {}

export const userManagementService = {
  /**
   * Fetch all users, optionally filtered by role
   */
  async getUsers(role?: 'student' | 'employee' | 'admin'): Promise<UserResponse[]> {
    const params = role ? { role } : {}
    const response = await api.get('/admin/users/', { params })
    return response.data.results || response.data
  },

  /**
   * Get a single user by ID
   */
  async getUser(userId: number): Promise<UserResponse> {
    const id = Number(String(userId).replace(/^:+/, ''))
    if (!Number.isInteger(id)) throw new Error('Invalid user id')
    const response = await api.get(`/admin/users/${id}/`)
    return response.data
  },

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserData): Promise<UserResponse> {
    const response = await api.post('/admin/users/', userData)
    return response.data
  },

  /**
   * Delete a user
   */
  async deleteUser(userId: number): Promise<void> {
    // sanitize userId in case it's a string like ':1' from other code
    const id = Number(String(userId).replace(/^:+/, ''))
    if (!Number.isInteger(id)) throw new Error('Invalid user id')
    await api.delete(`/admin/users/${id}/`)
  },

  /**
   * Activate a user
   */
  async activateUser(userId: number): Promise<void> {
    const id = Number(String(userId).replace(/^:+/, ''))
    if (!Number.isInteger(id)) throw new Error('Invalid user id')
    await api.post(`/admin/users/${id}/activate/`)
  },

  /**
   * Deactivate a user
   */
  async deactivateUser(userId: number): Promise<void> {
    const id = Number(String(userId).replace(/^:+/, ''))
    if (!Number.isInteger(id)) throw new Error('Invalid user id')
    await api.post(`/admin/users/${id}/deactivate/`)
  },

  /**
   * Download invoice PDF for a user
   */
  async downloadInvoice(userId: number): Promise<void> {
    const id = Number(String(userId).replace(/^:+/, ''))
    if (!Number.isInteger(id)) throw new Error('Invalid user id')
    
    try {
      const response = await api.get(`/admin/users/${id}/invoice/`, {
        responseType: 'blob',
      })
      
      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition']
      let filename = `invoice.pdf`
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
        if (filenameMatch) filename = filenameMatch[1]
      }
      
      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      throw new Error('Failed to download invoice')
    }
  },

  /**
   * Get user statistics
   */
  async getUserStatistics(): Promise<{
    total_users: number
    active_users: number
    students: number
    employees: number
    admins: number
  }> {
    const response = await api.get('/admin/users/statistics/')
    return response.data
  },
}
