import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { authApi } from '@/lib/apiClient'
import toast from 'react-hot-toast'

/**
 * Auto-login component for development/testing
 * Automatically logs in a test user if no user is authenticated
 */
export default function AutoLogin() {
  const { isAuthenticated, login } = useAuth()
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false)

  useEffect(() => {
    const autoLogin = async () => {
      // Only auto-login if user is not authenticated
      if (!isAuthenticated && !isAutoLoggingIn) {
        setIsAutoLoggingIn(true)
        
        try {
          // Try to login with test credentials
          await login({
            email: 'test@example.com',
            password: 'password123'
          })
          
          toast.success('Auto-logged in as test user')
        } catch (error) {
          console.log('Auto-login failed, user needs to login manually')
          // Don't show error toast for auto-login failure
        } finally {
          setIsAutoLoggingIn(false)
        }
      }
    }

    // Small delay to ensure auth context is initialized
    const timer = setTimeout(autoLogin, 1000)
    return () => clearTimeout(timer)
  }, [isAuthenticated, login, isAutoLoggingIn])

  // Don't render anything
  return null
}


