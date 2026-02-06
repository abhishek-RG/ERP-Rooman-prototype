import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'

const Enquiry = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
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
        mobile_number: '',
        email: '',
        country: 'India',
        state: '',
        city: ''
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        // Mobile Validation
        if (!/^\d{10}$/.test(formData.mobile_number)) {
            newErrors.mobile_number = "Please enter a valid 10-digit mobile number"
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        setFormErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        // Clear error when user types
        if (formErrors[e.target.name]) {
            setFormErrors({
                ...formErrors,
                [e.target.name]: ''
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch('http://localhost:8000/api/admin/enquiry/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                setSuccess(true)
                setFormData({
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
                    mobile_number: '',
                    email: '',
                    country: 'India',
                    state: '',
                    city: ''
                })
                setTimeout(() => {
                    navigate('/')
                }, 3000)
            } else {
                const data = await response.json()
                setError(data.message || 'Failed to submit enquiry. Please try again.')
            }
        } catch (err) {
            setError('Network error. Please check your connection and try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <Navbar />

            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Enquiry Form
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600">
                            Fill in your details and we'll get back to you soon
                        </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-8 p-6 bg-green-50 border-2 border-green-500 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <p className="text-green-700 font-semibold">
                                    Thank you! Your enquiry has been submitted successfully. We'll get back to you soon.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8 p-6 bg-red-50 border-2 border-red-500 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <p className="text-red-700 font-semibold">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Enquiry Form */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Basic Details Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-purple-600">
                                    Basic Details
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors duration-200"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    {/* Center */}
                                    <div>
                                        <label htmlFor="center" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Center *
                                        </label>
                                        <select
                                            id="center"
                                            name="center"
                                            value={formData.center}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors duration-200"
                                        >
                                            <option value="">Select Center</option>
                                            <option value="all">All Centers</option>
                                            <option value="TC016371">Electronic City PMKK Futureskill (TC016371)</option>
                                            <option value="123">Rajajinagar (123)</option>
                                            <option value="RAJBAN">Rajajinagar Bangalore (RAJBAN)</option>
                                            <option value="RON">Rooman Online (RON)</option>
                                        </select>
                                    </div>

                                    {/* Type */}
                                    <div>
                                        <label htmlFor="enquiry_type" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Type *
                                        </label>
                                        <select
                                            id="enquiry_type"
                                            name="enquiry_type"
                                            value={formData.enquiry_type}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors duration-200"
                                        >
                                            <option value="">Select</option>
                                            <option value="corporate">Corporate</option>
                                            <option value="email">EMAIL</option>
                                            <option value="facebook">Facebook</option>
                                            <option value="job_mela">JOB MELA</option>
                                            <option value="old_student">Old Student</option>
                                            <option value="online_registration">Online Registration</option>
                                            <option value="placements">Placements</option>
                                            <option value="referral_app">Referral APP</option>
                                            <option value="seminar_workshop">Seminar/Workshop</option>
                                            <option value="sms">SMS</option>
                                            <option value="telephonic">TELEPHONIC</option>
                                            <option value="walkin_others">WALK-IN (Others)</option>
                                            <option value="walkin_experienced">Walk-in Experienced</option>
                                            <option value="walkin_fresher">Walk-in Fresher</option>
                                        </select>
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Gender *
                                        </label>
                                        <select
                                            id="gender"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors duration-200"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {/* Computer Knowledge */}
                                    <div>
                                        <label htmlFor="computer_knowledge" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Computer Knowledge
                                        </label>
                                        <select
                                            id="computer_knowledge"
                                            name="computer_knowledge"
                                            value={formData.computer_knowledge}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors duration-200"
                                        >
                                            <option value="">Select Level</option>
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </select>
                                    </div>

                                    {/* Qualification */}
                                    <div>
                                        <label htmlFor="qualification" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Qualification *
                                        </label>
                                        <input
                                            type="text"
                                            id="qualification"
                                            name="qualification"
                                            value={formData.qualification}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors duration-200"
                                            placeholder="e.g., B.Tech, MBA, etc."
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors duration-200"
                                        >
                                            <option value="student">Student</option>
                                            <option value="employed">Employed</option>
                                            <option value="unemployed">Unemployed</option>
                                            <option value="self_employed">Self Employed</option>
                                        </select>
                                    </div>

                                    {/* Organisation Name */}
                                    <div>
                                        <label htmlFor="organisation_name" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Organisation Name
                                        </label>
                                        <input
                                            type="text"
                                            id="organisation_name"
                                            name="organisation_name"
                                            value={formData.organisation_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors duration-200"
                                            placeholder="Current/Previous organisation"
                                        />
                                    </div>

                                    {/* Designation */}
                                    <div>
                                        <label htmlFor="designation" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Designation
                                        </label>
                                        <input
                                            type="text"
                                            id="designation"
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors duration-200"
                                            placeholder="Your job title"
                                        />
                                    </div>

                                    {/* Total Work Experience */}
                                    <div>
                                        <label htmlFor="total_work_experience" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Total Work Experience
                                        </label>
                                        <input
                                            type="text"
                                            id="total_work_experience"
                                            name="total_work_experience"
                                            value={formData.total_work_experience}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors duration-200"
                                            placeholder="e.g., 2 years, 6 months"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-purple-600">
                                    Contact Details
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Mobile Number */}
                                    <div>
                                        <label htmlFor="mobile_number" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Mobile Number *
                                        </label>
                                        <input
                                            type="tel"
                                            id="mobile_number"
                                            name="mobile_number"
                                            value={formData.mobile_number}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-4 py-3 bg-white text-gray-900 border-2 rounded-xl focus:outline-none transition-colors duration-200 ${formErrors.mobile_number ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-600'}`}
                                            placeholder="+91 1234567890"
                                        />
                                        {formErrors.mobile_number && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.mobile_number}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-4 py-3 bg-white text-gray-900 border-2 rounded-xl focus:outline-none transition-colors duration-200 ${formErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-purple-600'}`}
                                            placeholder="your.email@example.com"
                                        />
                                        {formErrors.email && (
                                            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                                        )}
                                    </div>

                                    {/* Country */}
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Country *
                                        </label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors duration-200"
                                            placeholder="India"
                                        />
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors duration-200"
                                            placeholder="e.g., Karnataka"
                                        />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors duration-200"
                                            placeholder="e.g., Bangalore"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Submitting...</span>
                                    </span>
                                ) : (
                                    'Submit Enquiry'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-12 grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
                            <p className="text-gray-600 text-sm">info@roomanerp.com</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">Phone</h3>
                            <p className="text-gray-600 text-sm">+91 1234567890</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
                            <p className="text-gray-600 text-sm">Bangalore, India</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Enquiry


