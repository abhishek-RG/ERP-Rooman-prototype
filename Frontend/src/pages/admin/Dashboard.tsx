import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'

const AdminDashboard = () => {
  return (
    <Layout role="admin">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-primary-600">1,234</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Students</h3>
            <p className="text-3xl font-bold text-green-600">856</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Employees</h3>
            <p className="text-3xl font-bold text-orange-600">345</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Admins</h3>
            <p className="text-3xl font-bold text-blue-600">33</p>
          </Card>
        </div>

        <Card title="System Overview">
          <p className="text-gray-600">System statistics will be displayed here</p>
        </Card>
      </div>
    </Layout>
  )
}

export default AdminDashboard
