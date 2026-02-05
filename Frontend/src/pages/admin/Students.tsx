import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'

const AdminStudents = () => {
  return (
    <Layout role="admin">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Management</h1>
        <Card title="All Students">
          <p className="text-gray-600">Student list will be displayed here</p>
        </Card>
      </div>
    </Layout>
  )
}

export default AdminStudents
