import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Protected route props interface
 */
interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * ProtectedRoute component
 * Wraps protected pages and redirects unauthenticated users to sign in
 * @param children - Child components to render when authenticated
 * @param fallback - Custom loading component
 */
export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/signin')
    }
  }, [isAuthenticated, isLoading, navigate])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-stone-200 border-t-teal-600 mx-auto"></div>
            <p className="mt-3 text-sm text-stone-500">
              Loading...
            </p>
          </div>
        </div>
      )
    )
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null
  }

  // Render protected content
  return <>{children}</>
}

