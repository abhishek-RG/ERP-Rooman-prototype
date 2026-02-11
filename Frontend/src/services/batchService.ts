import api from './api'

export interface Batch {
    id: number
    course: number
    course_name: string
    faculty: number | null
    faculty_name: string
    center: string | null
    classroom: string | null
    start_date: string
    end_date: string
    days: string[]
    session_start_time: string
    session_end_time: string
    created_at?: string
}

export interface CreateBatchData {
    course: number
    faculty: number | null
    center: string | null
    classroom: string | null
    start_date: string
    end_date: string
    days: string[]
    session_start_time: string
    session_end_time: string
}

export interface Session {
    id: number
    batch_id: number
    session_date: string
    start_time: string
    end_time: string
    status: 'scheduled' | 'completed' | 'cancelled'
}

export const batchService = {
    /**
     * Get all batches
     */
    async getBatches(): Promise<Batch[]> {
        const response = await api.get('admin/batches/')
        return response.data.results || response.data
    },

    /**
     * Create a new batch
     */
    async createBatch(data: CreateBatchData): Promise<Batch> {
        const response = await api.post('admin/batches/', data)
        return response.data
    },

    /**
     * Update an existing batch
     */
    async updateBatch(id: number, data: Partial<CreateBatchData>): Promise<Batch> {
        const response = await api.put(`admin/batches/${id}/`, data)
        return response.data
    },

    /**
     * Get sessions for a specific batch
     */
    async getSessions(batchId: number): Promise<Session[]> {
        const response = await api.get(`admin/sessions/?batch_id=${batchId}`)
        return response.data.results || response.data
    }
}
