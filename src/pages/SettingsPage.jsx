import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Palette,
  Clock,
  Globe,
  Bell,
  Shield,
  Database,
  Save,
  RotateCcw
} from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    theme: 'auto',
    clockFormat: '12h',
    weatherLocation: 'Arkadelphia, AR 71923',
    weatherUnit: 'fahrenheit',
    backgroundRefresh: 30,
    notifications: true,
    aiAssistant: true,
    monitoringInterval: 60
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = 'http://localhost:3001/api'

  // Load settings from API on component mount
  useEffect(() => {
    loadSettingsFromAPI()
  }, [])

  const loadSettingsFromAPI = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/settings`)

      if (response.data.success) {
        setSettings(response.data.data)
      }
    } catch (error) {
      console.error('Error loading settings from API:', error)
      toast.error('Failed to load settings from server, using defaults')

      // Fallback to localStorage if API fails
      try {
        const saved = localStorage.getItem('startgeek-settings')
        if (saved) {
          setSettings(JSON.parse(saved))
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError)
      }
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const saveSettings = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/settings`, settings)

      if (response.data.success) {
        setHasChanges(false)
        toast.success('Settings saved successfully!')

        // Also save to localStorage as backup
        localStorage.setItem('startgeek-settings', JSON.stringify(settings))
      } else {
        throw new Error(response.data.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings to server')

      // Fallback to localStorage
      try {
        localStorage.setItem('startgeek-settings', JSON.stringify(settings))
        setHasChanges(false)
        toast.success('Settings saved locally')
      } catch (localError) {
        toast.error('Failed to save settings')
      }
    }
  }

  const resetSettings = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/settings`)

      if (response.data.success) {
        setSettings(response.data.data)
        setHasChanges(false)
        toast.success('Settings reset to defaults')

        // Also update localStorage
        localStorage.setItem('startgeek-settings', JSON.stringify(response.data.data))
      } else {
        throw new Error(response.data.error || 'Failed to reset settings')
      }
    } catch (error) {
      console.error('Error resetting settings:', error)
      toast.error('Failed to reset settings on server')

      // Fallback to local reset
      const defaultSettings = {
        theme: 'auto',
        clockFormat: '12h',
        weatherLocation: 'Arkadelphia, AR 71923',
        weatherUnit: 'fahrenheit',
        backgroundRefresh: 30,
        notifications: true,
        aiAssistant: true,
        monitoringInterval: 60
      }
      setSettings(defaultSettings)
      localStorage.setItem('startgeek-settings', JSON.stringify(defaultSettings))
      setHasChanges(false)
      toast.success('Settings reset locally')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Loading settings...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-light text-shadow mb-2">Settings</h1>
            <p className="text-white/70">Customize your StartGeek experience</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={resetSettings}
              className="glass rounded-xl px-4 py-2 hover:bg-white/20 transition-all duration-200 flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>

            <button
              onClick={saveSettings}
              disabled={!hasChanges}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl px-4 py-2 transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Appearance */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Palette className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-medium">Appearance</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSetting('theme', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="auto">Auto (System)</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Background Refresh (minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={settings.backgroundRefresh}
                  onChange={(e) => updateSetting('backgroundRefresh', parseInt(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          </motion.section>

          {/* Time & Date */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-medium">Time & Date</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Clock Format
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="12h"
                    checked={settings.clockFormat === '12h'}
                    onChange={(e) => updateSetting('clockFormat', e.target.value)}
                    className="text-blue-400"
                  />
                  <span>12 Hour</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="24h"
                    checked={settings.clockFormat === '24h'}
                    onChange={(e) => updateSetting('clockFormat', e.target.value)}
                    className="text-blue-400"
                  />
                  <span>24 Hour</span>
                </label>
              </div>
            </div>
          </motion.section>

          {/* Weather */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Globe className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-xl font-medium">Weather</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={settings.weatherLocation}
                  onChange={(e) => updateSetting('weatherLocation', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  placeholder="City, State or ZIP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Temperature Unit
                </label>
                <select
                  value={settings.weatherUnit}
                  onChange={(e) => updateSetting('weatherUnit', e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="fahrenheit">Fahrenheit (°F)</option>
                  <option value="celsius">Celsius (°C)</option>
                </select>
              </div>
            </div>
          </motion.section>

          {/* System */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Database className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-xl font-medium">System</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white/90">Notifications</h3>
                  <p className="text-sm text-white/60">Show system alerts and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => updateSetting('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white/90">AI Assistant</h3>
                  <p className="text-sm text-white/60">Enable AI chat widget</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.aiAssistant}
                    onChange={(e) => updateSetting('aiAssistant', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Monitoring Interval (seconds)
                </label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  value={settings.monitoringInterval}
                  onChange={(e) => updateSetting('monitoringInterval', parseInt(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-400"
                />
              </div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  )
}

export default SettingsPage