import { useState, useEffect } from 'react'
import Layout from '../../../components/layout/Layout'
import api from '../../../services/api'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import { useNavigate, useLocation } from 'react-router-dom'

interface Invoice {
    id: number
    student_name: string
    username: string
    center: string
    courses: string[]
    total_fees: number
    fees_due: number
    invoice_id?: number
    last_receipt_id?: number
}

const InvoiceDashboard = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()
    const highlightUserId = location.state?.highlightUserId

    useEffect(() => {
        fetchInvoices()
    }, [])

    const fetchInvoices = async () => {
        try {
            let url = '/admin/invoices/'
            if (highlightUserId) {
                url += `?user_id=${highlightUserId}`
            }

            const response = await api.get(url)
            const data = response.data.results ? response.data.results : response.data
            setInvoices(data)
        } catch (error) {
            console.error('Error fetching invoices:', error)
        } finally {
            setLoading(false)
        }
    }

    const clearFilter = () => {
        navigate('/admin/invoices', { replace: true, state: {} })
        window.location.reload()
    }

    const handlePrintInvoice = async (invoiceId: number) => {
        try {
            const response = await api.get(`/admin/student-invoices/${invoiceId}/download_pdf/`, { responseType: 'blob' })
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `invoice_${invoiceId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error('Error downloading invoice:', error)
            alert('Failed to download invoice')
        }
    }

    const handlePrintReceipt = async (receiptId: number) => {
        try {
            const response = await api.get(`/admin/student-receipts/${receiptId}/download_pdf/`, { responseType: 'blob' })
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `receipt_${receiptId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error('Error downloading receipt:', error)
            alert('Failed to download receipt')
        }
    }

    return (
        <Layout role="admin">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Student Invoice Management</h1>
                    {highlightUserId && (
                        <Button size="sm" variant="secondary" onClick={clearFilter}>
                            Show All Students
                        </Button>
                    )}
                </div>
                <Card>
                    {loading ? (
                        <div className="flex justify-center p-8"><LoadingSpinner /></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Fees</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees Due</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{invoice.student_name}</div>
                                                <div className="text-xs text-gray-500">@{invoice.username}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{invoice.courses && invoice.courses.length > 0 ? invoice.courses.join(', ') : '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.center || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                                ₹{invoice.total_fees.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                                                ₹{invoice.fees_due.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Button size="sm" variant="primary" onClick={() => navigate(`/admin/students/invoice/update/${invoice.id}`)}>
                                                        Update Inv
                                                    </Button>
                                                    <Button size="sm" variant="success" onClick={() => navigate(`/admin/students/invoice/receipt/add/${invoice.id}`)}>
                                                        Add Rcpt
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        disabled={!invoice.invoice_id}
                                                        onClick={() => invoice.invoice_id && handlePrintInvoice(invoice.invoice_id)}
                                                    >
                                                        Print Inv
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        disabled={!invoice.last_receipt_id}
                                                        onClick={() => invoice.last_receipt_id && handlePrintReceipt(invoice.last_receipt_id)}
                                                    >
                                                        Print Rcpt
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {invoices.length === 0 && (
                                        <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No students found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    )
}

export default InvoiceDashboard
