export interface Activity {
  id: number
  executive: number
  executive_details: {
    id: number
    username: string
    first_name: string
    last_name: string
    email: string
  }
  activity_type: string
  activity_type_display: string
  activity_description: string
  activity_date: string // YYYY-MM-DD
  start_time_hour: number | null
  start_time_minute: number | null
  duration_hour: number | null
  duration_minute: number | null
  priority: string
  priority_display: string
  person_to_contact: string | null
  phone_1: string | null
  phone_2: string | null
  venue: string | null
  status: string
  status_display: string
  feedback: string | null
  remarks: string | null
  created_at: string
  updated_at: string
}

export interface CreateActivityData {
  executive?: number
  activity_type: string
  activity_description: string
  activity_date: string
  start_time_hour?: number | null
  start_time_minute?: number | null
  duration_hour?: number | null
  duration_minute?: number | null
  priority?: string
  person_to_contact?: string | null
  phone_1?: string | null
  phone_2?: string | null
  venue?: string | null
  status?: string
  feedback?: string | null
  remarks?: string | null
}

export interface ActivityFilters {
  status?: string
  priority?: string
  start_date?: string
  end_date?: string
  search?: string
}

export const ACTIVITY_TYPE_CHOICES = [
  { value: 'office_meeting', label: 'Office Meeting (1 Day)' },
  { value: 'workshop_seminar', label: 'Workshop/Seminar Follow Up (1 Day)' },
  { value: 'enquiry_followup', label: 'Enquiry Follow Up (1 Day)' },
  { value: 'batch_commencement', label: 'Batch Commencement Follow Up (1 Day)' },
  { value: 'fee_followup', label: 'Fee Follow-up (1 Day)' },
  { value: 'urgent_task', label: 'Urgent Task (12 hrs)' },
  { value: 'house_visit', label: 'House Visit (2 Days)' },
  { value: 'lab_problem', label: 'Lab Problem (1 Day)' },
  { value: 'request_suggestion', label: 'Request / Suggestion (1 Day)' },
  { value: 'normal_task', label: 'Normal Task (2 Days)' },
  { value: 'student_info', label: 'Student Information (1 Day)' },
  { value: 'student_request', label: 'Student Request (1 Day)' },
  { value: 'student_feedback', label: 'Student Feedback (1 Day)' },
  { value: 'student_suggestion', label: 'Student Suggestion (1 Day)' },
  { value: 'student_complaint', label: 'Student Complaint (1 Day)' },
]

export const PRIORITY_CHOICES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

export const STATUS_CHOICES = [
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'pending', label: 'Pending' },
]
