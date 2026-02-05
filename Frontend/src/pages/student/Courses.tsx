import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'

const StudentCourses = () => {
  return (
    <Layout role="student">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Courses</h1>
        <Card title="Enrolled Courses">
          <p className="text-gray-600">Course list will be displayed here</p>
        </Card>
      </div>
    </Layout>
  )
}

export default StudentCourses
