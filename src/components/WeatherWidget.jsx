import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState(null)

  useEffect(() => {
    fetchWeather()
  }, [])

  const fetchWeather = async () => {
    try {
      setLoading(true)

      // Get location from IP
      const locationResponse = await fetch('https://ipapi.co/json/')
      const locationData = await locationResponse.json()

      if (locationData.error) {
        throw new Error('Unable to get location')
      }

      setLocation({
        city: locationData.city,
        region: locationData.region,
        country: locationData.country_name
      })

      // Get weather using OpenWeatherMap (free tier)
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo_key'
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${locationData.latitude}&lon=${locationData.longitude}&appid=${API_KEY}&units=metric`
      )

      if (!weatherResponse.ok) {
        throw new Error('Weather service unavailable')
      }

      const weatherData = await weatherResponse.json()

      setWeather({
        temperature: Math.round(weatherData.main.temp),
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        feelsLike: Math.round(weatherData.main.feels_like)
      })

    } catch (error) {
      console.error('Weather fetch error:', error)

      // Fallback weather data
      setWeather({
        temperature: '--',
        description: 'Weather unavailable',
        icon: '01d',
        humidity: '--',
        windSpeed: '--',
        feelsLike: '--'
      })

      setLocation({
        city: 'Unknown',
        region: '',
        country: ''
      })

      toast.error('Unable to load weather data')
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    }
    return iconMap[iconCode] || '🌤️'
  }

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 mb-8 min-w-[300px]">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-3 text-white">Loading weather...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-6 mb-8 min-w-[300px]">
      <div className="text-center">
        {/* Location */}
        <div className="text-white/80 text-sm mb-2">
          📍 {location?.city}, {location?.region}
        </div>

        {/* Main Weather */}
        <div className="flex items-center justify-center mb-4">
          <div className="text-6xl mr-4">
            {getWeatherIcon(weather?.icon)}
          </div>
          <div>
            <div className="text-4xl font-light text-white">
              {weather?.temperature}°C
            </div>
            <div className="text-white/80 capitalize">
              {weather?.description}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-3 gap-4 text-sm text-white/70">
          <div>
            <div className="font-medium">Feels like</div>
            <div>{weather?.feelsLike}°C</div>
          </div>
          <div>
            <div className="font-medium">Humidity</div>
            <div>{weather?.humidity}%</div>
          </div>
          <div>
            <div className="font-medium">Wind</div>
            <div>{weather?.windSpeed} m/s</div>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchWeather}
          className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-all duration-200"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  )
}

export default WeatherWidget