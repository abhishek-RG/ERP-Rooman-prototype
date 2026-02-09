import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../../components/layout/Layout'
import api from '../../../services/api'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'

const AddReceipt = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [invoice, setInvoice] = useState<any>(null)

    const [amount, setAmount] = useState(0)
    const [category, setCategory] = useState('Course Fees')
    const [paymentMode, setPaymentMode] = useState('Cash')
    const [refNo, setRefNo] = useState('')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await api.get(`/admin/student-invoices/?student_id=${id}`)
                const invList = res.data.results || res.data
                if (invList && invList.length > 0) {
                    setInvoice(invList[0])
                } else {
                    alert('No invoice found for this student. Please create an invoice first.')
                    navigate(`/admin/students/invoice/update/${id}`)
                }
            } catch (error) {
                console.error('Error fetching invoice:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchInvoice()
    }, [id, navigate])

    const handleSubmit = async () => {
        if (!invoice) return
        try {
            await api.post('/admin/student-receipts/', {
                invoice: invoice.id,
                amount: amount,
                category: category,
                payment_mode: paymentMode,
                transaction_ref: refNo,
                notes: notes
            })
            navigate('/admin/invoices')
        } catch (error) {
            console.error('Error saving receipt:', error)
            alert('Failed to save receipt')
        }
    }

    if (loading) return <Layout role="admin"><LoadingSpinner /></Layout>

    return (
        <Layout role="admin">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Add Receipt</h1>
            <Card className="bg-white">
                {/* Header Info */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded border border-gray-200 text-gray-900">
                    <div>
                        <label className="block text-sm font-bold text-gray-600">Student</label>
                        <div className="font-semibold text-lg">{invoice?.student_name}</div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-600">Invoice Details</label>
                        <div className="font-semibold">{invoice?.invoice_number}</div>
                        <div className="text-sm text-gray-600">Total Fees: ₹{invoice?.grand_total}</div>
                    </div>
                </div>

                {/* Entry Form */}
                <div className="border border-gray-200 p-6 rounded bg-white shadow-sm">
                    <h3 className="text-lg font-bold mb-6 border-b border-gray-200 pb-2 text-gray-900">Receipt Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700">Category</label>
                            <select
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option>Course Fees</option>
                                <option>Courseware</option>
                                <option>Exam Fees</option>
                                <option>Misc</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700">Amount</label>
                            <input
                                type="number"
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700">Payment Mode</label>
                            <select
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)}
                            >
                                <option>Cash</option>
                                <option>Card</option>
                                <option>UPI</option>
                                <option>Cheque</option>
                                <option>Bank Transfer</option>
                            </select>
                        </div>
                        {paymentMode !== 'Cash' && (
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-700">Reference No.</label>
                                <input
                                    type="text"
                                    className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                    value={refNo}
                                    onChange={(e) => setRefNo(e.target.value)}
                                    placeholder="Transaction/Check Ref"
                                />
                            </div>
                        )}
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-bold mb-2 text-gray-700">Notes</label>
                            <textarea
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Additional comments"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <Button variant="secondary" onClick={() => navigate('/admin/invoices')}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit}>Save Receipt</Button>
                </div>
            </Card>
        </Layout>
    )
}
export default AddReceipt
