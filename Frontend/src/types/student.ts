export interface Student {
  id: number
  user: number
  student_id: string
  enrollment_date: string
  department: string
  semester: number
  blood_group?: string
  guardian_name: string
  guardian_contact: string
  emergency_contact: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: number
  course_code: string
  course_name: string
  credits: number
  department: string
  semester: number
  description?: string
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: number
  student: number
  course: number
  enrollment_date: string
  status: 'active' | 'completed' | 'dropped'
}

export interface Attendance {
  id: number
  student: number
  course: number
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  remarks?: string
  created_at: string
}

export interface Assignment {
  id: number
  course: number
  title: string
  description: string
  due_date: string
  total_marks: number
  created_at: string
  updated_at: string
}

export interface AssignmentSubmission {
  id: number
  assignment: number
  student: number
  submission_file: string
  submitted_at: string
  marks_obtained?: number
  feedback?: string
}

export interface Grade {
  id: number
  student: number
  course: number
  semester: number
  grade: string
  grade_points: number
  remarks?: string
  created_at: string
}
