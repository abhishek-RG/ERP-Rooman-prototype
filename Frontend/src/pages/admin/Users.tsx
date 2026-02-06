import { useState, useMemo, useEffect } from 'react'
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
  const { enquiries, addEnquiry, updateEnquiryStage, isLoading, error, fetchEnquiries } = useEnquiryStore()

  // Local UI State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'enquiries' | 'leads'>('enquiries')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilter, setSearchFilter] = useState<SearchFilter>('name')

  // Form state for Add Enquiry modal
  const [newEnquiry, setNewEnquiry] = useState({
    name: '',
    center: '',
    enquiry_type: '',
    gender: '',
    computer_knowledge: '',
    qualification: '',
    status: 'student',
    organisation_name: '',
    designation: '',
    total_work_experience: '',
    reason_for_enquiry: '',
    course: '',
    mobile_number: '',
    email: '',
    country: 'India',
    state: '',
    city: ''
  })

  // Fetch enquiries on component mount
  useEffect(() => {
    fetchEnquiries()
  }, [fetchEnquiries])

  // Filter Logic - Enquiries
  const filteredEnquiries = useMemo(() => {
    if (!searchQuery) return enquiries

    return enquiries.filter((enquiry) => {
      const query = searchQuery.toLowerCase()
      switch (searchFilter) {
        case 'name':
          return enquiry.name.toLowerCase().includes(query)
        case 'id':
          return String(enquiry.id).toLowerCase().includes(query)
        case 'phone':
          return (enquiry.phone || enquiry.mobile_number || '').toLowerCase().includes(query)
        case 'email':
          return (enquiry.email || '').toLowerCase().includes(query)
        default:
          return false
      }
    })
  }, [enquiries, searchQuery, searchFilter])

  // Filter Logic - Leads (enquiries with lead_status set)
  const leads = useMemo(() => {
    return enquiries.filter(enq => enq.lead_status || enq.status === 'Cold' || enq.status === 'Warm' || enq.status === 'Hot')
  }, [enquiries])

  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads

    return leads.filter((lead) => {
      const query = searchQuery.toLowerCase()
      switch (searchFilter) {
        case 'name':
          return lead.name.toLowerCase().includes(query)
        case 'id':
          return String(lead.id).toLowerCase().includes(query)
        case 'phone':
          return (lead.phone || lead.mobile_number || '').toLowerCase().includes(query)
        case 'email':
          return (lead.email || '').toLowerCase().includes(query)
        default:
          return false
      }
    })
  }, [leads, searchQuery, searchFilter])

  const handleAddNewEnquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addEnquiry(newEnquiry as any)
      await fetchEnquiries() // Refresh the list
      setNewEnquiry({
        name: '',
        center: '',
        enquiry_type: '',
        gender: '',
        computer_knowledge: '',
        qualification: '',
        status: 'student',
        organisation_name: '',
        designation: '',
        total_work_experience: '',
        reason_for_enquiry: '',
        course: '',
        mobile_number: '',
        email: '',
        country: 'India',
        state: '',
        city: ''
      })
      setIsAddModalOpen(false)
      alert('Enquiry added successfully!')
    } catch (error) {
      console.error('Error adding enquiry:', error)
      alert('Failed to add enquiry. Please try again.')
    }
  }

  const getStatusColor = (status?: EnquiryStatus) => {
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
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Loading enquiries...</p>
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <div className="p-6 bg-red-50 border border-red-200 rounded">
              <p className="text-red-800 font-medium">Error: {error}</p>
              <Button onClick={() => fetchEnquiries()} className="mt-3 bg-red-600 text-white">
                Retry
              </Button>
            </div>
          </Card>
        )}

        {/* Tabs */}
        {!isLoading && !error && (
          <>
            <div className="border-b border-gray-200 mb-6">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'enquiries'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Enquiries ({enquiries.length})
                </button>
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'leads'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Leads ({leads.length})
                </button>
              </div>
            </div>

            {/* Enquiries Tab */}
            {activeTab === 'enquiries' && (
              <Card>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEnquiries.map((enquiry) => (
                        <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{enquiry.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enquiry.phone || enquiry.mobile_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enquiry.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enquiry.city}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enquiry.qualification}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => navigate(`/admin/users/details/${enquiry.id}`)}
                              className="text-primary-600 hover:text-primary-900 font-medium hover:underline"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredEnquiries.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                            No enquiries found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Leads Tab */}
            {activeTab === 'leads' && (
              <Card>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.phone || lead.mobile_number}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                              {lead.status || 'Cold'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.city}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.total_work_experience || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => navigate(`/admin/users/details/${lead.id}`)}
                              className="text-primary-600 hover:text-primary-900 font-medium hover:underline"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredLeads.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                            No leads found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </>
        )}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Enquiry"
        >
          <form onSubmit={handleAddNewEnquiry} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Basic Details */}
            <div className="grid grid-cols-2 gap-4">
              <Input label="Name *" name="name" value={newEnquiry.name} onChange={(e) => setNewEnquiry({ ...newEnquiry, name: e.target.value })} required fullWidth />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Center *</label>
                <select name="center" value={newEnquiry.center} onChange={(e) => setNewEnquiry({ ...newEnquiry, center: e.target.value })} required className="block w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select</option>
                  <option value="all">All Centers</option>
                  <option value="TC016371">Electronic City PMKK</option>
                  <option value="123">Rajajinagar</option>
                  <option value="RON">Rooman Online</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select name="enquiry_type" value={newEnquiry.enquiry_type} onChange={(e) => setNewEnquiry({ ...newEnquiry, enquiry_type: e.target.value })} required className="block w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select</option>
                  <option value="online_registration">Online Registration</option>
                  <option value="walk_in">Walk-in</option>
                  <option value="email">Email</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select name="gender" value={newEnquiry.gender} onChange={(e) => setNewEnquiry({ ...newEnquiry, gender: e.target.value })} required className="block w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Computer Knowledge</label>
                <select name="computer_knowledge" value={newEnquiry.computer_knowledge} onChange={(e) => setNewEnquiry({ ...newEnquiry, computer_knowledge: e.target.value })} className="block w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <Input label="Qualification *" name="qualification" value={newEnquiry.qualification} onChange={(e) => setNewEnquiry({ ...newEnquiry, qualification: e.target.value })} required fullWidth />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Enquiry</label>
                <select name="reason_for_enquiry" value={newEnquiry.reason_for_enquiry} onChange={(e) => setNewEnquiry({ ...newEnquiry, reason_for_enquiry: e.target.value })} className="block w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select</option>
                  <option value="for_knowledge">For knowledge</option>
                  <option value="internship_or_project">Internship/Project</option>
                  <option value="upskilling">Upskilling</option>
                  <option value="placements">Placements</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select name="course" value={newEnquiry.course} onChange={(e) => setNewEnquiry({ ...newEnquiry, course: e.target.value })} className="block w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="">Select</option>
                  <option value="advanced_java_005">Advanced Java (005)</option>
                  <option value="full_stack_development_python_26">Full Stack Development – Python (26)</option>
                  <option value="data_science_ai_28">Data Science & AI (28)</option>
                  <option value="cyber_security_10">Cyber Security (10)</option>
                  <option value="aws_012">AWS (012)</option>
                </select>
              </div>
            </div>

            {/* Professional Details */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Professional Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select name="status" value={newEnquiry.status} onChange={(e) => setNewEnquiry({ ...newEnquiry, status: e.target.value })} required className="block w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="student">Student</option>
                    <option value="employed">Employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="self_employed">Self Employed</option>
                  </select>
                </div>
                <Input label="Organization" name="organisation_name" value={newEnquiry.organisation_name} onChange={(e) => setNewEnquiry({ ...newEnquiry, organisation_name: e.target.value })} fullWidth />
                <Input label="Designation" name="designation" value={newEnquiry.designation} onChange={(e) => setNewEnquiry({ ...newEnquiry, designation: e.target.value })} fullWidth />
                <Input label="Work Experience" name="total_work_experience" value={newEnquiry.total_work_experience} onChange={(e) => setNewEnquiry({ ...newEnquiry, total_work_experience: e.target.value })} fullWidth />
              </div>
            </div>

            {/* Contact & Location */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Contact & Location</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Mobile *" name="mobile_number" type="tel" value={newEnquiry.mobile_number} onChange={(e) => setNewEnquiry({ ...newEnquiry, mobile_number: e.target.value })} required fullWidth />
                <Input label="Email *" name="email" type="email" value={newEnquiry.email} onChange={(e) => setNewEnquiry({ ...newEnquiry, email: e.target.value })} required fullWidth />
                <Input label="Country" name="country" value={newEnquiry.country} onChange={(e) => setNewEnquiry({ ...newEnquiry, country: e.target.value })} fullWidth />
                <Input label="State *" name="state" value={newEnquiry.state} onChange={(e) => setNewEnquiry({ ...newEnquiry, state: e.target.value })} required fullWidth />
                <Input label="City *" name="city" value={newEnquiry.city} onChange={(e) => setNewEnquiry({ ...newEnquiry, city: e.target.value })} required fullWidth />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 bg-gray-200 text-gray-800">Cancel</Button>
              <Button type="submit" className="flex-1">Add Enquiry</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  )
}

export default Users

