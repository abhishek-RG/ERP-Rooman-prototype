import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import { activityService } from '../../../services/activityService'
import Layout from '../../../components/layout/Layout'
import {
  ACTIVITY_TYPE_CHOICES,
  PRIORITY_CHOICES,
  STATUS_CHOICES,
  CreateActivityData,
} from '../../../types/activity'

const AddActivity = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Form state
  const [formData, setFormData] = useState<CreateActivityData>({
    executive: user?.id,
    activity_type: '',
    activity_description: '',
    activity_date: '',
    start_time_hour: undefined,
    start_time_minute: undefined,
    duration_hour: undefined,
    duration_minute: undefined,
    priority: 'medium',
    person_to_contact: '',
    phone_1: '',
    phone_2: '',
    venue: '',
    status: 'planned',
    feedback: '',
    remarks: '',
  })

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.activity_type) {
      newErrors.activity_type = 'Activity Type is required'
    }

    if (!formData.activity_description.trim()) {
      newErrors.activity_description = 'Activity Description is required'
    } else if (formData.activity_description.length > 255) {
      newErrors.activity_description = 'Activity Description must not exceed 255 characters'
    }

    if (!formData.activity_date) {
      newErrors.activity_date = 'Date is required'
    }

    if (formData.phone_1 && !/^\d{10,15}$/.test(formData.phone_1)) {
      newErrors.phone_1 = 'Phone 1 must be 10-15 digits'
    }

    if (formData.phone_2 && !/^\d{10,15}$/.test(formData.phone_2)) {
      newErrors.phone_2 = 'Phone 2 must be 10-15 digits'
    }

    if (formData.venue && formData.venue.length > 255) {
      newErrors.venue = 'Venue must not exceed 255 characters'
    }

    if (formData.feedback && formData.feedback.length > 255) {
      newErrors.feedback = 'Feedback must not exceed 255 characters'
    }

    if (formData.remarks && formData.remarks.length > 255) {
      newErrors.remarks = 'Remarks must not exceed 255 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('hour') || name.includes('minute') ? (value ? parseInt(value) : undefined) : value,
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    if (!validateForm()) {
      setError('Please fix all errors before submitting')
      return
    }

    setLoading(true)

    try {
      const response = await activityService.createActivity(formData)
      setSuccessMessage(response.message || 'Activity created successfully!')

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin/activities')
      }, 2000)
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Failed to create activity. Please try again.'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const timeOptions = Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, '0'),
  }))

  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, '0'),
  }))

  return (
    <Layout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Activity</h1>
          <p className="mt-2 text-gray-600">Create a new activity record</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <p className="text-green-800">{successMessage}</p>
            </div>
          )}

          {/* 1. Activity Info Section */}
          <Card>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Activity Information</h2>
            </div>

            <div className="space-y-4">
              {/* Executive (auto-filled) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Executive</label>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 border border-gray-300">
                  {user?.first_name} {user?.last_name} ({user?.username})
                </div>
              </div>

              {/* Activity Type */}
              <div>
                <label htmlFor="activity_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="activity_type"
                  name="activity_type"
                  value={formData.activity_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select Activity Type</option>
                  {ACTIVITY_TYPE_CHOICES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.activity_type && <p className="text-red-500 text-sm mt-1">{errors.activity_type}</p>}
              </div>

              {/* Activity Description */}
              <div>
                <label
                  htmlFor="activity_description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Activity Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="activity_description"
                  name="activity_description"
                  value={formData.activity_description}
                  onChange={handleInputChange}
                  maxLength={255}
                  rows={4}
                  placeholder="Enter activity description (max 255 characters)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <div className="mt-1 flex justify-between items-center">
                  <p className="text-gray-500 text-sm">
                    {formData.activity_description.length}/255 characters
                  </p>
                  {errors.activity_description && (
                    <p className="text-red-500 text-sm">{errors.activity_description}</p>
                  )}
                </div>
              </div>

              {/* Date */}
              <div>
                <label htmlFor="activity_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="activity_date"
                  name="activity_date"
                  value={formData.activity_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {errors.activity_date && <p className="text-red-500 text-sm mt-1">{errors.activity_date}</p>}
              </div>

              {/* Start Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_time_hour" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time - Hour
                  </label>
                  <select
                    id="start_time_hour"
                    name="start_time_hour"
                    value={formData.start_time_hour ?? ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">--</option>
                    {timeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="start_time_minute" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time - Minute
                  </label>
                  <select
                    id="start_time_minute"
                    name="start_time_minute"
                    value={formData.start_time_minute ?? ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">--</option>
                    {minuteOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="duration_hour" className="block text-sm font-medium text-gray-700 mb-2">
                    Duration - Hour
                  </label>
                  <select
                    id="duration_hour"
                    name="duration_hour"
                    value={formData.duration_hour ?? ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">--</option>
                    {timeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="duration_minute" className="block text-sm font-medium text-gray-700 mb-2">
                    Duration - Minute
                  </label>
                  <select
                    id="duration_minute"
                    name="duration_minute"
                    value={formData.duration_minute ?? ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">--</option>
                    {minuteOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {PRIORITY_CHOICES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* 2. Contact Info Section */}
          <Card>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            </div>

            <div className="space-y-4">
              {/* Person To Contact */}
              <div>
                <label htmlFor="person_to_contact" className="block text-sm font-medium text-gray-700 mb-2">
                  Person To Contact
                </label>
                <Input
                  id="person_to_contact"
                  name="person_to_contact"
                  type="text"
                  value={formData.person_to_contact || ''}
                  onChange={handleInputChange}
                  placeholder="Enter person name"
                  fullWidth
                />
              </div>

              {/* Phone Numbers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone_1" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone 1
                  </label>
                  <Input
                    id="phone_1"
                    name="phone_1"
                    type="tel"
                    value={formData.phone_1 || ''}
                    onChange={handleInputChange}
                    placeholder="Phone number (digits only)"
                    fullWidth
                  />
                  {errors.phone_1 && <p className="text-red-500 text-sm mt-1">{errors.phone_1}</p>}
                </div>

                <div>
                  <label htmlFor="phone_2" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone 2 (Optional)
                  </label>
                  <Input
                    id="phone_2"
                    name="phone_2"
                    type="tel"
                    value={formData.phone_2 || ''}
                    onChange={handleInputChange}
                    placeholder="Phone number (digits only)"
                    fullWidth
                  />
                  {errors.phone_2 && <p className="text-red-500 text-sm mt-1">{errors.phone_2}</p>}
                </div>
              </div>

              {/* Venue */}
              <div>
                <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
                  Venue
                </label>
                <textarea
                  id="venue"
                  name="venue"
                  value={formData.venue || ''}
                  onChange={handleInputChange}
                  maxLength={255}
                  rows={3}
                  placeholder="Enter venue details (max 255 characters)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <div className="mt-1 flex justify-between items-center">
                  <p className="text-gray-500 text-sm">
                    {(formData.venue || '').length}/255 characters
                  </p>
                  {errors.venue && <p className="text-red-500 text-sm">{errors.venue}</p>}
                </div>
              </div>
            </div>
          </Card>

          {/* 3. Feedback Section */}
          <Card>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Feedback</h2>
            </div>

            <div className="space-y-4">
              {/* Activity Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {STATUS_CHOICES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feedback */}
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  value={formData.feedback || ''}
                  onChange={handleInputChange}
                  maxLength={255}
                  rows={4}
                  placeholder="Enter feedback (max 255 characters)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <div className="mt-1 flex justify-between items-center">
                  <p className="text-gray-500 text-sm">
                    {(formData.feedback || '').length}/255 characters
                  </p>
                  {errors.feedback && <p className="text-red-500 text-sm">{errors.feedback}</p>}
                </div>
              </div>
            </div>
          </Card>

          {/* 4. Remarks Section */}
          <Card>
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Remarks</h2>
            </div>

            <div>
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks || ''}
                onChange={handleInputChange}
                maxLength={255}
                rows={4}
                placeholder="Enter remarks (max 255 characters)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <div className="mt-1 flex justify-between items-center">
                <p className="text-gray-500 text-sm">
                  {(formData.remarks || '').length}/255 characters
                </p>
                {errors.remarks && <p className="text-red-500 text-sm">{errors.remarks}</p>}
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? 'Creating Activity...' : 'Create Activity'}
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/admin/activities')}
              disabled={loading}
              variant="secondary"
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default AddActivity
