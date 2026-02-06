import { create } from 'zustand'

export type EnquiryStatus = 'Cold' | 'Warm' | 'Hot'
export type EnquiryStage = 'ENQUIRY' | 'LEAD' | 'CONVERTED'

export interface FollowUp {
    date: string
    notes: string
    outcome: 'Connected' | 'No Response' | 'Call Back'
    nextFollowUp?: string
}

export interface Enquiry {
    id: string
    name: string
    phone: string
    email: string
    course: string
    // legacy `date` remains for compatibility; prefer `createdDate`
    date: string
    createdDate: string
    stage: EnquiryStage
    status: EnquiryStatus
    address: string
    notes: string
    source: string
    // follow-up history
    followUps: FollowUp[]
    // keep old history for compatibility (optional)
    history?: {
        date: string
        note: string
    }[]
    // sales fields often captured by sales reps
    preferredBatch?: 'Morning' | 'Evening' | 'Weekend' | 'Any'
    preferredContact?: 'Phone' | 'Email' | 'WhatsApp' | 'SMS'
    budgetRange?: 'Low' | 'Medium' | 'High' | 'Not Specified'
    educationLevel?: 'High School' | 'Graduate' | 'Postgraduate' | 'Other'
}

interface EnquiryStore {
    enquiries: Enquiry[]
    addEnquiry: (enquiry: Enquiry) => void
    updateEnquiryStatus: (id: string, status: EnquiryStatus) => void
    updateEnquiryStage: (id: string, stage: EnquiryStage) => void
    addFollowUp: (id: string, followUp: FollowUp) => void
    setEnquiries: (enquiries: Enquiry[]) => void
}

const MOCK_ENQUIRIES: Enquiry[] = [
    {
        id: 'ENQ-001',
        name: 'John Doe',
        phone: '+91 9876543210',
        email: 'john.doe@example.com',
        course: 'Full Stack Development',
        date: '2023-10-25',
        createdDate: '2023-10-25',
        stage: 'LEAD',
        status: 'Warm',
        address: '123 Main Street, Bangalore,India',
        notes: 'Interested in weekend batches.',
        source: 'Website',
        followUps: [
            { date: '2023-10-25', notes: 'Initial inquiry via website.', outcome: 'Connected' },
            { date: '2023-10-26', notes: 'Sent course brochure.', outcome: 'No Response' },
        ],
        preferredBatch: 'Weekend',
        preferredContact: 'Phone',
        budgetRange: 'Medium',
        educationLevel: 'Graduate',
    },
    {
        id: 'ENQ-002',
        name: 'Jane Smith',
        phone: '+91 879768590',
        email: 'jane.smith@example.com',
        course: 'Data Science',
        date: '2023-10-28',
        createdDate: '2023-10-28',
        stage: 'LEAD',
        status: 'Hot',
        address: '4th block Jayanagar, Bangalore,India',
        notes: 'Looking for job placement assistance. Urgent.',
        source: 'Referral',
        followUps: [
            { date: '2023-10-28', notes: 'Visited campus.', outcome: 'Connected' },
        ],
        preferredBatch: 'Morning',
        preferredContact: 'Email',
        budgetRange: 'High',
        educationLevel: 'Postgraduate',
    },
    {
        id: 'ENQ-003',
        name: 'Mike Johnson',
        phone: '+91 7889067890',
        email: 'mike.j@example.com',
        course: 'Cyber Security',
        date: '2023-11-01',
        createdDate: '2023-11-01',
        stage: 'ENQUIRY',
        status: 'Cold',
        address: ' Mangalore ,India',
        notes: 'Just checking prices.',
        source: 'Social Media',
        followUps: [
            { date: '2023-11-01', notes: 'Message on Instagram.', outcome: 'No Response' },
        ],
        preferredBatch: 'Any',
        preferredContact: 'WhatsApp',
        budgetRange: 'Low',
        educationLevel: 'High School',
    },
]

export const useEnquiryStore = create<EnquiryStore>((set) => ({
    enquiries: MOCK_ENQUIRIES,
    addEnquiry: (enquiry) => set((state) => ({
        enquiries: [{ ...enquiry }, ...state.enquiries]
    })),
    updateEnquiryStatus: (id, status) => set((state) => ({
        enquiries: state.enquiries.map((enq) =>
            enq.id === id ? { ...enq, status } : enq
        )
    })),
    updateEnquiryStage: (id, stage) => set((state) => ({
        enquiries: state.enquiries.map((enq) =>
            enq.id === id ? { ...enq, stage } : enq
        )
    })),
    addFollowUp: (id, followUp) => set((state) => ({
        enquiries: state.enquiries.map((enq) =>
            enq.id === id ? { ...enq, followUps: [...enq.followUps, followUp], status: enq.status } : enq
        )
    })),
    setEnquiries: (enquiries) => set({ enquiries })
}))
