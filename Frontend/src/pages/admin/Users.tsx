import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { useEnquiryStore, Enquiry, EnquiryStatus } from '../../store/enquiryStore'

// Search Types
export type SearchFilter = 'name' | 'id' | 'phone' | 'email'

const Users = () => {
  const navigate = useNavigate()

  // Enquiry Store
  const { enquiries, addEnquiry, updateEnquiryStage } = useEnquiryStore()

  // Local UI State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilter, setSearchFilter] = useState<SearchFilter>('name')

  // Form state for new enquiry
  const [newEnquiry, setNewEnquiry] = useState({
    name: '',
    phone: '',
    email: '',
    course: '',
    source: '',
    address: '',
    notes: '',
    preferredBatch: undefined as any,
    preferredContact: undefined as any,
    budgetRange: undefined as any,
    educationLevel: undefined as any
  })

  // Filter Logic
  const filteredEnquiries = useMemo(() => {
    if (!searchQuery) return enquiries

    return enquiries.filter((enquiry) => {
      const query = searchQuery.toLowerCase()
      switch (searchFilter) {
        case 'name':
          return enquiry.name.toLowerCase().includes(query)
        case 'id':
          return enquiry.id.toLowerCase().includes(query)
        case 'phone':
          return enquiry.phone.toLowerCase().includes(query)
        case 'email':
          return enquiry.email.toLowerCase().includes(query)
        default:
          return false
      }
    })
  }, [enquiries, searchQuery, searchFilter])

  const handleAddNewEnquiry = (e: React.FormEvent) => {
    e.preventDefault()

    // Generate simple ID
    const newId = `ENQ-${String(enquiries.length + 1).padStart(3, '0')}`
    const date = new Date().toISOString().split('T')[0]

    const enquiry: Enquiry = {
      id: newId,
      ...newEnquiry,
      date,
      createdDate: date,
      stage: 'ENQUIRY',
      status: 'Cold', // Default status per spec
      followUps: []
    }

    addEnquiry(enquiry)
    setIsAddModalOpen(false)
    setNewEnquiry({
      name: '',
      phone: '',
      email: '',
      course: '',
      source: '',
      address: '',
      notes: '',
      preferredBatch: undefined as any,
      preferredContact: undefined as any,
      budgetRange: undefined as any,
      educationLevel: undefined as any
    })
    alert('Enquiry added successfully!')
  }

  const handleView = (enquiry: Enquiry) => {
    navigate(`/admin/users/details/${enquiry.id}`)
  }

  const getStatusColor = (status: EnquiryStatus) => {
    switch (status) {
      case 'Hot': return 'bg-red-100 text-red-800'
      case 'Warm': return 'bg-yellow-100 text-yellow-800'
      case 'Cold': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Layout role="admin">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Enquiry Management
          </h1>
          <div className="mt-4 sm:ml-4 sm:mt-0 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Search & Filter Group */}
            <div className="flex rounded-md shadow-sm">
              <div className="relative flex-grow focus-within:z-10">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 min-w-[200px]"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative -ml-px">
                <select
                  className="block w-full rounded-none rounded-r-md border-0 py-1.5 pl-3 pr-9 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 bg-gray-50 hover:bg-gray-100 text-sm font-medium"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value as SearchFilter)}
                >
                  <option value="name">Name</option>
                  <option value="id">ID</option>
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                </select>
              </div>
            </div>

            <Button onClick={() => setIsAddModalOpen(true)} className="whitespace-nowrap">
              + Add Enquiry
            </Button>
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone / Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{enquiry.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{enquiry.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{enquiry.phone}</div>
                      <div className="text-xs text-gray-400">{enquiry.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enquiry.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enquiry.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleView(enquiry)}
                          className="text-primary-600 hover:text-primary-900 font-medium hover:underline"
                        >
                          View
                        </button>
                        {enquiry.stage === 'ENQUIRY' && (
                          <button
                            onClick={() => updateEnquiryStage(enquiry.id, 'LEAD')}
                            className="ml-2 inline-flex items-center px-3 py-1 rounded-md bg-blue-600 text-white text-sm"
                          >
                            Start Follow-up
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredEnquiries.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                      No enquiries found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        

        {/* Add New Enquiry Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Enquiry"
        >
          <form onSubmit={handleAddNewEnquiry} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <Input
                id="name"
                required
                value={newEnquiry.name}
                onChange={e => setNewEnquiry({ ...newEnquiry, name: e.target.value })}
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Input
                  id="phone"
                  required
                  value={newEnquiry.phone}
                  onChange={e => setNewEnquiry({ ...newEnquiry, phone: e.target.value })}
                  placeholder="+91..."
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  value={newEnquiry.email}
                  onChange={e => setNewEnquiry({ ...newEnquiry, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700">Interested Course</label>
                <select
                  id="course"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
                  value={newEnquiry.course}
                  onChange={e => setNewEnquiry({ ...newEnquiry, course: e.target.value })}
                >
                  <option value="">Select a course</option>
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                </select>
              </div>
              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700">Source</label>
                <select
                  id="source"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
                  value={newEnquiry.source}
                  onChange={e => setNewEnquiry({ ...newEnquiry, source: e.target.value })}
                >
                  <option value="">Select source</option>
                  <option value="Website">Website</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Referral">Referral</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Batch</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 p-2"
                  value={newEnquiry.preferredBatch}
                  onChange={e => setNewEnquiry({ ...newEnquiry, preferredBatch: e.target.value })}
                >
                  <option value="">Select batch</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Weekend">Weekend</option>
                  <option value="Any">Any</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Contact</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 p-2"
                  value={newEnquiry.preferredContact}
                  onChange={e => setNewEnquiry({ ...newEnquiry, preferredContact: e.target.value })}
                >
                  <option value="">Contact method</option>
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                <select value={newEnquiry.budgetRange} onChange={e => setNewEnquiry({ ...newEnquiry, budgetRange: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2">
                  <option value="">Select budget</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Not Specified">Not Specified</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Education Level</label>
                <select value={newEnquiry.educationLevel} onChange={e => setNewEnquiry({ ...newEnquiry, educationLevel: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 p-2">
                  <option value="">Select education</option>
                  <option value="High School">High School</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                id="address"
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
                value={newEnquiry.address}
                onChange={e => setNewEnquiry({ ...newEnquiry, address: e.target.value })}
                placeholder="Enter full address"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes / Remarks</label>
              <textarea
                id="notes"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
                value={newEnquiry.notes}
                onChange={e => setNewEnquiry({ ...newEnquiry, notes: e.target.value })}
                placeholder="Any specific requirements or comments..."
              />
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <Button type="submit" className="w-full sm:col-start-2">
                Save Enquiry
              </Button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  )
}

export default Users
