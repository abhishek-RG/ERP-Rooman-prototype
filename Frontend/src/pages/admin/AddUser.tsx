import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useEnquiryStore } from '../../store/enquiryStore'

const AddUser = () => {
  const navigate = useNavigate()
  const { enquiries, addEnquiry } = useEnquiryStore()

  const [form, setForm] = useState({
    name: '', phone: '', email: '', course: '', source: '', address: '', notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = `ENQ-${String(enquiries.length + 1).padStart(3, '0')}`
    const date = new Date().toISOString().split('T')[0]
    addEnquiry({ id: newId, ...form, date, createdDate: date, stage: 'ENQUIRY', status: 'Cold', followUps: [] })
    alert('Enquiry added successfully')
    // optionally close tab or navigate
    navigate('/admin/users')
  }

  return (
    <Layout role="admin">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl font-bold">Add Enquiry</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Interested Course</label>
                <select value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} className="mt-1 block w-full rounded-md border p-2">
                  <option value="">Select a course</option>
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cyber Security">Cyber Security</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Source</label>
                <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className="mt-1 block w-full rounded-md border p-2">
                  <option value="">Select source</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea rows={2} className="mt-1 block w-full rounded-md border p-2" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea rows={3} className="mt-1 block w-full rounded-md border p-2" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>

            <div className="flex gap-3">
              <Button type="submit">Save Enquiry</Button>
              <Button onClick={() => navigate('/admin/users')} className="bg-white text-gray-700">Cancel</Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  )
}

export default AddUser
