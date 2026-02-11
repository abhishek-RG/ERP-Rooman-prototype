import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      navigate(`/${user.role}/dashboard`)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">ERP Rooman System</h1>
          <p className="text-primary-100">Sign in to your account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              placeholder="Enter your username"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              placeholder="Enter your password"
            />

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center">
              <Link
                to="/register"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Don't have an account? Register here
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default Login
