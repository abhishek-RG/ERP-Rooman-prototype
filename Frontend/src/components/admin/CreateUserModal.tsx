import { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { CreateUserData } from '../../types/createUser'

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (userData: CreateUserData) => Promise<void>
  isLoading?: boolean
}

const CENTERS = [
  'Electronic City PMKK Futureskill (TC016371)',
  'Rajajinagar (123)',
  'Rajajinagar Bangalore (RAJBAN)',
  'Rooman Online (RON)',
]

const COURSES = [
  'Advanced Java (005)',
  'AI in Cybersecurity (49)',
  'Application Developer Web and Mobile (FSD)',
  'AWS (012)',
  'AWS Internship (Internship-1)',
  'AWS Level 2 (AWS Advanced)',
  'CCNA (009)',
  'CCNP (23)',
  'CCNP-ENARSI (CCNP 23.1)',
  'CCNP-ENCOR (CCNP 23)',
  'Core Java (004)',
  'Core Java (PAP) (PAP-1)',
  'Cyber Security (10)',
  'Data Analytics Internship (Internship-2)',
  'Data Science & AI (28)',
  'Data Science & Business Analytics (001)',
  'Data Science & Machine Learning (019)',
  'Ethical Hacking (011)',
  'Front End Technologies (006)',
  'Full Stack Cloud & DevOps (FutureAcad-04)',
  'Full Stack Cyber Security (FutureAcad-03)',
  'Full Stack Development – Python (26)',
  'Full Stack Software Developer Internship (Internship-3)',
  'Full Stack Software Developer with GenAI (FutureAcad-06)',
  'Hardware and Networking (37)',
  'Interview Prep Program (Interview-1)',
  'Java Frameworks (27)',
  'Machine Learning (002)',
  'Master in Data Analytics & Machine Learning (FutureAcad-02)',
  'Master in NextGen AI & Data Science (FutureAcad-01)',
  'MySQL / NoSQL (014)',
  'Networking & Cyber Security (22)',
  'Networking Essentials (Net-Ess)',
  'Professional in Cloud and DevOps (Professional-08)',
  'Professional in Core IT Ops: Network, Server & Cloud (Professional-01)',
  'Professional in Cyber Security Expert (Professional-06)',
  'Professional in Data Analytics (Professional-03)',
  'Professional in Generative AI and MLOps (Professional-05)',
  'Professional in Machine Learning & Deep Learning (Professional-04)',
  'Professional in Web Development & DSA (Professional-02)',
  'Python Frameworks (008)',
  'Python Programming (007)',
  'Server Admin & Cloud Computing (21)',
  'Soft Skills (43)',
  'VMWare Essentials (13)',
  'Windows Server Administrator (24)',
]

const CreateUserModal = ({ isOpen, onClose, onSubmit, isLoading = false }: CreateUserModalProps) => {
  const [formData, setFormData] = useState<CreateUserData>({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student',
    phone_number: '',
    student_id: '',
    center: '',
    enrollment_date: new Date().toISOString().split('T')[0],
    course: '',
    guardian_name: '',
    guardian_contact: '',
    emergency_contact: '',
    employee_id: '',
    designation: '',
    department: '',
    join_date: new Date().toISOString().split('T')[0],
    salary: '',
    employment_type: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) newErrors.username = 'Username is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required'
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required'

    // Student-specific validation
    if (formData.role === 'student') {
      if (!formData.center) newErrors.center = 'Center is required'
      if (!formData.course) newErrors.course = 'Course is required'
      if (!formData.guardian_name?.trim()) newErrors.guardian_name = 'Guardian name is required'
      if (!formData.guardian_contact?.trim()) newErrors.guardian_contact = 'Guardian contact is required'
      if (!formData.emergency_contact?.trim()) newErrors.emergency_contact = 'Emergency contact is required'
    }

    // Employee-specific validation
    if (formData.role === 'employee') {
      if (!formData.designation?.trim()) newErrors.designation = 'Designation is required'
      if (!formData.employment_type) newErrors.employment_type = 'Employment type is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      // Build clean payload based on role - ONLY include role-specific fields
      const submitData: any = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role,
      }

      // Add phone if provided
      if (formData.phone_number?.trim()) {
        submitData.phone_number = formData.phone_number
      }

      // Add role-specific fields only
      if (formData.role === 'student') {
        submitData.center = formData.center

        // Extract course code from format like "Data Science & AI (49)"
        if (formData.course) {
          const match = formData.course.match(/\(([^)]+)\)/)
          submitData.course = match ? match[1] : formData.course
        }

        if (formData.guardian_name?.trim()) submitData.guardian_name = formData.guardian_name
        if (formData.guardian_contact?.trim()) submitData.guardian_contact = formData.guardian_contact
        if (formData.emergency_contact?.trim()) submitData.emergency_contact = formData.emergency_contact
        if (formData.enrollment_date) submitData.enrollment_date = formData.enrollment_date
        if (formData.student_id?.trim()) submitData.student_id = formData.student_id
      } else if (formData.role === 'employee') {
        submitData.designation = formData.designation

        if (formData.employment_type) submitData.employment_type = formData.employment_type
        if (formData.department?.trim()) submitData.department = formData.department
        if (formData.join_date) submitData.join_date = formData.join_date
        if (formData.salary?.trim()) submitData.salary = parseFloat(formData.salary)
        if (formData.employee_id?.trim()) submitData.employee_id = formData.employee_id
      }

      await onSubmit(submitData)
      
      // Reset form on success
      setFormData({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'student',
        phone_number: '',
        student_id: '',
        center: '',
        enrollment_date: new Date().toISOString().split('T')[0],
        course: '',
        guardian_name: '',
        guardian_contact: '',
        emergency_contact: '',
        employee_id: '',
        designation: '',
        department: '',
        join_date: new Date().toISOString().split('T')[0],
        salary: '',
        employment_type: '',
      })
      setErrors({})
      onClose()
    } catch (error) {
      // Error handled by parent component
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 my-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create New User</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Common fields */}
          <Input
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            fullWidth
            disabled={isLoading}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            fullWidth
            disabled={isLoading}
          />

          <Input
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            error={errors.first_name}
            fullWidth
            disabled={isLoading}
          />

          <Input
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            error={errors.last_name}
            fullWidth
            disabled={isLoading}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            fullWidth
            disabled={isLoading}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="student">Student</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <Input
            label="Phone (Optional)"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleChange}
            fullWidth
            disabled={isLoading}
          />

          {/* Student-specific fields */}
          {formData.role === 'student' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Center</label>
                <select
                  name="center"
                  value={formData.center}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    errors.center ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a center...</option>
                  {CENTERS.map(center => (
                    <option key={center} value={center}>
                      {center}
                    </option>
                  ))}
                </select>
                {errors.center && <p className="mt-1 text-sm text-red-600">{errors.center}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    errors.course ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a course...</option>
                  {COURSES.map(course => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                {errors.course && <p className="mt-1 text-sm text-red-600">{errors.course}</p>}
              </div>

              <Input
                label="Guardian Name"
                name="guardian_name"
                value={formData.guardian_name}
                onChange={handleChange}
                error={errors.guardian_name}
                fullWidth
                disabled={isLoading}
              />

              <Input
                label="Guardian Contact"
                name="guardian_contact"
                type="tel"
                value={formData.guardian_contact}
                onChange={handleChange}
                error={errors.guardian_contact}
                fullWidth
                disabled={isLoading}
              />

              <Input
                label="Emergency Contact"
                name="emergency_contact"
                type="tel"
                value={formData.emergency_contact}
                onChange={handleChange}
                error={errors.emergency_contact}
                fullWidth
                disabled={isLoading}
              />
            </>
          )}

          {/* Employee-specific fields */}
          {formData.role === 'employee' && (
            <>
              <Input
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                error={errors.designation}
                fullWidth
                disabled={isLoading}
              />

              <Input
                label="Department (Optional)"
                name="department"
                value={formData.department}
                onChange={handleChange}
                fullWidth
                disabled={isLoading}
              />

              <Input
                label="Join Date (Optional)"
                name="join_date"
                type="date"
                value={formData.join_date}
                onChange={handleChange}
                fullWidth
                disabled={isLoading}
              />

              <Input
                label="Salary (Optional)"
                name="salary"
                type="number"
                step="0.01"
                value={formData.salary}
                onChange={handleChange}
                fullWidth
                disabled={isLoading}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                <select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    errors.employment_type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select employment type...</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
                {errors.employment_type && <p className="mt-1 text-sm text-red-600">{errors.employment_type}</p>}
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateUserModal
