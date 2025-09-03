import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Eye, Thermometer } from 'lucide-react'
import { weatherService } from '../services/weatherService'

const Weather = () => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchWeather()
    // Update weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchWeather = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get weather using our weather service
      const result = await weatherService.getCurrentWeather()

      if (result.success) {
        setWeather(result.data)
      } else {
        setWeather(result.data) // Fallback data
        setError('Using fallback weather data')
      }

    } catch (err) {
      console.error('Weather fetch error:', err)

      // Final fallback
      setWeather({
        temperature: 72,
        condition: 'Clear',
        description: 'clear sky',
        location: 'Unknown Location',
        humidity: 65,
        windSpeed: 8,
        windDirection: 180,
        icon: 'sunny',
        pressure: 1013,
        feelsLike: 75,
        precipitation: 0,
        timestamp: new Date().toISOString()
      })

      setError('Weather service unavailable')
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-8 h-8" />
      case 'cloudy':
      case 'overcast':
        return <Cloud className="w-8 h-8" />
      case 'rainy':
      case 'rain':
        return <CloudRain className="w-8 h-8" />
      case 'snowy':
      case 'snow':
        return <CloudSnow className="w-8 h-8" />
      default:
        return <Cloud className="w-8 h-8" />
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-2xl p-6 min-w-[300px]"
      >
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="h-8 bg-white/20 rounded mb-2"></div>
          <div className="h-4 bg-white/20 rounded"></div>
        </div>
      </motion.div>
    )
  }

  if (error || !weather) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-2xl p-6 min-w-[300px] text-center"
      >
        <p className="text-red-400">Weather unavailable</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-6 min-w-[320px]"
    >
      {/* Header with location and condition */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-white/90">{weather.location}</h3>
          <p className="text-sm text-white/70 capitalize">{weather.description || weather.condition}</p>
        </div>
        <div className="text-white/80">
          {weather.icon ? (
            <div className="text-4xl">
              {weatherService.getWeatherIconUrl(weather.icon)}
            </div>
          ) : (
            getWeatherIcon(weather.condition)
          )}
        </div>
      </div>

      {/* Main temperature display */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl font-light">
          {weather.temperature}°F
        </div>

        {weather.feelsLike && (
          <div className="text-right text-sm text-white/70">
            <div className="flex items-center space-x-1">
              <Thermometer className="w-4 h-4" />
              <span>Feels {weather.feelsLike}°F</span>
            </div>
          </div>
        )}
      </div>

      {/* Weather details grid - simplified */}
      <div className="grid grid-cols-2 gap-3 text-sm text-white/70">
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4" />
          <span>{weather.windSpeed} mph</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-blue-400">💧</span>
          <span>{weather.humidity}%</span>
        </div>
      </div>
    </motion.div>
  )
}

export default Weather