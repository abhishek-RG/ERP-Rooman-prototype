import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'

const StudentAssignments = () => {
  return (
    <Layout role="student">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Assignments</h1>
        <Card title="All Assignments">
          <p className="text-gray-600">Assignment list will be displayed here</p>
        </Card>
      </div>
    </Layout>
  )
}

export default StudentAssignments
