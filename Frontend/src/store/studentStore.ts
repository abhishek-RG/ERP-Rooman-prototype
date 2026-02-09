import { create } from 'zustand'

export interface Student {
    id: string
    name: string
    email: string
    phone: string
    course: string
    enrollmentDate: string
    status: 'Active' | 'Inactive'
}

interface StudentStore {
    students: Student[]
    addStudent: (student: Omit<Student, 'id' | 'status' | 'enrollmentDate'>) => void
    setStudents: (students: Student[]) => void
}

// Initial Mock Data for Students
const INITIAL_STUDENTS: Student[] = [
    {
        id: 'STU-2023-001',
        name: 'Alice Williams',
        email: 'alice.w@example.com',
        phone: '+91 9876543210',
        course: 'UI/UX Design',
        enrollmentDate: '2023-09-15',
        status: 'Active'
    },
    {
        id: 'STU-2023-002',
        name: 'Bob Brown',
        email: 'bob.b@example.com',
        phone: '+91 9876543210',
        course: 'Python Development',
        enrollmentDate: '2023-09-20',
        status: 'Active'
    }
]

export const useStudentStore = create<StudentStore>((set) => ({
    students: INITIAL_STUDENTS,
    addStudent: (studentData) => set((state) => {
        const newStudent: Student = {
            id: `STU-${new Date().getFullYear()}-${String(state.students.length + 1).padStart(3, '0')}`,
            ...studentData,
            enrollmentDate: new Date().toISOString().split('T')[0],
            status: 'Active'
        }
        return { students: [newStudent, ...state.students] }
    }),
    setStudents: (students) => set({ students })
}))
