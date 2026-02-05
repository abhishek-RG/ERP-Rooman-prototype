export interface AdminProfile {
  id: number
  user: number
  admin_id: string
  designation: string
  department: string
  join_date: string
  permissions: Record<string, any>
  created_at: string
  updated_at: string
}

export interface SystemSettings {
  id: number
  setting_key: string
  setting_value: string
  description?: string
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: number
  user: number
  action: string
  model_name: string
  object_id: number
  changes: Record<string, any>
  ip_address?: string
  timestamp: string
}

export interface Notification {
  id: number
  user: number
  title: string
  message: string
  notification_type: 'info' | 'warning' | 'error' | 'success'
  is_read: boolean
  created_at: string
}

export interface Report {
  id: number
  report_name: string
  report_type: 'student' | 'employee' | 'attendance' | 'financial' | 'academic'
  generated_by: number
  file_path?: string
  parameters: Record<string, any>
  created_at: string
}
