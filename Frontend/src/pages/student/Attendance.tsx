import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'

const StudentAttendance = () => {
  return (
    <Layout role="student">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Attendance</h1>
        <Card title="Attendance Records">
          <p className="text-gray-600">Attendance records will be displayed here</p>
        </Card>
      </div>
    </Layout>
  )
}

export default StudentAttendance
