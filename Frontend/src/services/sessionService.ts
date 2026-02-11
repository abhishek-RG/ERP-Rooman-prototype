import api from './api'
import { Batch } from './batchService'

export interface Session {
    id: number
    batch: number
    batch_details: Batch
    session_date: string
    start_time: string
    end_time: string
    conducted_date: string | null
    conducted_start_time: string | null
    conducted_end_time: string | null
    content_covered: string | null
    status: 'scheduled' | 'conducted' | 'cancelled' | 'rescheduled'
    created_at: string
}

export interface SessionAttendance {
    id: number
    session: number
    student: number
    student_name: string
    student_id_code: string
    status: 'present' | 'absent' | 'late' | 'excused'
    remarks: string | null
}

export const sessionService = {
    getSessions: async (batchId?: number) => {
        const response = await api.get('admin/sessions/', {
            params: { batch_id: batchId }
        })
        return response.data.results || response.data
    },

    getSession: async (id: number) => {
        const response = await api.get<Session>(`admin/sessions/${id}/`)
        return response.data
    },

    updateSession: async (id: number, data: Partial<Session>) => {
        const response = await api.patch<Session>(`admin/sessions/${id}/`, data)
        return response.data
    },

    getAttendance: async (sessionId: number) => {
        const response = await api.get('admin/session-attendance/', {
            params: { session_id: sessionId }
        })
        return response.data.results || response.data
    },

    initializeAttendance: async (sessionId: number) => {
        const response = await api.post<SessionAttendance[]>('admin/session-attendance/initialize/', {
            session_id: sessionId
        })
        return response.data
    },

    updateAttendance: async (attendanceId: number, data: Partial<SessionAttendance>) => {
        const response = await api.patch<SessionAttendance>(`admin/session-attendance/${attendanceId}/`, data)
        return response.data
    },

    bulkUpdateAttendance: async (attendanceData: { id: number, status: string, remarks?: string }[]) => {
        // Since we don't have a bulk update endpoint, we'll do it sequentially or add one late
        // For now, let's assume we update one by one or create a custom action
        const promises = attendanceData.map(item =>
            api.patch(`admin/session-attendance/${item.id}/`, item)
        )
        return Promise.all(promises)
    }
}
