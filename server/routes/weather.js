import express from 'express'
import axios from 'axios'
import mongoose from 'mongoose'

const router = express.Router()

// Weather cache schema
const weatherCacheSchema = new mongoose.Schema({
  location: { type: String, required: true, index: true },
  data: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now, expires: 1800 } // 30 minutes TTL
})

const WeatherCache = mongoose.model('WeatherCache', weatherCacheSchema)

// GET /api/weather/:location - Get weather for location
router.get('/:location', async (req, res) => {
  try {
    const { location } = req.params
    const { units = 'imperial' } = req.query // imperial = Fahrenheit, metric = Celsius

    if (!location) {
      return res.status(400).json({
        success: false,
        error: 'Location is required'
      })
    }

    // Check cache first
    const cached = await WeatherCache.findOne({ location })
    if (cached && (Date.now() - cached.timestamp.getTime()) < 1800000) { // 30 minutes
      return res.json({
        success: true,
        data: cached.data,
        cached: true,
        timestamp: cached.timestamp
      })
    }

    // Fetch from OpenWeatherMap API
    const apiKey = process.env.WEATHER_API_KEY
    if (!apiKey) {
      // Return mock data if no API key
      const mockWeather = {
        temperature: units === 'metric' ? 22 : 72,
        condition: 'Partly Cloudy',
        location: location,
        humidity: 65,
        windSpeed: units === 'metric' ? 15 : 8,
        windDirection: 'SW',
        pressure: 1013,
        visibility: units === 'metric' ? 16 : 10,
        uvIndex: 6,
        icon: 'partly-cloudy',
        forecast: [
          {
            day: 'Today',
            high: units === 'metric' ? 25 : 77,
            low: units === 'metric' ? 18 : 64,
            condition: 'Partly Cloudy',
            icon: 'partly-cloudy'
          },
          {
            day: 'Tomorrow',
            high: units === 'metric' ? 28 : 82,
            low: units === 'metric' ? 20 : 68,
            condition: 'Sunny',
            icon: 'sunny'
          }
        ]
      }

      return res.json({
        success: true,
        data: mockWeather,
        mock: true
      })
    }

    // Call OpenWeatherMap API
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=${units}`
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${apiKey}&units=${units}`

    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(currentWeatherUrl),
      axios.get(forecastUrl)
    ])

    const current = currentResponse.data
    const forecast = forecastResponse.data

    // Format weather data
    const weatherData = {
      temperature: Math.round(current.main.temp),
      condition: current.weather[0].description.replace(/\b\w/g, l => l.toUpperCase()),
      location: `${current.name}, ${current.sys.country}`,
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed),
      windDirection: getWindDirection(current.wind.deg),
      pressure: current.main.pressure,
      visibility: Math.round((current.visibility || 10000) / 1000),
      uvIndex: 0, // UV index requires separate API call
      icon: getWeatherIcon(current.weather[0].icon),
      forecast: formatForecast(forecast.list, units)
    }

    // Cache the result
    await WeatherCache.findOneAndUpdate(
      { location },
      { location, data: weatherData, timestamp: new Date() },
      { upsert: true, new: true }
    )

    res.json({
      success: true,
      data: weatherData,
      cached: false
    })

  } catch (error) {
    console.error('Weather API error:', error)

    // Return cached data if available, even if expired
    const cached = await WeatherCache.findOne({ location: req.params.location })
    if (cached) {
      return res.json({
        success: true,
        data: cached.data,
        cached: true,
        stale: true,
        timestamp: cached.timestamp
      })
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch weather data'
    })
  }
})

// GET /api/weather - Get weather for default location
router.get('/', async (req, res) => {
  const defaultLocation = process.env.WEATHER_DEFAULT_LOCATION || 'Mansfield,TX,US'
  req.params.location = defaultLocation
  return router.handle(req, res)
})

// Helper functions
function getWindDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

function getWeatherIcon(openWeatherIcon) {
  const iconMap = {
    '01d': 'sunny',
    '01n': 'clear-night',
    '02d': 'partly-cloudy',
    '02n': 'partly-cloudy-night',
    '03d': 'cloudy',
    '03n': 'cloudy',
    '04d': 'overcast',
    '04n': 'overcast',
    '09d': 'rain',
    '09n': 'rain',
    '10d': 'rain',
    '10n': 'rain',
    '11d': 'thunderstorm',
    '11n': 'thunderstorm',
    '13d': 'snow',
    '13n': 'snow',
    '50d': 'fog',
    '50n': 'fog'
  }

  return iconMap[openWeatherIcon] || 'partly-cloudy'
}

function formatForecast(forecastList, units) {
  const dailyForecasts = {}

  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000)
    const day = date.toLocaleDateString('en-US', { weekday: 'long' })

    if (!dailyForecasts[day]) {
      dailyForecasts[day] = {
        day,
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        condition: item.weather[0].description.replace(/\b\w/g, l => l.toUpperCase()),
        icon: getWeatherIcon(item.weather[0].icon),
        temps: [item.main.temp]
      }
    } else {
      dailyForecasts[day].high = Math.max(dailyForecasts[day].high, Math.round(item.main.temp_max))
      dailyForecasts[day].low = Math.min(dailyForecasts[day].low, Math.round(item.main.temp_min))
      dailyForecasts[day].temps.push(item.main.temp)
    }
  })

  return Object.values(dailyForecasts).slice(0, 5).map(forecast => {
    delete forecast.temps
    return forecast
  })
}

export default router