import { useState, useEffect } from 'react'
import Layout from '../../../components/layout/Layout'
import api from '../../../services/api'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'


import { useNavigate, useLocation } from 'react-router-dom'

interface EmployeeSalary {
    id: number
    name: string
    username: string
    center: string
    department: string
    designation: string
    salary: number
    status: 'Paid' | 'Pending'
    employee_salary_id?: number
}

const SalaryDashboard = () => {
    const [employees, setEmployees] = useState<EmployeeSalary[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()
    const highlightUserId = location.state?.highlightUserId

    useEffect(() => {
        fetchSalaries()
    }, [highlightUserId])

    const fetchSalaries = async () => {
        try {
            let url = '/admin/salary-dashboard/'
            if (highlightUserId) {
                url += `?user_id=${highlightUserId}`
            }
            const response = await api.get(url)
            const data = response.data.results ? response.data.results : response.data
            setEmployees(data)
        } catch (error) {
            console.error('Error fetching salaries:', error)
        } finally {
            setLoading(false)
        }
    }

    const clearFilter = () => {
        navigate('/admin/employees/salary', { replace: true, state: {} })
        window.location.reload()
    }

    const handleMarkPaid = async (employeeId: number) => {
        try {
            await api.post(`/admin/salary-dashboard/${employeeId}/mark_paid/`)
            // Optimistic update
            setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, status: 'Paid' } : emp))
        } catch (error) {
            console.error('Error marking as paid:', error)
            alert('Failed to update status')
        }
    }

    const handleMarkUnpaid = async (employeeId: number) => {
        try {
            await api.post(`/admin/salary-dashboard/${employeeId}/mark_unpaid/`)
            // Optimistic update
            setEmployees(prev => prev.map(emp => emp.id === employeeId ? { ...emp, status: 'Pending' } : emp))
        } catch (error) {
            console.error('Error marking as unpaid:', error)
            alert('Failed to update status')
        }
    }

    const handleSelectAllPaid = async () => {
        if (!window.confirm('Are you sure you want to mark ALL displayed employees as Salary Paid?')) return
        try {
            await api.post('/admin/salary-dashboard/mark_all_paid/')
            setEmployees(prev => prev.map(emp => ({ ...emp, status: 'Paid' })))
            alert('All employees marked as Paid')
        } catch (error) {
            console.error('Error marking all as paid:', error)
            alert('Failed to update all statuses')
        }
    }

    return (
        <Layout role="admin">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Employee Salary Management</h1>
                    {highlightUserId && (
                        <Button size="sm" variant="secondary" onClick={clearFilter}>
                            Show All Employees
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <span>Status</span>
                                                <Button size="sm" variant="secondary" onClick={handleSelectAllPaid}>
                                                    Select All
                                                </Button>
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {employees.map((emp) => (
                                        <tr key={emp.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                                                <div className="text-xs text-gray-500">@{emp.username}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.designation}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                                ₹{Number(emp.salary).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${emp.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {emp.status === 'Paid' ? 'Salary Paid' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="grid grid-cols-2 gap-2 max-w-[150px]">
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        onClick={() => handleMarkPaid(emp.id)}
                                                        disabled={emp.status === 'Paid'}
                                                    >
                                                        Paid
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        onClick={() => handleMarkUnpaid(emp.id)}
                                                        disabled={emp.status === 'Pending'}
                                                    >
                                                        Unpaid
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {employees.length === 0 && (
                                        <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No employees found</td></tr>
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

export default SalaryDashboard
