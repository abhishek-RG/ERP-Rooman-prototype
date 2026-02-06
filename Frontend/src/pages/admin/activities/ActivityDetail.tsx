import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../../components/layout/Layout'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import LoadingSpinner from '../../../components/ui/LoadingSpinner'
import { activityService } from '../../../services/activityService'
import { Activity } from '../../../types/activity'

const ActivityDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        if (id) {
          const data = await activityService.getActivityById(Number(id))
          setActivity(data)
        }
      } catch (err: any) {
        setError('Failed to load activity')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) {
    return (
      <Layout role="admin">
        <div className="flex justify-center py-24">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  if (error || !activity) {
    return (
      <Layout role="admin">
        <Card>
          <div className="p-6">
            <p className="text-red-600">{error || 'Activity not found'}</p>
            <div className="mt-4">
              <Button onClick={() => navigate('/admin/activities')}>Back to Activities</Button>
            </div>
          </div>
        </Card>
      </Layout>
    )
  }

  return (
    <Layout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{activity.activity_type_display}</h1>
            <p className="text-sm text-gray-500">{activity.activity_date} • {activity.executive_details.first_name} {activity.executive_details.last_name}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/admin/activities')}>Back</Button>
          </div>
        </div>

        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Description</h3>
              <p className="text-gray-800 mt-1">{activity.activity_description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600">Date</h4>
                <p className="text-gray-800 mt-1">{activity.activity_date}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Priority</h4>
                <p className="text-gray-800 mt-1">{activity.priority_display}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600">Status</h4>
                <p className="text-gray-800 mt-1">{activity.status_display}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-600">Contact</h4>
              <p className="text-gray-800 mt-1">{activity.person_to_contact || '—'}</p>
              <p className="text-gray-800 mt-1">{activity.phone_1 || ''}{activity.phone_2 ? `, ${activity.phone_2}` : ''}</p>
            </div>

            {activity.venue && (
              <div>
                <h4 className="text-sm font-medium text-gray-600">Venue</h4>
                <p className="text-gray-800 mt-1">{activity.venue}</p>
              </div>
            )}

            {activity.feedback && (
              <div>
                <h4 className="text-sm font-medium text-gray-600">Feedback</h4>
                <p className="text-gray-800 mt-1">{activity.feedback}</p>
              </div>
            )}

            {activity.remarks && (
              <div>
                <h4 className="text-sm font-medium text-gray-600">Remarks</h4>
                <p className="text-gray-800 mt-1">{activity.remarks}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  )
}

export default ActivityDetail
