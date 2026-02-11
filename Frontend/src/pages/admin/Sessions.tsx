import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Layout from '../../components/layout/Layout'
import { sessionService, Session } from '../../services/sessionService'
import { useNavigate } from 'react-router-dom'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

const AlphabetNavigation = ({ onSelect }: { onSelect: (letter: string) => void }) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    return (
        <div className="flex flex-wrap gap-2 text-sm text-blue-600 mb-4 justify-center">
            <button onClick={() => onSelect('All')} className="hover:underline font-bold">All</button>
            {letters.map(l => (
                <button key={l} onClick={() => onSelect(l)} className="hover:underline">{l}</button>
            ))}
            <button onClick={() => onSelect('Others')} className="hover:underline">Others</button>
        </div>
    )
}

const Sessions = () => {
    const [sessions, setSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        loadSessions()
    }, [])

    const loadSessions = async () => {
        try {
            setLoading(true)
            const data = await sessionService.getSessions()
            setSessions(data)
        } catch (error) {
            console.error('Failed to load sessions', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredSessions = sessions.filter(s =>
        s.batch_details?.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.batch_details?.faculty_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.session_date.includes(searchTerm)
    )

    return (
        <Layout role="admin">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 italic">Results for all Sessions!</h1>
                    <div className="text-sm text-gray-500 mt-1">
                        Home &gt; Sessions &gt; List Sessions:
                    </div>
                </div>
            </div>

            <Card className="p-6 mb-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex w-full max-w-md gap-2">
                        <Input
                            placeholder="Keyword"
                            value={searchTerm}
                            onChange={(e: any) => setSearchTerm(e.target.value)}
                            className="flex-1"
                        />
                        <Button variant="primary" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                            Search
                        </Button>
                    </div>
                    <AlphabetNavigation onSelect={(l) => console.log('Selected letter:', l)} />
                    <div className="text-sm text-gray-600">
                        Displaying 1 - {filteredSessions.length} of {filteredSessions.length} Session(s)
                    </div>
                </div>
            </Card>

            <Card className="overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <ArrowPathIcon className="animate-spin text-blue-600" width={40} />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-[#4a7ebb] text-white">
                                <tr className="divide-x divide-gray-300">
                                    <th className="px-4 py-2 text-left text-xs font-bold uppercase">Sl.#</th>
                                    <th className="px-4 py-2 text-left text-xs font-bold uppercase">Session</th>
                                    <th className="px-4 py-2 text-left text-xs font-bold uppercase">Subject</th>
                                    <th className="px-4 py-2 text-left text-xs font-bold uppercase">Faculty</th>
                                    <th className="px-4 py-2 text-left text-xs font-bold uppercase">Class Room</th>
                                    <th className="px-4 py-2 text-left text-xs font-bold uppercase">Time</th>
                                    <th className="px-4 py-2 text-left text-xs font-bold uppercase">Conducted</th>
                                    <th className="px-4 py-2 text-left text-xs font-bold uppercase">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-bold uppercase">Center</th>
                                    <th className="px-4 py-2 text-left text-xs font-bold uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-[#ffffcc] divide-y divide-white">
                                {filteredSessions.map((session, index) => (
                                    <tr key={session.id} className="hover:bg-[#ffff99] divide-x divide-white">
                                        <td className="px-4 py-2 text-sm text-gray-900 font-bold">{index + 1}.</td>
                                        <td className="px-4 py-2 text-sm">
                                            <div className="text-red-600 font-bold leading-tight">Session {index + 1}<br />({session.id})</div>
                                            <div className="text-orange-600 text-[10px] underline cursor-pointer mt-1 font-bold" onClick={() => navigate(`/admin/batches`)}>
                                                Batch {session.batch}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-blue-800 underline cursor-pointer italic font-medium">
                                            {session.batch_details?.course_name}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-blue-800 underline cursor-pointer">
                                            {session.batch_details?.faculty_name}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-blue-800 underline cursor-pointer">
                                            {session.batch_details?.classroom || 'N/A'}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700">
                                            <div className="font-bold">{session.session_date}</div>
                                            <div className="text-xs">{session.start_time} - {session.end_time}</div>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700">
                                            {session.conducted_date ? (
                                                <div>{session.conducted_date}<br /><span className="text-xs">{session.conducted_start_time}</span></div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700 font-medium capitalize">
                                            {session.status}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700">
                                            {session.batch_details?.center}
                                        </td>
                                        <td className="px-4 py-2 text-sm">
                                            <div className="flex flex-col gap-1">
                                                <button className="text-orange-600 underline text-[10px] text-left font-bold uppercase hover:text-orange-800 transition-colors">Update Session</button>
                                                <button
                                                    className="text-orange-600 underline text-[10px] text-left font-bold uppercase hover:text-orange-800 transition-colors"
                                                    onClick={() => navigate(`/admin/session-attendance/${session.id}`)}
                                                >
                                                    Session Attendance
                                                </button>
                                            </div>
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
