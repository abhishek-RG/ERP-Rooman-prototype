import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'

const EmployeePayroll = () => {
  return (
    <Layout role="employee">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Payroll</h1>
        <Card title="Payroll Information">
          <p className="text-gray-600">Payroll details will be displayed here</p>
        </Card>
      </div>
    </Layout>
  )
}

export default EmployeePayroll
