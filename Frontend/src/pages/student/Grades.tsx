import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'

const StudentGrades = () => {
  return (
    <Layout role="student">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Grades</h1>
        <Card title="Grade Report">
          <p className="text-gray-600">Grades will be displayed here</p>
        </Card>
      </div>
    </Layout>
  )
}

export default StudentGrades
