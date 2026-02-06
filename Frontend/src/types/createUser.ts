export interface CreateUserData {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
  role: 'student' | 'employee'
  phone_number?: string
  // Student-specific fields
  student_id?: string
  center?: string
  enrollment_date?: string
  course?: string
  guardian_name?: string
  guardian_contact?: string
  emergency_contact?: string
  // Employee-specific fields
  employee_id?: string
  designation?: string
  department?: string
  join_date?: string
  salary?: string
  employment_type?: string
}
