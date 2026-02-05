import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'

const EmployeeLeave = () => {
  return (
    <Layout role="employee">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Leave Management</h1>
        <Card title="Leave Requests">
          <p className="text-gray-600">Leave requests will be displayed here</p>
        </Card>
      </div>
    </Layout>
  )
}

export default EmployeeLeave
