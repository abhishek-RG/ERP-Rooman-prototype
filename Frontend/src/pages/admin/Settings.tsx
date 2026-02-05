import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'

const AdminSettings = () => {
  return (
    <Layout role="admin">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">System Settings</h1>
        <Card title="Configuration">
          <p className="text-gray-600">System settings will be displayed here</p>
        </Card>
      </div>
    </Layout>
  )
}

export default AdminSettings
