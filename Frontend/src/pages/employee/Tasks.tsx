import Layout from '../../components/layout/Layout'
import Card from '../../components/ui/Card'

const EmployeeTasks = () => {
  return (
    <Layout role="employee">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Tasks</h1>
        <Card title="Task List">
          <p className="text-gray-600">Tasks will be displayed here</p>
        </Card>
      </div>
    </Layout>
  )
}

export default EmployeeTasks
