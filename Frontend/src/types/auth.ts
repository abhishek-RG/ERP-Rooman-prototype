export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: 'student' | 'admin' | 'employee'
  phone_number?: string
  profile_picture?: string
  date_of_birth?: string
  address?: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface AuthResponse {
  user: User
  access: string
  refresh: string
  message: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  password2: string
  first_name: string
  last_name: string
  role: 'student' | 'admin' | 'employee'
  phone_number?: string
  date_of_birth?: string
  address?: string
}
