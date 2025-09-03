import axios from 'axios'

// baseGeek API configuration
const BASEGEEK_URL = process.env.REACT_APP_BASEGEEK_URL || 'https://basegeek.clintgeek.com'
const APP_NAME = 'startgeek' // StartGeek app name

// Create axios instance with interceptors
const api = axios.create({
  baseURL: BASEGEEK_URL,
  timeout: 10000,
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('geek_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('geek_refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const response = await axios.post(`${BASEGEEK_URL}/api/auth/refresh`, {
          refreshToken,
          app: APP_NAME
        })

        const { token, refreshToken: newRefreshToken } = response.data

        // Update stored tokens
        localStorage.setItem('geek_token', token)
        localStorage.setItem('geek_refresh_token', newRefreshToken)

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, logout user
        authService.logout()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth service using baseGeek
export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        app: APP_NAME
      })

      const { token, refreshToken, user } = response.data

      // Store tokens
      localStorage.setItem('geek_token', token)
      localStorage.setItem('geek_refresh_token', refreshToken)

      return { user, token, refreshToken }
    } catch (error) {
      console.error('Error registering user:', error)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Registration failed'
      throw new Error(errorMessage)
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const requestData = {
        identifier: credentials.identifier,
        password: credentials.password,
        app: APP_NAME
      }
      const response = await api.post('/api/auth/login', requestData)

      const { token, refreshToken, user } = response.data

      // Store tokens
      localStorage.setItem('geek_token', token)
      localStorage.setItem('geek_refresh_token', refreshToken)

      return { user, token, refreshToken }
    } catch (error) {
      console.error('Error logging in:', error)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Login failed'
      throw new Error(errorMessage)
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('geek_token')
      if (!token) {
        throw new Error('No token found')
      }

      const response = await api.get('/api/users/me')
      return response.data
    } catch (error) {
      console.error('Error getting current user:', error)
      throw error
    }
  },

  // Validate token
  validateToken: async () => {
    try {
      const token = localStorage.getItem('geek_token')
      if (!token) {
        return false
      }

      const response = await api.post('/api/auth/validate', {
        token,
        app: APP_NAME
      })

      return response.data.valid
    } catch (error) {
      console.error('Error validating token:', error)
      return false
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('geek_token')
    localStorage.removeItem('geek_refresh_token')
    // Redirect to login or home page
    window.location.href = '/login'
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('geek_token')
    return !!token
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('geek_token')
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/users/profile', profileData)
      return response.data
    } catch (error) {
      console.error('Error updating profile:', error)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Profile update failed'
      throw new Error(errorMessage)
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/api/users/password', passwordData)
      return response.data
    } catch (error) {
      console.error('Error changing password:', error)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Password change failed'
      throw new Error(errorMessage)
    }
  }
}

export default authService