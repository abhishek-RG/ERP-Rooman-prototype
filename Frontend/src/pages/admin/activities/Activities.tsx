import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { activityService } from '../../../services/activityService'
import { Activity, STATUS_CHOICES, PRIORITY_CHOICES } from '../../../types/activity'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import Layout from '../../../components/layout/Layout'

const Activities = () => {
  const navigate = useNavigate()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  })

  useEffect(() => {
    fetchActivities()
  }, [filters])

  const fetchActivities = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await activityService.getActivities(
        1,
        filters.search,
        filters.status,
        filters.priority
      )
      setActivities(data.results)
    } catch (err: any) {
      setError('Failed to load activities')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activityService.deleteActivity(id)
        setActivities((prev) => prev.filter((a) => a.id !== id))
      } catch (err) {
        setError('Failed to delete activity')
      }
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'planned':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 font-bold'
      case 'high':
        return 'text-orange-600 font-semibold'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Layout role="admin">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
          <p className="mt-2 text-gray-600">Manage and track all activities</p>
        </div>
        <Button onClick={() => navigate('/admin/activities/add')}>Add Activity</Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search activities..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Status</option>
              {STATUS_CHOICES.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Priority</option>
              {PRIORITY_CHOICES.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Activities List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : activities.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">No activities found</p>
            <Button
              onClick={() => navigate('/admin/activities/add')}
              className="mt-4"
            >
              Create First Activity
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity.id}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {activity.activity_type_display}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(
                        activity.status
                      )}`}
                    >
                      {activity.status_display}
                    </span>
                    <span className={`text-sm font-medium ${getPriorityColor(activity.priority)}`}>
                      {activity.priority_display}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mb-2">
                    {activity.activity_description.length > 180
                      ? activity.activity_description.slice(0, 180) + '...'
                      : activity.activity_description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Date:</span> {activity.activity_date}
                    </div>
                    <div>
                      <span className="font-medium">Executive:</span>{' '}
                      {activity.executive_details.first_name} {activity.executive_details.last_name}
                    </div>
                    {activity.person_to_contact && (
                      <div>
                        <span className="font-medium">Contact:</span> {activity.person_to_contact}
                      </div>
                    )}
                    {activity.phone_1 && (
                      <div>
                        <span className="font-medium">Phone:</span> {activity.phone_1}
                      </div>
                    )}
                  </div>

                  {activity.feedback && (
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Feedback:</span> {activity.feedback}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 md:flex-col">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/admin/activities/${activity.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(activity.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      </div>
    </Layout>
  )
}

export default Activities
