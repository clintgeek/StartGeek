import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Calendar, RotateCcw } from 'lucide-react'
import { weatherService } from '../services/weatherService'

const CombinedWeather = () => {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForecast, setShowForecast] = useState(false)

  useEffect(() => {
    fetchWeatherData()
    // Update weather every 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchWeatherData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get both current weather and forecast
      const result = await weatherService.getWeatherWithForecast()

      if (result.success) {
        setCurrentWeather(result.current)
        setForecast(result.forecast)
      } else {
        setCurrentWeather(result.current) // Fallback data
        setForecast(result.forecast) // Fallback data
        setError('Using fallback weather data')
      }

    } catch (err) {
      console.error('Weather fetch error:', err)

      // Final fallback
      setCurrentWeather({
        temperature: 72,
        condition: 'Clear',
        description: 'clear sky',
        location: 'Arkadelphia, AR',
        humidity: 65,
        windSpeed: 8,
        windDirection: 180,
        icon: 'sunny',
        pressure: 1013,
        feelsLike: 75,
        precipitation: 0,
        precipitationProbability: 15,
        lat: 34.1201,
        lon: -93.0532,
        timestamp: new Date().toISOString()
      })

      // Fallback forecast
      const fallbackForecast = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() + i)
        return {
          date: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          highTemp: 75 + Math.floor(Math.random() * 10),
          lowTemp: 60 + Math.floor(Math.random() * 10),
          condition: 'Clear',
          description: 'clear sky',
          icon: 'sunny',
          precipitation: 0,
          windSpeed: 8,
          location: 'Unknown Location'
        }
      })
      setForecast(fallbackForecast)

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
        className="glass rounded-2xl p-6 w-[320px] h-[220px]"
      >
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="h-8 bg-white/20 rounded mb-2"></div>
          <div className="h-4 bg-white/20 rounded"></div>
        </div>
      </motion.div>
    )
  }

  if (error && !currentWeather) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-2xl p-6 w-[320px] h-[220px] flex items-center justify-center"
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
      className="glass rounded-2xl p-6 w-[320px] h-[220px] relative"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setShowForecast(!showForecast)}
        className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 z-10"
        title={showForecast ? 'Show Current Weather' : 'Show 7-Day Forecast'}
      >
        {showForecast ? (
          <RotateCcw className="w-4 h-4 text-white/70" />
        ) : (
          <Calendar className="w-4 h-4 text-white/70" />
        )}
      </button>

      {/* Content Container - Fixed Height */}
      <div className="h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {!showForecast ? (
            // Current Weather View
            <motion.div
              key="current"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              {/* Header with location and condition */}
              <div className="mb-3 pr-12">
                <h3 className="text-lg font-medium text-white/90 truncate">
                  {currentWeather.location}
                </h3>
                <p className="text-sm text-white/70 capitalize truncate">
                  {currentWeather.description || currentWeather.condition}
                </p>
              </div>

              {/* Main temperature display */}
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl font-light">
                  {currentWeather.temperature}°F
                </div>

                {currentWeather.feelsLike && (
                  <div className="text-right text-sm text-white/70 mt-1">
                    <div className="flex items-center space-x-1 mb-1">
                      <Thermometer className="w-4 h-4" />
                      <span>Feels {currentWeather.feelsLike}°F</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-400">💧</span>
                      <span>Humidity {currentWeather.humidity}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Weather details and source */}
              <div className="mt-auto">
                {/* Weather details grid */}
                <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                  <div className="flex items-center space-x-2 flex-1">
                    <Wind className="w-4 h-4" />
                    <span>{currentWeather.windSpeed} mph</span>
                  </div>

                  <div className="flex items-center space-x-2 flex-[2] justify-center pl-4">
                    <span className="text-blue-300">🌧️</span>
                    <span>{currentWeather.precipitationProbability || 0}% rain chance</span>
                  </div>

                  <div className="flex items-center justify-end flex-[0.8]">
                    {currentWeather.icon ? (
                      <div className="text-lg">
                        {weatherService.getWeatherIconUrl(currentWeather.icon)}
                      </div>
                    ) : (
                      <div className="text-white/80">
                        {getWeatherIcon(currentWeather.condition)}
                      </div>
                    )}
                  </div>
                </div>


              </div>
            </motion.div>
          ) : (
            // 7-Day Forecast View
            <motion.div
              key="forecast"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              {/* Header */}
              <div className="mb-4 pr-12">
                <h3 className="text-lg font-medium text-white/90">7-Day Forecast</h3>
                <p className="text-sm text-white/70">
                  {forecast && forecast[0] ? forecast[0].location : 'Loading...'}
                </p>
              </div>

              {/* Forecast Grid */}
              <div className="flex-1 overflow-hidden">
                {forecast && forecast.length > 0 ? (
                  <div className="grid grid-cols-7 gap-1 h-full">
                    {forecast.map((day, index) => (
                      <div key={day.date} className="text-center flex flex-col justify-between">
                        <div className="text-xs text-white/70 mb-1">
                          {index === 0 ? 'Today' : day.dayName}
                        </div>
                        <div className="text-sm mb-1 flex-1 flex items-center justify-center">
                          {weatherService.getWeatherIconUrl(day.icon)}
                        </div>
                        <div className="text-xs">
                          <div className="font-medium text-white/90">{day.highTemp}°</div>
                          <div className="text-white/60">{day.lowTemp}°</div>
                        </div>
                        <div className="text-xs text-blue-400 mt-1">
                          {day.precipitation > 0 ? `${day.precipitation.toFixed(1)}"` : '0.0"'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-white/70">
                    Loading forecast...
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default CombinedWeather