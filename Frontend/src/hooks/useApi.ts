import { useState, useEffect } from 'react'
import api from '../services/api'
import { ApiError } from '../types'

interface UseApiOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  data?: any
  immediate?: boolean
}

interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
  execute: () => Promise<void>
}

export function useApi<T = any>({
  url,
  method = 'GET',
  data,
  immediate = true,
}: UseApiOptions): UseApiReturn<T> {
  const [response, setResponse] = useState<T | null>(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState<ApiError | null>(null)

  const execute = async () => {
    try {
      setLoading(true)
      setError(null)

      let result
      switch (method) {
        case 'GET':
          result = await api.get(url)
          break
        case 'POST':
          result = await api.post(url, data)
          break
        case 'PUT':
          result = await api.put(url, data)
          break
        case 'PATCH':
          result = await api.patch(url, data)
          break
        case 'DELETE':
          result = await api.delete(url)
          break
      }

      setResponse(result.data)
    } catch (err: any) {
      setError({
        message: err.response?.data?.message || err.message || 'An error occurred',
        errors: err.response?.data?.errors,
        status: err.response?.status,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [url])

  return { data: response, loading, error, execute }
}
