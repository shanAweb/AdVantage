import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '@/lib/apiClient'

/**
 * User interface for authentication
 */
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  company?: string
  phone?: string
  timezone?: string
  subscription?: {
    id: string
    planId: string
    status: string
    currentPeriodStart: string
    currentPeriodEnd: string
  }
  createdAt: string
  updatedAt: string
}

/**
 * Authentication tokens interface
 */
export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * Signup credentials interface
 */
export interface SignupCredentials {
  email: string
  password: string
  firstName: string
  lastName: string
  company?: string
}

/**
 * Forgot password request interface
 */
export interface ForgotPasswordRequest {
  email: string
}

/**
 * Auth context interface
 */
interface AuthContextType {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: SignupCredentials) => Promise<void>
  logout: () => void
  forgotPassword: (request: ForgotPasswordRequest) => Promise<void>
  refreshToken: () => Promise<void>
}

/**
 * Auth context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Auth provider props interface
 */
interface AuthProviderProps {
  children: ReactNode
}

/**
 * Auth provider component
 * Manages authentication state and provides auth methods
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!user && !!tokens

  /**
   * Save user and tokens to localStorage
   */
  const saveAuthData = (userData: User, authTokens: AuthTokens) => {
    // Update state
    setUser(userData)
    setTokens(authTokens)

    // Save to localStorage with error handling
    try {
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('tokens', JSON.stringify(authTokens))
      console.log('Auth data saved successfully')
    } catch (error) {
      console.error('Error saving auth data:', error)
      // Even if storage fails, we keep the in-memory state
    }
  }

  /**
   * Clear authentication data
   */
  const clearAuthData = () => {
    setUser(null)
    setTokens(null)
    localStorage.removeItem('user')
    localStorage.removeItem('tokens')
  }

  /**
   * Load user from localStorage on mount
   */
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user')
        const storedTokens = localStorage.getItem('tokens')
        
        if (storedUser && storedTokens) {
          setUser(JSON.parse(storedUser))
          setTokens(JSON.parse(storedTokens))
        }
      } catch (error) {
        console.error('Error loading user:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('tokens')
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  /**
   * Login user
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      
      const response = await authApi.login(credentials)

      if (response.success && response.data) {
        saveAuthData(response.data.user, response.data.tokens)
        toast.success('Login successful!')
        navigate('/dashboard')
      } else {
        throw new Error(response.error?.message || 'Login failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Signup user
   */
  const signup = async (credentials: SignupCredentials) => {
    try {
      setIsLoading(true)
      
      const response = await authApi.register(credentials)

      if (response.success && response.data) {
        saveAuthData(response.data.user, response.data.tokens)
        toast.success('Account created successfully!')
        navigate('/dashboard')
      } else {
        throw new Error(response.error?.message || 'Signup failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      if (tokens?.refreshToken) {
        await authApi.logout(tokens.refreshToken)
      }
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      clearAuthData()
      toast.success('Logged out successfully')
      navigate('/signin')
    }
  }

  /**
   * Forgot password
   */
  const forgotPassword = async (request: ForgotPasswordRequest) => {
    try {
      setIsLoading(true)
      const response = await authApi.forgotPassword(request.email)

      if (response.success) {
        toast.success('Password reset email sent!')
      } else {
        throw new Error(response.error?.message || 'Failed to send reset email')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Refresh access token
   */
  const refreshToken = async () => {
    try {
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await authApi.refreshToken(tokens.refreshToken)

      if (response.success && response.data) {
        const newTokens = {
          ...tokens,
          accessToken: response.data.accessToken,
        }
        setTokens(newTokens)
        localStorage.setItem('tokens', JSON.stringify(newTokens))
      } else {
        throw new Error(response.error?.message || 'Token refresh failed')
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      clearAuthData()
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    tokens,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    forgotPassword,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
