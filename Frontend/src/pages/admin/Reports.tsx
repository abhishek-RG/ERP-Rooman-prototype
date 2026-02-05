import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'

const AdminReports = () => {
  return (
    <Layout role="admin">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>
        <Card title="Generate Reports">
          <p className="text-gray-600">Report generation options will be displayed here</p>
        </Card>
      </div>
    </Layout>
  )
}

export default AdminReports
