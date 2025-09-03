import { authService } from './authService.js'

export const userService = {
  // Get current user profile
  getProfile: async () => {
    try {
      return await authService.getCurrentUser()
    } catch (error) {
      console.error('Error getting user profile:', error)
      throw error
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      return await authService.updateProfile(profileData)
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      return await authService.changePassword({
        currentPassword,
        newPassword
      })
    } catch (error) {
      console.error('Error changing password:', error)
      throw error
    }
  },

  // Get user preferences (StartGeek specific)
  getPreferences: async () => {
    try {
      const user = await authService.getCurrentUser()
      return user.preferences || {
        theme: 'light',
        notifications: true,
        defaultLocation: 'Arkadelphia, AR',
        refreshInterval: 60,
        dashboardLayout: 'default'
      }
    } catch (error) {
      console.error('Error getting user preferences:', error)
      return {
        theme: 'light',
        notifications: true,
        defaultLocation: 'Arkadelphia, AR',
        refreshInterval: 60,
        dashboardLayout: 'default'
      }
    }
  },

  // Update user preferences
  updatePreferences: async (preferences) => {
    try {
      const currentUser = await authService.getCurrentUser()
      const updatedProfile = {
        ...currentUser,
        preferences: {
          ...currentUser.preferences,
          ...preferences
        }
      }
      return await authService.updateProfile(updatedProfile)
    } catch (error) {
      console.error('Error updating user preferences:', error)
      throw error
    }
  }
}

export default userService