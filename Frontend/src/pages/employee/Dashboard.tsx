import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'

const EmployeeDashboard = () => {
  return (
    <Layout role="employee">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Employee Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Tasks</h3>
            <p className="text-3xl font-bold text-primary-600">8</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Attendance</h3>
            <p className="text-3xl font-bold text-green-600">95%</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Leave Balance</h3>
            <p className="text-3xl font-bold text-orange-600">12 Days</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Performance</h3>
            <p className="text-3xl font-bold text-blue-600">4.5/5</p>
          </Card>
        </div>

        <Card title="Recent Activities">
          <p className="text-gray-600">No recent activities</p>
        </Card>
      </div>
    </Layout>
  )
}

export default EmployeeDashboard
