import { create } from 'zustand'
import { enquiryAPI } from '../services/api'

export type EnquiryStatus = 'Cold' | 'Warm' | 'Hot'
export type EnquiryStage = 'ENQUIRY' | 'LEAD' | 'CONVERTED'
export type StudentStatus = 'Student' | 'Employed' | 'Unemployed' | 'Self Employed'

export interface FollowUp {
    date: string
    notes: string
    outcome: 'Connected' | 'No Response' | 'Call Back'
    nextFollowUp?: string
}

export interface Enquiry {
    id: string | number
    name: string
    phone: string
    email: string
    course?: string
    date?: string
    createdDate?: string
    stage?: EnquiryStage
    status?: EnquiryStatus
    address?: string
    notes?: string
    source?: string
    followUps?: FollowUp[]
    history?: {
        date: string
        note: string
    }[]
    // Additional backend fields
    center?: string
    country?: string
    gender?: string
    computer?: string
    state?: string
    city?: string
    knowledge?: string
    qualification?: string
    studentStatus?: StudentStatus
    mobile_number?: string
    designation?: string
    total_work_experience?: string
    reason_for_enquiry?: string
    lead_status?: string
    preferredBatch?: 'Morning' | 'Evening' | 'Weekend' | 'Any'
    preferredContact?: 'Phone' | 'Email' | 'WhatsApp' | 'SMS'
    budgetRange?: 'Low' | 'Medium' | 'High' | 'Not Specified'
    educationLevel?: 'High School' | 'Graduate' | 'Postgraduate' | 'Other'
}

interface EnquiryStore {
    enquiries: Enquiry[]
    isLoading: boolean
    error: string | null
    addEnquiry: (enquiry: Enquiry) => Promise<void>
    updateEnquiryStatus: (id: string | number, status: EnquiryStatus) => void
    updateEnquiryStage: (id: string | number, stage: EnquiryStage) => void
    addFollowUp: (id: string | number, followUp: FollowUp) => void
    setEnquiries: (enquiries: Enquiry[]) => void
    fetchEnquiries: () => Promise<void>
    fetchEnquiry: (id: string | number) => Promise<void>
    setLoading: (isLoading: boolean) => void
    setError: (error: string | null) => void
}

const MOCK_ENQUIRIES: Enquiry[] = []

export const useEnquiryStore = create<EnquiryStore>((set) => ({
    enquiries: MOCK_ENQUIRIES,
    isLoading: false,
    error: null,

    fetchEnquiries: async () => {
        set({ isLoading: true, error: null })
        try {
            const response = await enquiryAPI.fetchEnquiries()
            const enquiries = response.data.results || []
            // Map backend data to frontend Enquiry format
            const mappedEnquiries = enquiries.map((item: any) => ({
                id: item.id,
                name: item.name,
                phone: item.mobile_number || item.phone || '',
                email: item.email || '',
                course: item.course || '',
                date: item.created_at || new Date().toISOString().split('T')[0],
                createdDate: item.created_at || new Date().toISOString().split('T')[0],
                stage: item.stage || 'ENQUIRY' as EnquiryStage,
                status: item.lead_status ? (item.lead_status.charAt(0).toUpperCase() + item.lead_status.slice(1)) as EnquiryStatus : getStatusFromBackend(item.status) || 'Cold' as EnquiryStatus,
                lead_status: item.lead_status,
                address: item.city || item.state || '',
                notes: item.notes || '',
                source: item.source || '',
                followUps: [],
                // Backend fields
                center: item.center,
                country: item.country,
                gender: item.gender,
                computer: item.computer,
                state: item.state,
                city: item.city,
                knowledge: item.knowledge,
                qualification: item.qualification,
                studentStatus: item.status,
                mobile_number: item.mobile_number,
                designation: item.designation,
                total_work_experience: item.total_work_experience,
                reason_for_enquiry: item.reason_for_enquiry,
            }))
            set({ enquiries: mappedEnquiries, isLoading: false })
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch enquiries',
                isLoading: false
            })
            console.error('Error fetching enquiries:', error)
        }
    },

    fetchEnquiry: async (id: string | number) => {
        set({ isLoading: true, error: null })
        try {
            const response = await enquiryAPI.getEnquiry(id)
            const item = response.data
            // Map backend data to frontend Enquiry format
            const mappedEnquiry: Enquiry = {
                id: item.id,
                name: item.name,
                phone: item.mobile_number || item.phone || '',
                email: item.email || '',
                course: item.course || '',
                date: item.created_at || new Date().toISOString().split('T')[0],
                createdDate: item.created_at || new Date().toISOString().split('T')[0],
                stage: item.stage || 'ENQUIRY' as EnquiryStage,
                status: item.lead_status ? (item.lead_status.charAt(0).toUpperCase() + item.lead_status.slice(1)) as EnquiryStatus : getStatusFromBackend(item.status) || 'Cold' as EnquiryStatus,
                lead_status: item.lead_status,
                address: item.city || item.state || '',
                notes: item.notes || '',
                source: item.enquiry_type || '',
                followUps: [],
                // Backend fields
                center: item.center,
                country: item.country,
                gender: item.gender,
                computer: item.computer_knowledge,
                state: item.state,
                city: item.city,
                knowledge: item.computer_knowledge,
                qualification: item.qualification,
                studentStatus: item.status,
                mobile_number: item.mobile_number,
                designation: item.designation,
                total_work_experience: item.total_work_experience,
            }

            // Update or add the enquiry to the list
            set((state) => {
                const existingIndex = state.enquiries.findIndex(e => e.id === mappedEnquiry.id)
                if (existingIndex >= 0) {
                    const updated = [...state.enquiries]
                    updated[existingIndex] = mappedEnquiry
                    return { enquiries: updated, isLoading: false }
                } else {
                    return { enquiries: [...state.enquiries, mappedEnquiry], isLoading: false }
                }
            })
        } catch (error: any) {
            set({
                error: error.message || 'Failed to fetch enquiry',
                isLoading: false
            })
            console.error('Error fetching enquiry:', error)
        }
    },

    addEnquiry: async (enquiry) => {
        try {
            const response = await enquiryAPI.addEnquiry(enquiry)
            set((state) => ({
                enquiries: [response.data, ...state.enquiries]
            }))
        } catch (error) {
            console.error('Error adding enquiry:', error)
            throw error
        }
    },

    updateEnquiryStatus: async (id, status) => {
        try {
            const lead_status = status.toLowerCase() as 'cold' | 'warm' | 'hot'
            // Update status
            await enquiryAPI.updateStatus(id, lead_status)
            // Also promote to LEAD stage if not already
            await enquiryAPI.updateStage(id, 'LEAD')

            set((state) => ({
                enquiries: state.enquiries.map((enq) =>
                    String(enq.id) === String(id) ? { ...enq, status, lead_status, stage: 'LEAD' as const } : enq
                )
            }))
        } catch (error) {
            console.error('Error updating enquiry status:', error)
        }
    },

    updateEnquiryStage: async (id, stage) => {
        try {
            const response = await enquiryAPI.updateStage(id, stage)
            set((state) => ({
                enquiries: state.enquiries.map((enq) =>
                    String(enq.id) === String(id) ? { ...enq, stage } : enq
                )
            }))
        } catch (error) {
            console.error('Error updating enquiry stage:', error)
        }
    },

    addFollowUp: async (id, followUp) => {
        try {
            // Map outcome to backend format
            const outcomeMap: any = {
                'Connected': 'connected',
                'No Response': 'no_response',
                'Call Back': 'call_back'
            }

            const followUpData = {
                date: followUp.date,
                notes: followUp.notes,
                outcome: outcomeMap[followUp.outcome] || followUp.outcome.toLowerCase().replace(' ', '_'),
                next_follow_up_date: followUp.nextFollowUp || null
            }

            await enquiryAPI.addFollowUp(id, followUpData)

            // Update local state
            set((state) => ({
                enquiries: state.enquiries.map((enq) =>
                    String(enq.id) === String(id)
                        ? { ...enq, followUps: [...(enq.followUps || []), followUp] }
                        : enq
                )
            }))
        } catch (error) {
            console.error('Error adding follow-up:', error)
            throw error
        }
    },

    setEnquiries: (enquiries) => set({ enquiries }),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error })
}))

// Helper function to map backend status to frontend status
function getStatusFromBackend(backendStatus?: string): EnquiryStatus | null {
    if (!backendStatus) return null
    const lowerStatus = backendStatus.toLowerCase()
    if (lowerStatus.includes('hot')) return 'Hot'
    if (lowerStatus.includes('warm')) return 'Warm'
    if (lowerStatus.includes('cold')) return 'Cold'
    return 'Cold'
}
