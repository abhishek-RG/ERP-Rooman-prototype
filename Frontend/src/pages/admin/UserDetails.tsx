import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useStudentStore } from '../../store/studentStore'
import { useEnquiryStore, type EnquiryStatus, FollowUp } from '../../store/enquiryStore'
import { enquiryAPI } from '../../services/api'

const UserDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const addStudent = useStudentStore(state => state.addStudent)
  const { enquiries, updateEnquiryStatus, updateEnquiryStage, addFollowUp, fetchEnquiry, isLoading, error } = useEnquiryStore()

  const enquiry = useMemo(() => enquiries.find(e => String(e.id) === String(id)), [enquiries, id])
  const [followUpDate, setFollowUpDate] = useState('')
  const [followUpNotes, setFollowUpNotes] = useState('')
  const [followUpOutcome, setFollowUpOutcome] = useState<'Connected' | 'No Response' | 'Call Back'>('Connected')
  const [selectedStatus, setSelectedStatus] = useState<EnquiryStatus>('Cold')
  const [followUpHistory, setFollowUpHistory] = useState<any[]>([])

  // Financial Management State
  const [courseFee, setCourseFee] = useState('')
  const [discount, setDiscount] = useState('')
  const [finalAmount, setFinalAmount] = useState(0)
  const [installments, setInstallments] = useState<{ amount: string, dueDate: string, status: string }[]>([])
  const [newInstallmentAmount, setNewInstallmentAmount] = useState('')
  const [newInstallmentDueDate, setNewInstallmentDueDate] = useState('')
  const [hasFinancialDetails, setHasFinancialDetails] = useState(false)

  // Email Follow-up State
  const [emailTemplate, setEmailTemplate] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [emailSending, setEmailSending] = useState(false)

  // Fetch the enquiry and follow-ups when component mounts
  useEffect(() => {
    console.log('🔍 UserDetails useEffect triggered for id:', id)
    if (id) {
      fetchEnquiry(id)
      // Fetch follow-up history from backend
      console.log('📡 Fetching follow-ups for enquiry:', id)
      enquiryAPI.getFollowUps(id).then(response => {
        console.log('✅ Follow-ups API response:', response.data)
        const followups = response.data.map((f: any) => ({
          date: f.date,
          notes: f.notes,
          outcome: f.outcome.charAt(0).toUpperCase() + f.outcome.slice(1).replace(/_/g, ' '),
          nextFollowUp: f.next_follow_up_date
        }))
        console.log('📋 Mapped follow-ups:', followups)
        setFollowUpHistory(followups)
        console.log('✅ Follow-up history state updated with', followups.length, 'items')
      }).catch(err => {
        console.error('❌ Error fetching follow-ups:', err)
        console.error('Error details:', err.response?.data)
      })
    }
  }, [id]) // Only depend on id, not fetchEnquiry

  // Loading state
  if (isLoading && !enquiry) {
    return (
      <Layout role="admin">
        <div className="px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Loading enquiry details...</p>
            </div>
          </Card>
        </div>
      </Layout>
    )
  }

  // Error state
  if (error && !enquiry) {
    return (
      <Layout role="admin">
        <div className="px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="p-6 bg-red-50 border border-red-200 rounded">
              <p className="text-red-800 font-medium">Error: {error}</p>
              <Button onClick={() => fetchEnquiry(id!)} className="mt-3 bg-red-600 text-white">
                Retry
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    )
  }

  // Not found state
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
  if (enquiry && enquiry.status && selectedStatus !== enquiry.status) {
    setSelectedStatus(enquiry.status as EnquiryStatus)
  }

  const handleStartFollowUp = () => {
    updateEnquiryStage(enquiry.id, 'LEAD')
  }

  const handleSaveFollowUp = async () => {
    if (enquiry.stage === 'CONVERTED') return
    const date = new Date().toISOString().split('T')[0]
    const newFollowUp = {
      date: followUpDate || date,
      notes: followUpNotes,
      outcome: followUpOutcome,
      nextFollowUp: undefined
    }

    try {
      await addFollowUp(enquiry.id, newFollowUp)
      // update status if changed
      updateEnquiryStatus(enquiry.id, selectedStatus)
      // Refresh follow-up history from backend
      const response = await enquiryAPI.getFollowUps(enquiry.id)
      const followups = response.data.map((f: any) => ({
        date: f.date,
        notes: f.notes,
        outcome: f.outcome.charAt(0).toUpperCase() + f.outcome.slice(1).replace(/_/g, ' '),
        nextFollowUp: f.next_follow_up_date
      }))
      setFollowUpHistory(followups)

      setFollowUpNotes('')
      setFollowUpDate('')
      setFollowUpOutcome('Connected')
    } catch (error) {
      console.error('Error saving follow-up:', error)
      alert('Failed to save follow-up. Please try again.')
    }
  }

  const handleConvert = () => {
    addStudent({
      name: enquiry.name,
      email: enquiry.email || '',
      phone: enquiry.phone || '',
      course: enquiry.course || ''
    })
    updateEnquiryStatus(enquiry.id, 'Cold')
    alert(`Successfully converted ${enquiry.name} to a Student!`)
    navigate('/admin/students')
  }

  const getStatusColor = (status?: EnquiryStatus) => {
    switch (status) {
      case 'Hot': return 'bg-red-100 text-red-800'
      case 'Warm': return 'bg-yellow-100 text-yellow-800'
      case 'Cold': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Financial Management Handlers
  useEffect(() => {
    // Auto-calculate final amount when course fee or discount changes
    const fee = parseFloat(courseFee) || 0
    const disc = parseFloat(discount) || 0
    setFinalAmount(fee - disc)
  }, [courseFee, discount])

  const handleAddInstallment = () => {
    if (!newInstallmentAmount || !newInstallmentDueDate) {
      alert('Please enter both amount and due date')
      return
    }

    setInstallments([...installments, {
      amount: newInstallmentAmount,
      dueDate: newInstallmentDueDate,
      status: 'pending'
    }])
    setNewInstallmentAmount('')
    setNewInstallmentDueDate('')
  }

  const handleSaveFinancialDetails = () => {
    if (!courseFee || parseFloat(courseFee) <= 0) {
      alert('Please enter a valid course fee')
      return
    }

    // In real implementation, this would save to backend
    setHasFinancialDetails(true)
    alert('Financial details saved successfully!')
  }

  const handleConvertToStudent = () => {
    if (!hasFinancialDetails) {
      alert('Please save financial details first')
      return
    }

    // For now, just show confirmation
    const confirmed = confirm(`Convert ${enquiry.name} to a student?`)
    if (confirmed) {
      addStudent({
        name: enquiry.name,
        email: enquiry.email || '',
        phone: enquiry.phone || '',
        course: enquiry.course || ''
      })
      alert(`Successfully converted ${enquiry.name} to a Student!`)
      navigate('/admin/students')
    }
  }

  // Email Templates
  const emailTemplates: { [key: string]: { subject: string, message: string } } = {
    'course-details': {
      subject: `Course Information - ${enquiry.course || 'Our Courses'}`,
      message: `Dear ${enquiry.name},
Thank you for your interest in our courses. As requested, please find the course details below:

[Course information will be provided here]

If you have any questions or need further clarification, please feel free to reply to this email — we will be happy to assist you.

We look forward to supporting you in your learning journey.

Best regards,
Rooman Technologies`
    },
    'fee-reminder': {
      subject: 'Fee Payment Reminder',
      message: `Dear ${enquiry.name},
This is a friendly reminder regarding your pending course fee payment. We kindly request you to complete the payment at your earliest convenience to ensure a smooth continuation of your admission process and to secure your enrollment without any delays.

If you need any assistance with the payment process, require payment details, or have any concerns, please feel free to reply to this email — our team will be happy to support you.

Thank you, and we look forward to welcoming you soon.

Best regards,
Rooman Technologies`
    },
    'admission-followup': {
      subject: 'Follow-up on Your Admission',
      message: `Dear ${enquiry.name},

We hope you are doing well. We wanted to personally follow up regarding your ongoing admission process and check if you require any assistance or clarification at this stage. Our team is here to support you with any information related to course details, documentation, next steps, or the enrollment process.

If you have any questions or need guidance, please feel free to reply to this email or contact us directly — we will be happy to help you move forward smoothly.

We look forward to assisting you and supporting you throughout your admission journey.

Best regards,
Rooman Technologies`
    },
    'general-followup': {
      subject: 'Following up on your enquiry',
      message: `Dear ${enquiry.name},

Thank you for your interest in our programs. We just wanted to check in with you and see if you need any additional information or assistance at this stage.

Please feel free to reach out to us if you have any questions or would like further guidance — we are always happy to help.

We look forward to hearing from you.

Best regards,
Rooman Technologies`
    }
  }

  const handleEmailTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateKey = e.target.value
    setEmailTemplate(templateKey)
    if (templateKey && emailTemplates[templateKey]) {
      const template = emailTemplates[templateKey]
      setEmailSubject(template.subject)
      setEmailMessage(template.message)
    }
  }

  const handleSendEmail = async () => {
    if (!emailSubject || !emailMessage) {
      alert('Please fill in subject and message')
      return
    }

    if (!enquiry.email) {
      alert('No email address found for this enquiry')
      return
    }

    setEmailSending(true)
    try {
      await enquiryAPI.sendEmail({
        to_email: enquiry.email,
        subject: emailSubject,
        message: emailMessage
      })

      // Clear fields on success
      setEmailSubject('')
      setEmailMessage('')
      setEmailTemplate('')
      alert('Email sent successfully!')
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Failed to send email. Please try again.')
    } finally {
      setEmailSending(false)
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
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Enquiry ID</p>
                <p className="text-base font-semibold text-gray-900">{enquiry.id}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Date</p>
                <p className="text-base font-semibold text-gray-900">{enquiry.date || enquiry.createdDate}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Name</p>
                <p className="text-base font-semibold text-gray-900">{enquiry.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                <span className={`mt - 1 px - 2.5 py - 0.5 inline - flex text - xs font - medium rounded - full ${getStatusColor(enquiry.status as EnquiryStatus)} `}>
                  {enquiry.status || 'N/A'}
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">Contact Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Phone:</span>
                  <p className="text-sm text-gray-900">{enquiry.phone || enquiry.mobile_number || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <p className="text-sm text-gray-900">{enquiry.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">Location Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Country:</span>
                  <p className="text-sm text-gray-900">{enquiry.country || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">State:</span>
                  <p className="text-sm text-gray-900">{enquiry.state || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">City:</span>
                  <p className="text-sm text-gray-900">{enquiry.city || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Center:</span>
                  <p className="text-sm text-gray-900">{enquiry.center || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Education & Qualification */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">Education Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Qualification:</span>
                  <p className="text-sm text-gray-900">{enquiry.qualification || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Knowledge:</span>
                  <p className="text-sm text-gray-900">{enquiry.knowledge || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Reason for Enquiry:</span>
                  <p className="text-sm text-gray-900">{enquiry.reason_for_enquiry ? enquiry.reason_for_enquiry.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Course:</span>
                  <p className="text-sm text-gray-900">{enquiry.course || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">Professional Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Designation:</span>
                  <p className="text-sm text-gray-900">{enquiry.designation || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Work Experience:</span>
                  <p className="text-sm text-gray-900">{enquiry.total_work_experience || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <p className="text-sm text-gray-900">{enquiry.studentStatus || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Computer Skills:</span>
                  <p className="text-sm text-gray-900">{enquiry.computer || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">Additional Details</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Gender:</span>
                  <p className="text-sm text-gray-900">{enquiry.gender || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Course Interest:</span>
                  <p className="text-sm text-gray-900">{enquiry.course || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Source:</span>
                  <p className="text-sm text-gray-900">{enquiry.source || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Notes:</span>
                  <p className="text-sm text-gray-900 italic">{enquiry.notes || 'No notes'}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">Follow-up History</h4>
              <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto border border-gray-100">
                {followUpHistory && followUpHistory.length > 0 ? followUpHistory.map((item, idx) => (
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
                  <div className="flex gap-3 mb-4">
                    {(['Cold', 'Warm', 'Hot'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${enquiry.status === status
                          ? status === 'Hot'
                            ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/50 ring-2 ring-red-600 ring-offset-2 transform scale-105'
                            : status === 'Warm'
                              ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/50 ring-2 ring-orange-500 ring-offset-2 transform scale-105'
                              : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 ring-2 ring-blue-600 ring-offset-2 transform scale-105'
                          : status === 'Hot'
                            ? 'bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 hover:shadow-md'
                            : status === 'Warm'
                              ? 'bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-400 hover:shadow-md'
                              : 'bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400 hover:shadow-md'
                          }`}
                      >
                        {status === 'Hot' && <span className="mr-1">🔥</span>}
                        {status === 'Warm' && <span className="mr-1">☀️</span>}
                        {status === 'Cold' && <span className="mr-1">❄️</span>}
                        {status}
                      </button>
                    ))}
                  </div>

                  {/* Hot Lead Financial Management - Show when status is Hot */}
                  {enquiry.status === 'Hot' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-5 mb-4">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">🔥</span>
                        <h5 className="text-base font-semibold text-gray-900">Hot Lead - Financial Management</h5>
                      </div>

                      {/* Course Fee & Discount */}
                      <div className="bg-white rounded-md p-4 mb-3 border border-gray-200">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Fee (₹)</label>
                            <Input
                              type="number"
                              value={courseFee}
                              onChange={(e) => setCourseFee(e.target.value)}
                              placeholder="50000"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount (₹)</label>
                            <Input
                              type="number"
                              value={discount}
                              onChange={(e) => setDiscount(e.target.value)}
                              placeholder="5000"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Final Amount</label>
                            <div className="h-9 flex items-center px-3 bg-gray-50 border border-gray-300 rounded-md">
                              <span className="text-sm font-semibold text-gray-900">₹ {finalAmount.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Installment Management */}
                      <div className="bg-white rounded-md p-4 mb-3 border border-gray-200">
                        <h6 className="text-sm font-semibold text-gray-900 mb-3">📅 Installment Management</h6>

                        {/* Add Installment Form */}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Amount (₹)</label>
                            <Input
                              type="number"
                              value={newInstallmentAmount}
                              onChange={(e) => setNewInstallmentAmount(e.target.value)}
                              placeholder="15000"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
                            <Input
                              type="date"
                              value={newInstallmentDueDate}
                              onChange={(e) => setNewInstallmentDueDate(e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              onClick={handleAddInstallment}
                              className="w-full bg-blue-600 text-white hover:bg-blue-700 text-sm"
                            >
                              ➕ Add Installment
                            </Button>
                          </div>
                        </div>

                        {/* Installments List */}
                        {installments.length > 0 && (
                          <div className="bg-gray-50 rounded p-3 max-h-36 overflow-y-auto border border-gray-200">
                            <p className="text-xs font-semibold text-gray-600 mb-2">Installments ({installments.length})</p>
                            <div className="space-y-2">
                              {installments.map((inst, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-gray-200 text-sm">
                                  <div>
                                    <span className="font-semibold text-gray-900">₹ {parseFloat(inst.amount).toLocaleString('en-IN')}</span>
                                    <span className="text-xs text-gray-500 ml-2">Due: {new Date(inst.dueDate).toLocaleDateString('en-IN')}</span>
                                  </div>
                                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded font-medium">
                                    {inst.status === 'pending' ? 'Pending' : inst.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => alert('Add Invoice - Coming soon!')}
                          className="bg-blue-600 text-white hover:bg-blue-700 text-sm"
                        >
                          📄 Add Invoice
                        </Button>
                        <Button
                          onClick={() => alert('Generate Invoice - Coming soon!')}
                          className="bg-blue-600 text-white hover:bg-blue-700 text-sm"
                        >
                          📋 Generate Invoice
                        </Button>
                        <Button
                          onClick={handleSaveFinancialDetails}
                          className="bg-purple-600 text-white hover:bg-purple-700 text-sm font-semibold ml-auto"
                        >
                          💾 Save Financial Details
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Convert to Student Section - Show only after financial details are saved */}
                  {enquiry.status === 'Hot' && hasFinancialDetails && (
                    <div className="bg-green-50 border border-green-300 rounded-lg p-5 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full">
                            <span className="text-2xl">✅</span>
                          </div>
                          <div>
                            <h5 className="text-base font-semibold text-gray-900">Financial Details Saved</h5>
                            <p className="text-sm text-gray-600">Ready to convert this lead to a student</p>
                          </div>
                        </div>
                        <Button
                          onClick={handleConvertToStudent}
                          className="bg-green-600 text-white hover:bg-green-700 font-semibold px-6"
                        >
                          🎓 Convert to Student
                        </Button>
                      </div>
                    </div>
                  )}

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

                  {/* Send Email Follow-up Section */}
                  <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm mb-4">
                    <h5 className="text-sm font-medium mb-3">📧 Send Email Follow-up</h5>

                    <div className="grid grid-cols-1 gap-3">
                      {/* Template Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email Template (Optional)</label>
                        <select
                          value={emailTemplate}
                          onChange={handleEmailTemplateChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                        >
                          <option value="">Select a template...</option>
                          <option value="course-details">Course Details</option>
                          <option value="fee-reminder">Fee Reminder</option>
                          <option value="admission-followup">Admission Follow-up</option>
                          <option value="general-followup">General Follow-up</option>
                        </select>
                      </div>

                      {/* To Email (read-only) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">To Email</label>
                        <Input
                          value={enquiry.email || 'No email provided'}
                          readOnly
                          className="bg-gray-50 text-gray-600"
                        />
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                        <Input
                          value={emailSubject}
                          onChange={(e) => setEmailSubject(e.target.value)}
                          placeholder="Enter email subject"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                          rows={6}
                          value={emailMessage}
                          onChange={(e) => setEmailMessage(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="Enter email message..."
                        />
                      </div>

                      {/* Send Button */}
                      <div>
                        <Button
                          onClick={handleSendEmail}
                          disabled={emailSending || !emailSubject || !emailMessage || !enquiry.email}
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          {emailSending ? '📧 Sending...' : '📧 Send Email Follow-up'}
                        </Button>
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
