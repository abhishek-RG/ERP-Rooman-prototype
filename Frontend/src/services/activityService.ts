import api from './api'
import { Activity, CreateActivityData } from '../types/activity'

export const activityService = {
  /**
   * Get all activities (with pagination and filters)
   */
  async getActivities(
    page?: number,
    search?: string,
    status?: string,
    priority?: string,
    ordering?: string
  ): Promise<{ count: number; results: Activity[] }> {
    const params = new URLSearchParams()
    if (page) params.append('page', page.toString())
    if (search) params.append('search', search)
    if (status) params.append('status', status)
    if (priority) params.append('priority', priority)
    if (ordering) params.append('ordering', ordering)

    const response = await api.get<{ count: number; results: Activity[] }>(
      `/activities/?${params.toString()}`
    )
    return response.data
  },

  /**
   * Get activity by ID
   */
  async getActivityById(id: number): Promise<Activity> {
    const response = await api.get<Activity>(`/activities/${id}/`)
    return response.data
  },

  /**
   * Create a new activity
   */
  async createActivity(data: CreateActivityData): Promise<{ data: Activity; message: string }> {
    const response = await api.post<{ data: Activity; message: string }>(
      '/activities/',
      data
    )
    return response.data
  },

  /**
   * Update an existing activity
   */
  async updateActivity(
    id: number,
    data: Partial<CreateActivityData>
  ): Promise<{ data: Activity; message: string }> {
    // Use PATCH for partial updates (employees will update `status` only)
    const response = await api.patch<{ data: Activity; message: string }>(
      `/activities/${id}/`,
      data
    )
    return response.data
  },

  /**
   * Delete an activity
   */
  async deleteActivity(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/activities/${id}/`)
    return response.data
  },

  /**
   * Get activities for the current user
   */
  async getMyActivities(): Promise<{ count: number; results: Activity[] }> {
    const response = await api.get<{ count: number; results: Activity[] }>(
      '/activities/my-activities/'
    )
    return response.data
  },

  /**
   * Get activities by date range
   */
  async getActivitiesByDateRange(
    startDate: string,
    endDate: string
  ): Promise<{ count: number; results: Activity[] }> {
    const response = await api.get<{ count: number; results: Activity[] }>(
      `/activities/by-date/?start_date=${startDate}&end_date=${endDate}`
    )
    return response.data
  },

  /**
   * Get activities by status
   */
  async getActivitiesByStatus(status: string): Promise<{ count: number; results: Activity[] }> {
    const response = await api.get<{ count: number; results: Activity[] }>(
      `/activities/by-status/?status=${status}`
    )
    return response.data
  },

  /**
   * Get activities by priority
   */
  async getActivitiesByPriority(priority: string): Promise<{ count: number; results: Activity[] }> {
    const response = await api.get<{ count: number; results: Activity[] }>(
      `/activities/by-priority/?priority=${priority}`
    )
    return response.data
  },
}
