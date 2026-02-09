import { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { batchService, Batch, Session } from '../../services/batchService'

const Sessions = () => {
    const [batches, setBatches] = useState<Batch[]>([])
    const [selectedBatchId, setSelectedBatchId] = useState<number | ''>('')
    const [sessions, setSessions] = useState<Session[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Load batches for dropdown
        const loadBatches = async () => {
            try {
                const data = await batchService.getBatches()
                setBatches(data)
            } catch (err) {
                console.error('Failed to load batches', err)
            }
        }
        loadBatches()
    }, [])

    useEffect(() => {
        if (selectedBatchId) {
            fetchSessions(Number(selectedBatchId))
        } else {
            setSessions([])
        }
    }, [selectedBatchId])

    const fetchSessions = async (batchId: number) => {
        try {
            setIsLoading(true)
            const data = await batchService.getSessions(batchId)
            setSessions(data)
        } catch (err) {
            console.error('Failed to load sessions', err)
            setSessions([])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Layout role="admin">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Sessions</h1>
                <div className="w-full max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Batch</label>
                    <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        value={selectedBatchId}
                        onChange={(e) => setSelectedBatchId(Number(e.target.value))}
                    >
                        <option value="">-- Choose a Batch --</option>
                        {batches.map(b => (
                            <option key={b.id} value={b.id}>{b.course_name} ({b.start_date})</option>
                        ))}
                    </select>
                </div>
            </div>

            <Card title={selectedBatchId ? "Scheduled Sessions" : "Select a batch to view sessions"}>
                {isLoading ? (
                    <div className="flex justify-center p-8"><LoadingSpinner /></div>
                ) : sessions.length === 0 ? (
                    <p className="text-gray-500 py-4">No sessions found for this batch.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sessions.map(session => (
                                    <tr key={session.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{session.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {new Date(session.session_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {session.start_time} - {session.end_time}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${session.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </Layout>
    )
}

export default Sessions
