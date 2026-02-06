import { useMemo, useState } from 'react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useLeadStore, updateStage, Lead } from '../../store/leadStore'

const LeadsPage = () => {
  const { leads, updateLeadStage } = useLeadStore()
  const [activeRow, setActiveRow] = useState<string | null>(null)
  const [nextDate, setNextDate] = useState('')

  const leadList = useMemo(() => leads.filter(l => l.stage === 'Cold' || l.stage === 'Warm' || l.stage === 'Hot'), [leads])

  const handleStatusChange = (id: string, stage: 'Cold' | 'Warm' | 'Hot') => {
    updateLeadStage(id, stage)
  }

  const handleConvert = (id: string) => {
    updateLeadStage(id, 'Converted')
  }

  return (
    <Layout role="admin">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl font-bold">Leads</h1>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follow-up Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Follow-up Date</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Lead Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leadList.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.stage}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.lastFollowUp || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        {(['Cold', 'Warm', 'Hot'] as const).map((s) => (
                          <button key={s} onClick={() => handleStatusChange(lead.id, s)} className={`px-3 py-1 rounded text-sm ${lead.stage === s ? 'bg-primary-600 text-white' : 'bg-white border'}`}>
                            {s}
                          </button>
                        ))}
                      </div>

                      {/* Conditional UI */}
                      <div className="mt-3">
                        {(lead.stage === 'Cold' || lead.stage === 'Warm') && (
                          <div className="flex items-center gap-2">
                            <Button onClick={() => setActiveRow(activeRow === lead.id ? null : lead.id)}>Follow Up Again</Button>
                            {activeRow === lead.id && (
                              <div className="flex items-center gap-2">
                                <Input type="date" value={nextDate} onChange={(e) => setNextDate(e.target.value)} />
                                <Button disabled={!nextDate} onClick={() => { alert(`Next follow-up: ${nextDate}`); setNextDate(''); setActiveRow(null) }}>Save</Button>
                              </div>
                            )}
                          </div>
                        )}

                        {lead.stage === 'Hot' && (
                          <div className="mt-2">
                            <Button className="bg-green-600 text-white" onClick={() => handleConvert(lead.id)}>Convert to Student</Button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {leadList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">No leads available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default LeadsPage
