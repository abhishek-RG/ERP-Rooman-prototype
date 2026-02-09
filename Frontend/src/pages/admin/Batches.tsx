import { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { batchService, Batch, CreateBatchData } from '../../services/batchService'
// import { courseService } from '../../services/courseService' // Assuming this exists or will use a mock
import { userManagementService } from '../../services/userManagementService'


// Mock data for dropdowns (replace with actual API calls later or now if services exist)
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const Batches = () => {
    const [batches, setBatches] = useState<Batch[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Form State
    const [formData, setFormData] = useState<CreateBatchData>({
        course_id: 0,
        faculty_id: null,
        start_date: '',
        end_date: '',
        days: [],
        session_start_time: '',
        session_end_time: ''
    })

    // Dropdown Data
    const [courses, setCourses] = useState<{ id: number, course_name: string }[]>([
        { id: 1, course_name: 'Advanced Java (005)' },
        { id: 2, course_name: 'AI in Cybersecurity (49)' },
        { id: 3, course_name: 'Application Developer Web and Mobile (FSD)' },
        { id: 4, course_name: 'AWS (012)' },
        { id: 5, course_name: 'AWS Internship (Internship-1)' },
        { id: 6, course_name: 'AWS Level 2 (AWS Advanced)' },
        { id: 7, course_name: 'CCNA (009)' },
        { id: 8, course_name: 'CCNP (23)' },
        { id: 9, course_name: 'CCNP-ENARSI (CCNP 23.1)' },
        { id: 10, course_name: 'CCNP-ENCOR (CCNP 23)' },
        { id: 11, course_name: 'Core Java (004)' },
        { id: 12, course_name: 'Core Java (PAP) (PAP-1)' },
        { id: 13, course_name: 'Cyber Security (10)' },
        { id: 14, course_name: 'Data Analytics Internship (Internship-2)' },
        { id: 15, course_name: 'Data Science & AI (28)' },
        { id: 16, course_name: 'Data Science & Business Analytics (001)' },
        { id: 17, course_name: 'Data Science & Machine Learning (019)' },
        { id: 18, course_name: 'Ethical Hacking (011)' },
        { id: 19, course_name: 'Front End Technologies (006)' },
        { id: 20, course_name: 'Full Stack Cloud & DevOps (FutureAcad-04)' },
        { id: 21, course_name: 'Full Stack Cyber Security (FutureAcad-03)' },
        { id: 22, course_name: 'Full Stack Development – Python (26)' },
        { id: 23, course_name: 'Full Stack Software Developer Internship (Internship-3)' },
        { id: 24, course_name: 'Full Stack Software Developer with GenAI (FutureAcad-06)' },
        { id: 25, course_name: 'Hardware and Networking (37)' },
        { id: 26, course_name: 'Interview Prep Program (Interview-1)' },
        { id: 27, course_name: 'Java Frameworks (27)' },
        { id: 28, course_name: 'Machine Learning (002)' },
        { id: 29, course_name: 'Master in Data Analytics & Machine Learning (FutureAcad-02)' },
        { id: 30, course_name: 'Master in NextGen AI & Data Science (FutureAcad-01)' },
        { id: 31, course_name: 'MySQL / NoSQL (014)' },
        { id: 32, course_name: 'Networking & Cyber Security (22)' },
        { id: 33, course_name: 'Networking Essentials (Net-Ess)' },
        { id: 34, course_name: 'Professional in Cloud and DevOps (Professional-08)' },
        { id: 35, course_name: 'Professional in Core IT Ops: Network, Server & Cloud (Professional-01)' },
        { id: 36, course_name: 'Professional in Cyber Security Expert (Professional-06)' },
        { id: 37, course_name: 'Professional in Data Analytics (Professional-03)' },
        { id: 38, course_name: 'Professional in Generative AI and MLOps (Professional-05)' },
        { id: 39, course_name: 'Professional in Machine Learning & Deep Learning (Professional-04)' },
        { id: 40, course_name: 'Professional in Web Development & DSA (Professional-02)' },
        { id: 41, course_name: 'Python Frameworks (008)' },
        { id: 42, course_name: 'Python Programming (007)' },
        { id: 43, course_name: 'Server Admin & Cloud Computing (21)' },
        { id: 44, course_name: 'Soft Skills (43)' },
        { id: 45, course_name: 'VMWare Essentials (13)' },
        { id: 46, course_name: 'Windows Server Administrator (24)' }
    ]) // Replace with API fetch
    const [faculty, setFaculty] = useState<{ id: number, first_name: string, last_name: string }[]>([])


    useEffect(() => {
        fetchBatches()
        fetchFaculty()
    }, [])

    const fetchFaculty = async () => {
        try {
            const users = await userManagementService.getUsers('employee')
            // Map the user response to the format expected by the dropdown if necessary
            // The UserResponse interface in userManagementService extends UserCardData which has id, first_name, last_name
            // so we can use it directly or map it safely
            setFaculty(users.map(u => ({
                id: u.id,
                first_name: u.first_name,
                last_name: u.last_name
            })))
        } catch (err) {
            console.error('Failed to fetch faculty:', err)
        }
    }


    const fetchBatches = async () => {
        try {
            setIsLoading(true)
            const data = await batchService.getBatches()
            setBatches(data)
        } catch (err) {
            console.error('Failed to fetch batches:', err)
            // For demo purposes, if API fails, we can show empty state or mock data
            setBatches([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'course_id' || name === 'faculty_id' ? Number(value) : value
        }))
    }

    const handleDayToggle = (day: string) => {
        setFormData(prev => {
            const days = prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day]
            return { ...prev, days }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await batchService.createBatch(formData)
            setIsModalOpen(false)
            fetchBatches()
            // Reset form
            setFormData({
                course_id: 0,
                faculty_id: null,
                start_date: '',
                end_date: '',
                days: [],
                session_start_time: '',
                session_end_time: ''
            })
            alert('Batch created successfully! Sessions have been auto-generated.')
        } catch (err) {
            console.error('Failed to create batch:', err)
            alert('Failed to create batch')
        }
    }

    return (
        <Layout role="admin">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Batch Management</h1>
                <Button onClick={() => setIsModalOpen(true)}>+ Create Batch</Button>
            </div>

            <Card>
                {isLoading ? (
                    <div className="flex justify-center p-8"><LoadingSpinner /></div>
                ) : batches.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No batches found. Create one to get started.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {batches.map(batch => (
                                    <tr key={batch.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{batch.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.course_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{batch.faculty_name || 'Unassigned'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.start_date} to {batch.end_date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex gap-1">
                                                {batch.days.map(d => (
                                                    <span key={d} className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">{d}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{batch.session_start_time} - {batch.session_end_time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Create Batch Modal - Simplified inline for now, can be extracted */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Create New Batch</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Course</label>
                                <select
                                    name="course_id"
                                    value={formData.course_id}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                    required
                                >
                                    <option value={0}>Select Course</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Faculty</label>
                                <select
                                    name="faculty_id"
                                    value={formData.faculty_id || ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                >
                                    <option value="">Select Faculty</option>
                                    {faculty.map(f => <option key={f.id} value={f.id}>{f.first_name} {f.last_name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                    <Input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                                    <Input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                                <div className="flex flex-wrap gap-2">
                                    {DAYS_OF_WEEK.map(day => (
                                        <button
                                            type="button"
                                            key={day}
                                            onClick={() => handleDayToggle(day)}
                                            className={`px-3 py-1 rounded text-sm font-medium border ${formData.days.includes(day)
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                    <Input type="time" name="session_start_time" value={formData.session_start_time} onChange={handleInputChange} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                                    <Input type="time" name="session_end_time" value={formData.session_end_time} onChange={handleInputChange} required />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
                                <Button type="submit">Create Batch</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    )
}

export default Batches
