import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { weatherService } from '../services/weatherService'

const WeatherForecast = () => {
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    fetchForecast()
    // Update forecast every 2 hours
    const interval = setInterval(fetchForecast, 2 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchForecast = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await weatherService.getWeatherWithForecast()

      if (result.success) {
        setForecast(result.forecast)
      } else {
        setForecast(result.forecast) // Fallback data
        setError('Using fallback forecast data')
      }

    } catch (err) {
      console.error('Forecast fetch error:', err)
      setError('Forecast unavailable')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-2xl p-4 min-w-[300px]"
      >
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-2"></div>
          <div className="h-6 bg-white/20 rounded mb-2"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-16 bg-white/20 rounded"></div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  if (error || !forecast) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-2xl p-4 min-w-[300px] text-center"
      >
        <p className="text-red-400 text-sm">7-day forecast unavailable</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-4 min-w-[320px]"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between mb-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium text-white/90">7-Day Forecast</h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-white/70" />
        </motion.div>
      </div>

      {/* Compact view - just today and tomorrow */}
      {!isExpanded && (
        <div className="grid grid-cols-2 gap-3">
          {forecast.slice(0, 2).map((day, index) => (
            <div key={day.date} className="text-center">
              <div className="text-sm text-white/70 mb-1">
                {index === 0 ? 'Today' : 'Tomorrow'}
              </div>
              <div className="text-2xl mb-1">
                {weatherService.getWeatherIconUrl(day.icon)}
              </div>
              <div className="text-sm text-white/90">
                <span className="font-medium">{day.highTemp}°</span>
                <span className="text-white/60 ml-1">{day.lowTemp}°</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expanded view - full 7 days */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        {isExpanded && (
          <div className="grid grid-cols-7 gap-2">
            {forecast.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-xs text-white/70 mb-1">
                  {index === 0 ? 'Today' : day.dayName}
                </div>
                <div className="text-lg mb-1">
                  {weatherService.getWeatherIconUrl(day.icon)}
                </div>
                <div className="text-xs">
                  <div className="font-medium text-white/90">{day.highTemp}°</div>
                  <div className="text-white/60">{day.lowTemp}°</div>
                </div>
                {day.precipitation > 0 && (
                  <div className="text-xs text-blue-400 mt-1">
                    {day.precipitation}"
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>


    </motion.div>
  )
}

export default WeatherForecast