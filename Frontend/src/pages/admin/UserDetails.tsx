import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useStudentStore } from '../../store/studentStore'
import { useEnquiryStore, Enquiry, EnquiryStatus, FollowUp } from '../../store/enquiryStore'

const UserDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const addStudent = useStudentStore(state => state.addStudent)
  const { enquiries, updateEnquiryStatus, updateEnquiryStage, addFollowUp } = useEnquiryStore()

  const enquiry = useMemo(() => enquiries.find(e => e.id === id), [enquiries, id])
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpNotes, setFollowUpNotes] = useState('')
  const [followUpOutcome, setFollowUpOutcome] = useState<'Connected'|'No Response'|'Call Back'>('Connected')
  const [selectedStatus, setSelectedStatus] = useState<EnquiryStatus>('Cold')

  if (!enquiry) {
    return (
      <Layout role="admin">
        <div className="px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="p-6">Enquiry not found.</div>
          </Card>
        </div>
      </Layout>
    )
  }

  const handleStatusChange = (status: EnquiryStatus) => {
    if (!enquiry || enquiry.stage === 'CONVERTED') return
    updateEnquiryStatus(enquiry.id, status)
    setSelectedStatus(status)
  }

  // Update selectedStatus when enquiry changes
  if (enquiry && selectedStatus !== enquiry.status) {
    setSelectedStatus(enquiry.status)
  }

  const handleStartFollowUp = () => {
    updateEnquiryStage(enquiry.id, 'LEAD')
  }

  const handleSaveFollowUp = () => {
    if (enquiry.stage === 'CONVERTED') return
    const date = new Date().toISOString().split('T')[0]
    const fu: FollowUp = { date, notes: followUpNotes, outcome: followUpOutcome, nextFollowUp: followUpDate || undefined }
    addFollowUp(enquiry.id, fu)
    // update status if changed
    updateEnquiryStatus(enquiry.id, selectedStatus)
    setFollowUpNotes('')
    setFollowUpDate('')
    alert('Follow-up saved')
  }

  const handleConvert = () => {
    addStudent({ name: enquiry.name, email: enquiry.email, phone: enquiry.phone, course: enquiry.course })
    updateEnquiryStatus(enquiry.id, 'Cold') // optional: keep or change
    alert(`Successfully converted ${enquiry.name} to a Student!`)
    navigate('/admin/students')
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
          <h1 className="text-2xl font-bold">Enquiry Details</h1>
          <div>
            <Button onClick={() => navigate(-1)}>Back</Button>
          </div>
        </div>

        <Card>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Enquiry ID</p>
                <p className="text-base font-semibold text-gray-900">{enquiry.id}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Date</p>
                <p className="text-base font-semibold text-gray-900">{enquiry.date}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Name</p>
                <p className="text-base font-semibold text-gray-900">{enquiry.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                <span className={`mt-1 px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full ${getStatusColor(enquiry.status)}`}>
                  {enquiry.status}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">Contact Information</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex">
                  <span className="text-sm font-medium text-gray-500 w-24">Phone:</span>
                  <span className="text-sm text-gray-900">{enquiry.phone}</span>
                </div>
                <div className="flex">
                  <span className="text-sm font-medium text-gray-500 w-24">Email:</span>
                  <span className="text-sm text-gray-900">{enquiry.email}</span>
                </div>
                <div className="flex">
                  <span className="text-sm font-medium text-gray-500 w-24">Address:</span>
                  <span className="text-sm text-gray-900 flex-1">{enquiry.address}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">Interest Details</h4>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex">
                  <span className="text-sm font-medium text-gray-500 w-24">Course:</span>
                  <span className="text-sm text-gray-900">{enquiry.course}</span>
                </div>
                <div className="flex">
                  <span className="text-sm font-medium text-gray-500 w-24">Source:</span>
                  <span className="text-sm text-gray-900">{enquiry.source}</span>
                </div>
                <div className="flex">
                  <span className="text-sm font-medium text-gray-500 w-24">Notes:</span>
                  <span className="text-sm text-gray-900 flex-1 italic">{enquiry.notes}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">Follow-up History</h4>
              <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto border border-gray-100">
                {enquiry.followUps && enquiry.followUps.length > 0 ? enquiry.followUps.map((item, idx) => (
                  <div key={idx} className="relative pl-4 pb-4 last:pb-0 border-l-2 border-gray-200 last:border-transparent">
                    <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-gray-300"></div>
                    <p className="text-xs text-gray-500 mb-0.5">{item.date} — {item.outcome}</p>
                    <p className="text-sm text-gray-700">{item.notes}</p>
                    {item.nextFollowUp && <p className="text-xs text-gray-400">Next: {item.nextFollowUp}</p>}
                  </div>
                )) : (
                  <div className="text-sm text-gray-500">No follow-ups yet.</div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 -mx-6 -mb-6 p-6 mt-6 border-t border-gray-200 rounded-b-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Lead Actions</h4>

              {/* Stage: ENQUIRY -> show Start Follow-up */}
              {enquiry.stage === 'ENQUIRY' && (
                <div className="mb-4">
                  <Button onClick={handleStartFollowUp} className="bg-blue-600 text-white">Start Follow-up</Button>
                </div>
              )}

              {/* When LEAD: status buttons + follow-up form */}
              {enquiry.stage === 'LEAD' && (
                <>
                  <div className="flex space-x-3 mb-4">
                    {(['Cold', 'Warm', 'Hot'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all shadow-sm ${enquiry.status === status
                          ? status === 'Hot' ? 'bg-red-600 text-white ring-2 ring-red-600 ring-offset-2' :
                            status === 'Warm' ? 'bg-yellow-500 text-white ring-2 ring-yellow-500 ring-offset-2' :
                              'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm mb-4">
                    <h5 className="text-sm font-medium mb-2">Record Follow-up</h5>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea rows={3} className="mt-1 block w-full rounded-md border p-2" value={followUpNotes} onChange={e => setFollowUpNotes(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Outcome</label>
                        <select value={followUpOutcome} onChange={e => setFollowUpOutcome(e.target.value as any)} className="mt-1 block w-full rounded-md border p-2">
                          <option value="Connected">Connected</option>
                          <option value="No Response">No Response</option>
                          <option value="Call Back">Call Back</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Next Follow-up Date</label>
                        <Input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={handleSaveFollowUp} disabled={!followUpNotes}>Save Follow-up</Button>
                      </div>
                    </div>
                  </div>

                  {/* Conditional UI based on status */}
                  {(enquiry.status === 'Cold' || enquiry.status === 'Warm') && (
                    <div className="mb-4">
                      <Button onClick={() => alert('Follow up again — schedule via the form above')}>Follow Up Again</Button>
                    </div>
                  )}

                  {enquiry.status === 'Hot' && (
                    <div className="bg-green-50 p-4 rounded-md border border-green-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-sm font-medium text-green-800">Ready for Admission?</h5>
                          <p className="text-xs text-green-600 mt-1">Convert this enquiry into a student record.</p>
                        </div>
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={handleConvert}
                        >
                          Convert to Student
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* If converted, show read-only message */}
              {enquiry.stage === 'CONVERTED' && (
                <div className="p-4 bg-gray-50 rounded border">This enquiry is converted and read-only.</div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default UserDetails
