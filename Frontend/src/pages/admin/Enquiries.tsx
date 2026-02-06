import { useMemo, useState } from 'react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { useLeadStore, fetchEnquiries, updateStage, Lead } from '../../store/leadStore'

const EnquiriesPage = () => {
  const { leads, updateLeadStage } = useLeadStore()
  const [selected, setSelected] = useState<Lead | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const enquiriesOnly = useMemo(() => leads.filter(l => l.stage === 'Enquiry'), [leads])

  const handleStartFollowUp = (id: string) => {
    updateLeadStage(id, 'Cold')
  }

  const handleView = (lead: Lead) => {
    setSelected(lead)
    setIsModalOpen(true)
  }

  return (
    <Layout role="admin">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl font-bold">Enquiry Management</h1>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone / Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enquiriesOnly.map((enq) => (
                  <tr key={enq.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{enq.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{enq.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{enq.phone}</div>
                      <div className="text-xs text-gray-400">{enq.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enq.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{enq.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
                      <button onClick={() => handleView(enq)} className="text-primary-600 hover:underline">View</button>
                      <Button onClick={() => handleStartFollowUp(enq.id)}>Start Follow-up</Button>
                    </td>
                  </tr>
                ))}
                {enquiriesOnly.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">No enquiries found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Enquiry Details">
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Enquiry ID</p>
                  <p className="text-base font-semibold text-gray-900">{selected.id}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Date</p>
                  <p className="text-base font-semibold text-gray-900">{selected.date}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Name</p>
                  <p className="text-base font-semibold text-gray-900">{selected.name}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Notes</h4>
                <p className="text-sm text-gray-700">{selected.notes}</p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  )
}

export default EnquiriesPage
