import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../../components/layout/Layout'
import api from '../../../services/api'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import Input from '../../../components/ui/Input'

interface CourseOption {
    id: number
    course_name: string
    fee_amount: string
}

const UpdateInvoice = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [courseOptions, setCourseOptions] = useState<CourseOption[]>([])
    const [student, setStudent] = useState<any>(null)
    const [invoiceId, setInvoiceId] = useState<number | null>(null)

    // Form State
    const [rows, setRows] = useState(Array(6).fill(null).map(() => ({ course: '', fee: 0 })))
    const [discount, setDiscount] = useState(0)
    const [registrationAmount, setRegistrationAmount] = useState(0)

    // Installments
    const [installments, setInstallments] = useState<any[]>(
        Array(6).fill(null).map((_, i) => ({
            installment_no: i + 1,
            due_date: '',
            amount: 0,
            status: 'Pending'
        }))
    )

    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.allSettled([
                    api.get('/admin/course-fees/'),
                    api.get(`/admin/user-management/${id}/`),
                    api.get(`/admin/student-invoices/?student_id=${id}`)
                ])

                const [coursesRes, studentRes, invoicesRes] = results

                let courseOpts: any[] = []
                if (coursesRes.status === 'fulfilled') {
                    const data = coursesRes.value.data
                    courseOpts = data.results || data
                    setCourseOptions(courseOpts)
                } else {
                    console.error('Failed to load courses:', coursesRes.reason)
                    alert('Error loading course list.')
                }

                let studentData: any = null
                if (studentRes.status === 'fulfilled') {
                    studentData = studentRes.value.data
                    setStudent(studentData)
                }

                let foundInvoice = false
                if (invoicesRes.status === 'fulfilled') {
                    const data = invoicesRes.value.data
                    const validData = data.results || data
                    if (Array.isArray(validData) && validData.length > 0) {
                        foundInvoice = true
                        const inv = validData[0]
                        setInvoiceId(inv.id)

                        // Populate from Invoice
                        const invCourses = inv.courses ? inv.courses.split(', ') : []
                        const newRows = rows.map(r => ({ ...r }))

                        invCourses.forEach((c: string, i: number) => {
                            if (i < 6) {
                                newRows[i].course = c
                                const matched = courseOpts.find((o: any) => o.course_name === c)
                                newRows[i].fee = matched ? parseFloat(matched.fee_amount) : 0
                            }
                        })
                        setRows(newRows)
                        setDiscount(parseFloat(inv.discount))
                        setRegistrationAmount(parseFloat(inv.registration_amount))

                        // Populate Installments
                        if (inv.installments && inv.installments.length > 0) {
                            const newInst = Array(6).fill(null).map((_, i) => ({
                                installment_no: i + 1,
                                due_date: '',
                                amount: 0,
                                status: 'Pending'
                            }))
                            inv.installments.forEach((inst: any, i: number) => {
                                if (i < 6) {
                                    newInst[i] = { ...inst, installment_no: i + 1, amount: parseFloat(inst.amount) }
                                }
                            })
                            setInstallments(newInst)
                        }
                    }
                }

                // If no invoice found, populate from student courses
                if (!foundInvoice && studentData && studentData.courses) {
                    const newRows = rows.map(r => ({ ...r }))
                    studentData.courses.forEach((cname: string, i: number) => {
                        if (i < 6) {
                            newRows[i].course = cname
                            const matched = courseOpts.find((o: any) => o.course_name === cname)
                            newRows[i].fee = matched ? parseFloat(matched.fee_amount) : 0
                        }
                    })
                    setRows(newRows)
                }

            } catch (error) {
                console.error('Critical error:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const handleCourseChange = (index: number, value: string) => {
        const newRows = rows.map((r, i) => {
            if (i === index) {
                const matched = courseOptions.find(c => c.course_name === value)
                return { ...r, course: value, fee: matched ? parseFloat(matched.fee_amount) : 0 }
            }
            return r
        })
        setRows(newRows)
    }

    const calculateTotal = () => rows.reduce((acc, row) => acc + (row.fee || 0), 0)
    const totalFees = calculateTotal()
    const grandTotal = totalFees - discount + registrationAmount

    const installmentTotal = installments.reduce((acc, inst) => acc + (inst.amount || 0), 0)

    const handleInstallmentChange = (index: number, field: string, value: any) => {
        const newInst = installments.map((inst, i) => i === index ? { ...inst, [field]: value } : inst)
        setInstallments(newInst)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            // Filter out empty installments (0 amount)
            const validInstallments = installments.filter(i => i.amount > 0)

            const payload = {
                student: id,
                courses: rows.map(r => r.course).filter(Boolean).join(', '),
                total_amount: totalFees,
                discount: discount,
                grand_total: grandTotal,
                registration_amount: registrationAmount,
                installments: validInstallments
            }

            if (invoiceId) {
                await api.put(`/admin/student-invoices/${invoiceId}/`, payload)
            } else {
                await api.post('/admin/student-invoices/', payload)
            }
            navigate('/admin/invoices')
        } catch (error: any) {
            const msg = error.response?.data ? JSON.stringify(error.response.data) : error.message
            alert(`Failed to save invoice: ${msg}`)
        }
    }

    if (loading) return <Layout role="admin"><LoadingSpinner /></Layout>

    return (
        <Layout role="admin">
            <div className="space-y-6 bg-white min-h-screen p-6 text-gray-900">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Update Invoice</h1>
                    <div className="text-sm text-gray-600">
                        Invoice No: {invoiceId ? invoiceId : 'New'} | Date: {new Date().toLocaleDateString()}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Student Info */}
                        <div className="bg-gray-100 p-4 rounded mb-4 border border-gray-200 text-gray-800">
                            <strong>Student:</strong> {student ? `${student.first_name} ${student.last_name} (${student.username})` : `ID: ${id}`}
                        </div>

                        {/* Course Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 mb-6">
                                <thead className="bg-blue-900 text-white">
                                    <tr>
                                        <th className="p-2 w-16 border border-blue-800">Sl#</th>
                                        <th className="p-2 border border-blue-800">Course</th>
                                        <th className="p-2 w-32 text-right border border-blue-800">Fees</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white text-gray-900">
                                    {rows.map((row, idx) => (
                                        <tr key={idx} className="border-b border-gray-200">
                                            <td className="p-2 text-center border-r border-gray-200">{idx + 1}.</td>
                                            <td className="p-2 border-r border-gray-200">
                                                <select
                                                    className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                                    value={row.course}
                                                    onChange={(e) => handleCourseChange(idx, e.target.value)}
                                                >
                                                    <option value="">Select Course</option>
                                                    {courseOptions.map(opt => (
                                                        <option key={opt.id} value={opt.course_name}>
                                                            {opt.course_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-2 text-right font-medium">
                                                {row.fee.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {/* Summaries */}
                                    <tr className="bg-gray-50 border-t-2 border-gray-300">
                                        <td colSpan={2} className="p-2 text-right font-bold text-gray-700">Net Total Amount:</td>
                                        <td className="p-2 text-right font-bold text-gray-900">{totalFees.toLocaleString()}</td>
                                    </tr>
                                    <tr className="bg-gray-50 border-gray-200">
                                        <td colSpan={2} className="p-2 text-right font-bold text-gray-700">Discount Amount:</td>
                                        <td className="p-2 text-right">
                                            <input
                                                type="number"
                                                className="w-full text-right border border-gray-300 rounded p-1 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                                value={discount}
                                                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="bg-gray-50 border-gray-200">
                                        <td colSpan={2} className="p-2 text-right font-bold text-gray-700">Registration:</td>
                                        <td className="p-2 text-right">
                                            <input
                                                type="number"
                                                className="w-full text-right border border-gray-300 rounded p-1 bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                                value={registrationAmount}
                                                onChange={(e) => setRegistrationAmount(parseFloat(e.target.value) || 0)}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="bg-blue-50 border-t-2 border-blue-200">
                                        <td colSpan={2} className="p-2 text-right font-bold text-lg text-blue-900">Grand Total:</td>
                                        <td className="p-2 text-right font-bold text-lg text-blue-900">{grandTotal.toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Installment Plan Manual Table */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-bold mb-4 text-gray-800">Installment Plan</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300">
                                    <thead className="bg-blue-900 text-white">
                                        <tr>
                                            <th className="p-2 w-16 border border-blue-800">Sl#</th>
                                            <th className="p-2 border border-blue-800 text-left pl-4">Installment No.</th>
                                            <th className="p-2 w-48 border border-blue-800">Installment Date</th>
                                            <th className="p-2 w-40 text-right border border-blue-800">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white text-gray-900">
                                        {installments.map((inst, idx) => (
                                            <tr key={idx} className="border-b border-gray-200">
                                                <td className="p-2 text-center border-r border-gray-200">{idx + 1}.</td>
                                                <td className="p-2 border-r border-gray-200 pl-4 font-medium">
                                                    Installment {inst.installment_no}
                                                </td>
                                                <td className="p-2 border-r border-gray-200 text-center">
                                                    <input
                                                        type="date"
                                                        className="border border-gray-300 rounded p-1 w-full bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                                        value={inst.due_date}
                                                        onChange={(e) => handleInstallmentChange(idx, 'due_date', e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-2 text-right">
                                                    <input
                                                        type="number"
                                                        className="border border-gray-300 rounded p-1 w-full text-right bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                                                        value={inst.amount}
                                                        onChange={(e) => handleInstallmentChange(idx, 'amount', parseFloat(e.target.value) || 0)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-100 font-bold border-t-2 border-gray-300">
                                            <td colSpan={3} className="p-2 text-right pr-4 text-gray-700">Total:</td>
                                            <td className="p-2 text-right text-gray-900">{installmentTotal.toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-gray-200">
                            <Button type="button" variant="secondary" onClick={() => navigate('/admin/invoices')}>Cancel</Button>
                            <Button type="submit" variant="primary">Save Invoice</Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateInvoice
