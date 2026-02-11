import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Layout from '../../components/layout/Layout'
import { sessionService, Session, SessionAttendance } from '../../services/sessionService'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

const SessionAttendancePage = () => {
    const { sessionId } = useParams<{ sessionId: string }>()
    const navigate = useNavigate()
    const [session, setSession] = useState<Session | null>(null)
    const [attendance, setAttendance] = useState<SessionAttendance[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    // Form state for session conduction details
    const [conductionData, setConductionData] = useState({
        conducted_date: '',
        conducted_start_time: '',
        conducted_end_time: '',
        content_covered: '',
        status: 'conducted' as const
    })

    useEffect(() => {
        if (sessionId) {
            loadData()
        }
    }, [sessionId])

    const loadData = async () => {
        try {
            setLoading(true)
            const sid = parseInt(sessionId!)
            const sessionData = await sessionService.getSession(sid)
            setSession(sessionData)

            // Set initial conduction data from session
            setConductionData({
                conducted_date: sessionData.conducted_date || sessionData.session_date,
                conducted_start_time: sessionData.conducted_start_time || sessionData.start_time,
                conducted_end_time: sessionData.conducted_end_time || sessionData.end_time,
                content_covered: sessionData.content_covered || '',
                status: sessionData.status === 'scheduled' ? 'conducted' : sessionData.status as any
            })

            // Load or initialize attendance
            let attendanceData = await sessionService.getAttendance(sid)
            if (attendanceData.length === 0) {
                attendanceData = await sessionService.initializeAttendance(sid)
            }
            setAttendance(attendanceData)
        } catch (error) {
            console.error('Failed to load attendance data', error)
            alert('Failed to load attendance data')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = (studentId: number, status: SessionAttendance['status']) => {
        setAttendance(prev => prev.map(a =>
            a.student === studentId ? { ...a, status } : a
        ))
    }

    const handleRemarksChange = (studentId: number, remarks: string) => {
        setAttendance(prev => prev.map(a =>
            a.student === studentId ? { ...a, remarks } : a
        ))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            const sid = parseInt(sessionId!)

            // 1. Update session conduction details
            await sessionService.updateSession(sid, conductionData)

            // 2. Update attendance for all students
            await sessionService.bulkUpdateAttendance(attendance.map(a => ({
                id: a.id,
                status: a.status,
                remarks: a.remarks || undefined
            })))

            alert('Attendance and session details updated successfully')
            navigate('/admin/sessions')
        } catch (error) {
            console.error('Failed to save attendance', error)
            alert('Failed to save attendance')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ArrowPathIcon className="animate-spin text-blue-600" width={40} />
            </div>
        )
    }

    if (!session) return <div>Session not found</div>

    return (
        <Layout role="admin">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-blue-900 text-center py-2 bg-[#4a7ebb] text-white rounded-t-lg italic">
                        Batch Attendance
                    </h1>
                    <div className="text-sm text-gray-500 mt-2">
                        Home &gt; Batches &gt; List Batches &gt; List Sessions &gt; Session Attendance:
                    </div>
                </div>

                <Card className="p-8 bg-[#fdfdfd] mb-6">
                    <div className="space-y-1 text-sm text-blue-900 mb-8 border-b pb-6">
                        <div className="flex">
                            <span className="w-40 font-bold uppercase text-[11px]">Batch:</span>
                            <span className="text-red-600 underline font-bold cursor-pointer" onClick={() => navigate('/admin/batches')}>Batch {session.batch}</span>
                        </div>
                        <div className="flex">
                            <span className="w-40 font-bold uppercase text-[11px]">Batch Session:</span>
                            <span className="text-blue-800 underline font-bold cursor-pointer" onClick={() => navigate('/admin/sessions')}>Session {session.id}</span>
                        </div>
                        <div className="flex">
                            <span className="w-40 font-bold uppercase text-[11px]">Session Date:</span>
                            <span className="font-bold">{session.session_date}</span>
                        </div>
                        <div className="flex">
                            <span className="w-40 font-bold uppercase text-[11px]">Subject:</span>
                            <span className="text-blue-800 underline font-bold italic">{session.batch_details?.course_name}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/30 p-4 rounded-lg border border-blue-100">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Conducted Date*</label>
                                <Input
                                    type="date"
                                    value={conductionData.conducted_date}
                                    onChange={(e: any) => setConductionData(prev => ({ ...prev, conducted_date: e.target.value }))}
                                    required
                                    className="bg-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Start Time*</label>
                                    <Input
                                        type="time"
                                        value={conductionData.conducted_start_time}
                                        onChange={(e: any) => setConductionData(prev => ({ ...prev, conducted_start_time: e.target.value }))}
                                        required
                                        className="bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">End Time*</label>
                                    <Input
                                        type="time"
                                        value={conductionData.conducted_end_time}
                                        onChange={(e: any) => setConductionData(prev => ({ ...prev, conducted_end_time: e.target.value }))}
                                        required
                                        className="bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Content Covered*</label>
                            <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 h-24 text-sm"
                                value={conductionData.content_covered}
                                onChange={e => setConductionData(prev => ({ ...prev, content_covered: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="mt-10">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2">Student Attendance</h3>
                            <div className="overflow-x-auto border rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-[#4a7ebb] text-white">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-bold uppercase">Student</th>
                                            <th className="px-4 py-2 text-center text-xs font-bold uppercase">Status</th>
                                            <th className="px-4 py-2 text-left text-xs font-bold uppercase">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-[#ffffcc]">
                                        {attendance.map(a => (
                                            <tr key={a.id} className="hover:bg-[#ffff99]">
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="font-bold text-blue-900">{a.student_name}</div>
                                                    <div className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">{a.student_id_code}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center gap-1">
                                                        {(['present', 'absent', 'late', 'excused'] as const).map(s => (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                onClick={() => handleStatusChange(a.student, s)}
                                                                className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${a.status === s
                                                                    ? s === 'present' ? 'bg-green-700 text-white shadow-sm scale-105'
                                                                        : s === 'absent' ? 'bg-red-700 text-white shadow-sm scale-105'
                                                                            : 'bg-yellow-600 text-white shadow-sm scale-105'
                                                                    : 'bg-white/50 text-gray-500 border border-gray-300 hover:bg-white'
                                                                    }`}
                                                            >
                                                                {s}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Input
                                                        value={a.remarks || ''}
                                                        onChange={(e: any) => handleRemarksChange(a.student, e.target.value)}
                                                        placeholder="Add remarks..."
                                                        className="h-8 text-[11px] bg-white border-blue-100"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6 border-t mt-8">
                            <Button type="button" variant="secondary" onClick={() => navigate('/admin/sessions')} className="font-bold uppercase text-xs">
                                Back to List
                            </Button>
                            <Button type="submit" disabled={submitting} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold uppercase text-xs px-8 shadow-md">
                                {submitting ? <ArrowPathIcon className="animate-spin mr-2" width={16} /> : null}
                                Save Attendance
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    )
}

export default SessionAttendancePage
