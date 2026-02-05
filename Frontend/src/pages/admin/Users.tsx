import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'

const AdminUsers = () => {
  return (
    <Layout role="admin">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>
        <Card title="All Users">
          <p className="text-gray-600">User list will be displayed here</p>
        </Card>
      </div>
    </Layout>
  )
}

export default AdminUsers
