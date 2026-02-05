export interface Employee {
  id: number
  user: number
  employee_id: string
  designation: string
  department: string
  join_date: string
  salary: number
  employment_type: 'full-time' | 'part-time' | 'contract'
  blood_group?: string
  emergency_contact: string
  created_at: string
  updated_at: string
}

export interface EmployeeAttendance {
  id: number
  employee: number
  date: string
  check_in: string
  check_out?: string
  status: 'present' | 'absent' | 'half-day' | 'leave'
  remarks?: string
  created_at: string
}

export interface LeaveRequest {
  id: number
  employee: number
  leave_type: 'sick' | 'casual' | 'earned' | 'maternity' | 'paternity'
  start_date: string
  end_date: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  approved_by?: number
  remarks?: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: number
  assigned_to: number
  assigned_by: number
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  due_date: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface Payroll {
  id: number
  employee: number
  month: number
  year: number
  basic_salary: number
  allowances: number
  deductions: number
  net_salary: number
  payment_date?: string
  payment_status: 'pending' | 'processed' | 'paid'
  created_at: string
}

export interface Performance {
  id: number
  employee: number
  reviewed_by: number
  review_period_start: string
  review_period_end: string
  rating: number
  strengths: string
  areas_of_improvement: string
  comments?: string
  created_at: string
}
