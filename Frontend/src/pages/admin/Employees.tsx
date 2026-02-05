import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'

const AdminEmployees = () => {
  return (
    <Layout role="admin">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Employee Management</h1>
        <Card title="All Employees">
          <p className="text-gray-600">Employee list will be displayed here</p>
        </Card>
      </div>
    </Layout>
  )
}

export default AdminEmployees
