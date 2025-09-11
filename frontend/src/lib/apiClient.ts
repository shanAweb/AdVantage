/**
 * API Client for handling HTTP requests
 * Provides centralized request handling with authentication and error management
 */

/**
 * API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    details?: any
  }
  timestamp?: string
}

/**
 * API client configuration
 */
interface ApiClientConfig {
  baseURL: string
  timeout?: number
}

/**
 * Request options interface
 */
interface RequestOptions extends RequestInit {
  timeout?: number
}

/**
 * API Client class
 */
class ApiClient {
  private baseURL: string
  private timeout: number

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout || 10000
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    
    try {
      const tokens = localStorage.getItem('tokens')
      if (tokens) {
        const parsedTokens = JSON.parse(tokens)
        return parsedTokens.accessToken || null
      }
    } catch (error) {
      console.error('Error getting auth token:', error)
    }
    return null
  }

  /**
   * Create headers with authentication
   */
  private createHeaders(customHeaders: HeadersInit = {}): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(customHeaders as Record<string, string>),
    }

    const token = this.getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')

    let data: any
    try {
      data = isJson ? await response.json() : await response.text()
    } catch (error) {
      throw new Error('Failed to parse response')
    }

    if (!response.ok) {
      const errorMessage = data?.error?.message || data?.message || `HTTP ${response.status}: ${response.statusText}`
      throw new Error(errorMessage)
    }

    return data
  }

  /**
   * Make HTTP request with timeout
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { timeout = this.timeout, ...fetchOptions } = options
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...fetchOptions,
        headers: this.createHeaders(fetchOptions.headers),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return await this.handleResponse<T>(response)
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout')
        }
        throw error
      }
      
      throw new Error('Network error')
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }

  /**
   * Upload file
   */
  async upload<T>(endpoint: string, file: File, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    const token = this.getAuthToken()
    const uploadHeaders: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    }
    
    if (token) {
      uploadHeaders.Authorization = `Bearer ${token}`
    }

    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: uploadHeaders,
    })
  }
}

/**
 * Create API client instance
 */
const createApiClient = (): ApiClient => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  
  return new ApiClient({
    baseURL,
    timeout: 10000,
  })
}

/**
 * Default API client instance
 */
export const apiClient = createApiClient()

/**
 * Auth API methods
 */
export const authApi = {
  /**
   * Login user
   */
  login: (credentials: { email: string; password: string }) =>
    apiClient.post<{ user: any; tokens: any }>('/auth/login', credentials),

  /**
   * Register user
   */
  register: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    company?: string
  }) =>
    apiClient.post<{ user: any; tokens: any }>('/auth/register', userData),

  /**
   * Forgot password
   */
  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  /**
   * Reset password
   */
  resetPassword: (data: { token: string; password: string }) =>
    apiClient.post('/auth/reset-password', data),

  /**
   * Refresh token
   */
  refreshToken: (refreshToken: string) =>
    apiClient.post<{ accessToken: string }>('/auth/refresh', { refreshToken }),

  /**
   * Logout
   */
  logout: (refreshToken: string) =>
    apiClient.post('/auth/logout', { refreshToken }),
}

/**
 * User API methods
 */
export const userApi = {
  /**
   * Get user profile
   */
  getProfile: () =>
    apiClient.get('/users/profile'),

  /**
   * Update user profile
   */
  updateProfile: (data: any) =>
    apiClient.put('/users/profile', data),

  /**
   * Change password
   */
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put('/users/change-password', data),

  /**
   * Get user stats
   */
  getStats: () =>
    apiClient.get('/users/stats'),
}

/**
 * Campaign API methods
 */
export const campaignApi = {
  /**
   * Get campaigns
   */
  getCampaigns: (params?: any) =>
    apiClient.get('/campaigns', { ...params }),

  /**
   * Get campaign by ID
   */
  getCampaign: (id: string) =>
    apiClient.get(`/campaigns/${id}`),

  /**
   * Create campaign
   */
  createCampaign: (data: any) =>
    apiClient.post('/campaigns', data),

  /**
   * Update campaign
   */
  updateCampaign: (id: string, data: any) =>
    apiClient.put(`/campaigns/${id}`, data),

  /**
   * Delete campaign
   */
  deleteCampaign: (id: string) =>
    apiClient.delete(`/campaigns/${id}`),

  /**
   * Launch campaign
   */
  launchCampaign: (id: string) =>
    apiClient.post(`/campaigns/${id}/launch`),

  /**
   * Pause campaign
   */
  pauseCampaign: (id: string) =>
    apiClient.post(`/campaigns/${id}/pause`),

  /**
   * Resume campaign
   */
  resumeCampaign: (id: string) =>
    apiClient.post(`/campaigns/${id}/resume`),
}

/**
 * Analytics API methods
 */
export const analyticsApi = {
  /**
   * Get dashboard stats
   */
  getDashboardStats: (params?: any) =>
    apiClient.get('/analytics/dashboard', { ...params }),

  /**
   * Get campaign analytics
   */
  getCampaignAnalytics: (params?: any) =>
    apiClient.get('/analytics/campaigns', { ...params }),

  /**
   * Get platform analytics
   */
  getPlatformAnalytics: (platform: string, params?: any) =>
    apiClient.get('/analytics/platforms', { ...params, platform }),

  /**
   * Export analytics
   */
  exportAnalytics: (params?: any) =>
    apiClient.get('/analytics/export', { ...params }),
}

/**
 * Feed API methods
 */
export const feedApi = {
  /**
   * Create feed
   */
  createFeed: (data: {
    name: string
    siteUrl: string
    country?: string
    currency?: string
    selectorConfig?: any
  }) =>
    apiClient.post('/feeds', data),

  /**
   * Get feeds
   */
  getFeeds: (params?: any) =>
    apiClient.get('/feeds', { ...params }),

  /**
   * Get feed by ID
   */
  getFeed: (id: string) =>
    apiClient.get(`/feeds/${id}`),

  /**
   * Update feed
   */
  updateFeed: (id: string, data: any) =>
    apiClient.put(`/feeds/${id}`, data),

  /**
   * Delete feed
   */
  deleteFeed: (id: string) =>
    apiClient.delete(`/feeds/${id}`),

  /**
   * Refresh feed
   */
  refreshFeed: (id: string) =>
    apiClient.post(`/feeds/${id}/refresh`),

  /**
   * Get feed products
   */
  getFeedProducts: (id: string, params?: any) =>
    apiClient.get(`/feeds/${id}/products`, { ...params }),

  /**
   * Download feed
   */
  downloadFeed: (id: string, format: string = 'json') =>
    apiClient.get(`/feeds/${id}/download?format=${format}`),

  /**
   * Get public feed
   */
  getPublicFeed: (token: string, format: string = 'json') =>
    apiClient.get(`/feeds/public/${token}?format=${format}`),
}

/**
 * Ad API methods
 */
export const adApi = {
  /**
   * Create ad
   */
  createAd: (data: {
    feedId: string
    productId: string
    headline?: string
    description?: string
  }) =>
    apiClient.post('/ads', data),

  /**
   * Bulk create ads
   */
  bulkCreateAds: (data: {
    feedId: string
    productIds: string[]
    headlineTemplate?: string
    descriptionTemplate?: string
  }) =>
    apiClient.post('/ads/bulk', data),

  /**
   * Get ads
   */
  getAds: (params?: any) =>
    apiClient.get('/ads', { ...params }),

  /**
   * Get ad by ID
   */
  getAd: (id: string) =>
    apiClient.get(`/ads/${id}`),

  /**
   * Update ad
   */
  updateAd: (id: string, data: any) =>
    apiClient.put(`/ads/${id}`, data),

  /**
   * Delete ad
   */
  deleteAd: (id: string) =>
    apiClient.delete(`/ads/${id}`),
}

/**
 * New Campaign API methods
 */
export const newCampaignApi = {
  /**
   * Create campaign
   */
  createCampaign: (data: {
    feedId: string
    name: string
    channel: string
    budget: number
    currency?: string
    country: string
    adIds?: string[]
  }) =>
    apiClient.post('/new-campaigns', data),

  /**
   * Get campaigns
   */
  getCampaigns: (params?: any) =>
    apiClient.get('/new-campaigns', { ...params }),

  /**
   * Get campaign by ID
   */
  getCampaign: (id: string) =>
    apiClient.get(`/new-campaigns/${id}`),

  /**
   * Update campaign
   */
  updateCampaign: (id: string, data: any) =>
    apiClient.put(`/new-campaigns/${id}`, data),

  /**
   * Delete campaign
   */
  deleteCampaign: (id: string) =>
    apiClient.delete(`/new-campaigns/${id}`),

  /**
   * Add ads to campaign
   */
  addAdsToCampaign: (id: string, adIds: string[]) =>
    apiClient.post(`/new-campaigns/${id}/ads`, { adIds }),

  /**
   * Remove ads from campaign
   */
  removeAdsFromCampaign: (id: string, adIds: string[]) =>
    apiClient.delete(`/new-campaigns/${id}/ads?adIds=${adIds.join(',')}`),

  /**
   * Launch campaign
   */
  launchCampaign: (id: string) =>
    apiClient.post(`/new-campaigns/${id}/launch`),

  /**
   * Pause campaign
   */
  pauseCampaign: (id: string) =>
    apiClient.post(`/new-campaigns/${id}/pause`),
}

export default apiClient
