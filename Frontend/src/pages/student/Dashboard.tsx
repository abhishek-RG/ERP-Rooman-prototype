import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'

const StudentDashboard = () => {
  return (
    <Layout role="student">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Courses</h3>
            <p className="text-3xl font-bold text-primary-600">6</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Attendance</h3>
            <p className="text-3xl font-bold text-green-600">92%</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Assignments</h3>
            <p className="text-3xl font-bold text-orange-600">3 Pending</p>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">GPA</h3>
            <p className="text-3xl font-bold text-blue-600">3.8</p>
          </Card>
        </div>

        <Card title="Recent Activities">
          <p className="text-gray-600">No recent activities</p>
        </Card>
      </div>
    </Layout>
  )
}

export default StudentDashboard
