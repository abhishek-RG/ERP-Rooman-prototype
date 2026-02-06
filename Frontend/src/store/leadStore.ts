import { create } from 'zustand'

export type LeadStage = 'Enquiry' | 'Cold' | 'Warm' | 'Hot' | 'Converted'

export interface Lead {
  id: string
  name: string
  phone: string
  email: string
  course: string
  date: string
  stage: LeadStage
  address: string
  notes: string
  source: string
  lastFollowUp?: string
  history: {
    date: string
    note: string
  }[]
}

interface LeadStore {
  leads: Lead[]
  setLeads: (leads: Lead[]) => void
  updateLeadStage: (id: string, stage: LeadStage) => void
  fetchLeads: () => Promise<Lead[]>
}

const MOCK_LEADS: Lead[] = [
  {
    id: 'ENQ-001',
    name: 'John Doe',
    phone: '+91 9876543210',
    email: 'john.doe@example.com',
    course: 'Full Stack Development',
    date: '2023-10-25',
    stage: 'Warm',
    address: '123 Main Street, Bangalore,India',
    notes: 'Interested in weekend batches.',
    source: 'Website',
    lastFollowUp: '2023-11-02',
    history: [
      { date: '2023-10-25', note: 'Initial inquiry via website.' },
      { date: '2023-10-26', note: 'Sent course brochure.' },
    ],
  },
  {
    id: 'ENQ-002',
    name: 'Jane Smith',
    phone: '+91 879768590',
    email: 'jane.smith@example.com',
    course: 'Data Science',
    date: '2023-10-28',
    stage: 'Hot',
    address: '4th block Jayanagar, Bangalore,India',
    notes: 'Looking for job placement assistance. Urgent.',
    source: 'Referral',
    lastFollowUp: '2023-10-30',
    history: [
      { date: '2023-10-28', note: 'Visited campus.' },
    ],
  },
  {
    id: 'ENQ-003',
    name: 'Mike Johnson',
    phone: '+91 7889067890',
    email: 'mike.j@example.com',
    course: 'Cyber Security',
    date: '2023-11-01',
    stage: 'Cold',
    address: ' Mangalore ,India',
    notes: 'Just checking prices.',
    source: 'Social Media',
    lastFollowUp: '2023-11-02',
    history: [
      { date: '2023-11-01', note: 'Message on Instagram.' },
    ],
  },
  {
    id: 'ENQ-004',
    name: 'Alice Walker',
    phone: '+91 7000000000',
    email: 'alice@example.com',
    course: 'UI/UX Design',
    date: '2024-01-15',
    stage: 'Enquiry',
    address: 'Mumbai, India',
    notes: 'Asked about scholarship options.',
    source: 'Website',
    history: [{ date: '2024-01-15', note: 'Initial enquiry form.' }],
  },
]

export const useLeadStore = create<LeadStore>((set) => ({
  leads: MOCK_LEADS,
  setLeads: (leads) => set({ leads }),
  updateLeadStage: (id, stage) => set((state) => ({
    leads: state.leads.map((l) => l.id === id ? { ...l, stage } : l)
  })),
  fetchLeads: async () => {
    // placeholder for API call
    return new Promise<Lead[]>((resolve) => setTimeout(() => resolve(MOCK_LEADS), 200))
  }
}))

// API-ready placeholder functions
export const fetchEnquiries = async () => {
  const store = useLeadStore.getState()
  return store.fetchLeads()
}

export const updateStage = async (id: string, stage: LeadStage) => {
  const store = useLeadStore.getState()
  store.updateLeadStage(id, stage)
  return Promise.resolve()
}
