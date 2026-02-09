import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = response.data
        localStorage.setItem('access_token', access)

        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh token is invalid, logout user
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
// Enquiry/Lead APIs
export const enquiryAPI = {
  fetchEnquiries: (params?: { page?: number; search?: string }) =>
    api.get('/admin/enquiry/', { params }),
  getEnquiry: (id: string | number) => api.get(`/admin/enquiry/${id}/`),
  addEnquiry: (data: any) => api.post('/admin/enquiry/', data),
  updateStatus: (id: string | number, lead_status: string) =>
    api.patch(`/admin/enquiry/${id}/update-status/`, { lead_status }),
  updateStage: (id: number | string, stage: string) => {
    return api.patch(`/admin/enquiry/${id}/update-stage/`, { new_stage: stage })
  },
  addFollowUp: (enquiryId: number | string, followUpData: any) => {
    return api.post(`/admin/enquiry/${enquiryId}/add-followup/`, followUpData)
  },
  getFollowUps: (enquiryId: number | string) => {
    return api.get(`/admin/enquiry/${enquiryId}/followups/`)
  },
  sendEmail: (emailData: { to_email: string, subject: string, message: string }) => {
    return api.post('/admin/enquiry/send-email/', emailData)
  }
}

export const leadAPI = {
  fetchLeads: (params?: { page?: number; status?: string }) =>
    api.get('/admin/leads/', { params }),
}