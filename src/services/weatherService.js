class WeatherService {
  constructor() {
    // Using Open-Meteo API (completely free, no API key required)
    this.baseUrl = 'https://api.open-meteo.com/v1'
    this.geocodingUrl = 'https://geocoding-api.open-meteo.com/v1'
    this.ipApiUrl = 'https://ipapi.co/json'
  }

  async getCurrentLocation() {
    try {
      const response = await fetch(this.ipApiUrl)
      const data = await response.json()

      return {
        lat: data.latitude,
        lon: data.longitude,
        city: data.city,
        region: data.region,
        country: data.country_name
      }
    } catch (error) {
      console.error('Failed to get location:', error)
      // Fallback to a default location (Arkadelphia, AR)
      return {
        lat: 34.1201,
        lon: -93.0532,
        city: 'Arkadelphia',
        region: 'Arkansas',
        country: 'United States'
      }
    }
  }

  async getWeatherByCoords(lat, lon, locationName = 'Unknown Location') {
    try {
      // Open-Meteo API call - no API key required!
      const url = `${this.baseUrl}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=precipitation_probability&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&forecast_days=1`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`)
      }

      const data = await response.json()
      const current = data.current

      // Get current hour's precipitation probability
      const currentHour = new Date().getHours()
      const precipitationProbability = data.hourly?.precipitation_probability?.[currentHour] || 0

      return {
        temperature: Math.round(current.temperature_2m),
        condition: this.getConditionFromCode(current.weather_code),
        description: this.getDescriptionFromCode(current.weather_code),
        location: locationName,
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        windDirection: current.wind_direction_10m,
        icon: this.getIconFromCode(current.weather_code),
        pressure: current.surface_pressure,
        feelsLike: Math.round(current.apparent_temperature),
        precipitation: current.precipitation || 0,
        precipitationProbability: precipitationProbability,
        lat: lat,
        lon: lon,
        timestamp: current.time
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error)
      throw error
    }
  }

  async get7DayForecast(lat, lon, locationName = 'Unknown Location') {
    try {
      // Open-Meteo 7-day forecast API call
      const url = `${this.baseUrl}/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`)
      }

      const data = await response.json()
      const daily = data.daily

      return daily.time.map((date, index) => ({
        date: date,
        dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        highTemp: Math.round(daily.temperature_2m_max[index]),
        lowTemp: Math.round(daily.temperature_2m_min[index]),
        condition: this.getConditionFromCode(daily.weather_code[index]),
        description: this.getDescriptionFromCode(daily.weather_code[index]),
        icon: this.getIconFromCode(daily.weather_code[index]),
        precipitation: daily.precipitation_sum[index] || 0,
        windSpeed: Math.round(daily.wind_speed_10m_max[index]),
        location: locationName
      }))
    } catch (error) {
      console.error('Failed to fetch 7-day forecast:', error)
      throw error
    }
  }

  async getCurrentWeather() {
    try {
      const location = await this.getCurrentLocation()
      const locationName = `${location.city}, ${location.region}`
      const weather = await this.getWeatherByCoords(location.lat, location.lon, locationName)

      return {
        success: true,
        data: weather,
        location: location
      }
    } catch (error) {
      console.error('Weather service error:', error)

      // Return fallback data
      return {
        success: false,
        error: error.message,
        data: {
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
        }
      }
    }
  }

  async getWeatherWithForecast() {
    try {
      const location = await this.getCurrentLocation()
      const locationName = `${location.city}, ${location.region}`

      // Get both current weather and 7-day forecast
      const [currentWeather, forecast] = await Promise.all([
        this.getWeatherByCoords(location.lat, location.lon, locationName),
        this.get7DayForecast(location.lat, location.lon, locationName)
      ])

      return {
        success: true,
        current: currentWeather,
        forecast: forecast,
        location: location
      }
    } catch (error) {
      console.error('Weather with forecast error:', error)

      // Return fallback data
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

      return {
        success: false,
        error: error.message,
        current: {
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
        },
        forecast: fallbackForecast
      }
    }
  }

  // Open-Meteo weather code mappings
  getConditionFromCode(code) {
    const codeMap = {
      0: 'Clear',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing Rime Fog',
      51: 'Light Drizzle',
      53: 'Moderate Drizzle',
      55: 'Dense Drizzle',
      56: 'Light Freezing Drizzle',
      57: 'Dense Freezing Drizzle',
      61: 'Slight Rain',
      63: 'Moderate Rain',
      65: 'Heavy Rain',
      66: 'Light Freezing Rain',
      67: 'Heavy Freezing Rain',
      71: 'Slight Snow',
      73: 'Moderate Snow',
      75: 'Heavy Snow',
      77: 'Snow Grains',
      80: 'Slight Rain Showers',
      81: 'Moderate Rain Showers',
      82: 'Violent Rain Showers',
      85: 'Slight Snow Showers',
      86: 'Heavy Snow Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with Slight Hail',
      99: 'Thunderstorm with Heavy Hail'
    }

    return codeMap[code] || 'Unknown'
  }

  getDescriptionFromCode(code) {
    const descriptions = {
      0: 'clear sky',
      1: 'mainly clear',
      2: 'partly cloudy',
      3: 'overcast',
      45: 'fog',
      48: 'depositing rime fog',
      51: 'light drizzle',
      53: 'moderate drizzle',
      55: 'dense drizzle',
      56: 'light freezing drizzle',
      57: 'dense freezing drizzle',
      61: 'slight rain',
      63: 'moderate rain',
      65: 'heavy rain',
      66: 'light freezing rain',
      67: 'heavy freezing rain',
      71: 'slight snow fall',
      73: 'moderate snow fall',
      75: 'heavy snow fall',
      77: 'snow grains',
      80: 'slight rain showers',
      81: 'moderate rain showers',
      82: 'violent rain showers',
      85: 'slight snow showers',
      86: 'heavy snow showers',
      95: 'thunderstorm',
      96: 'thunderstorm with slight hail',
      99: 'thunderstorm with heavy hail'
    }

    return descriptions[code] || 'unknown conditions'
  }

  getIconFromCode(code) {
    // Map weather codes to simple icon identifiers
    if (code === 0) return 'sunny'
    if (code === 1) return 'mostly-sunny'
    if (code === 2) return 'partly-cloudy'
    if (code === 3) return 'cloudy'
    if (code === 45 || code === 48) return 'foggy'
    if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle'
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rainy'
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snowy'
    if ([95, 96, 99].includes(code)) return 'stormy'

    return 'partly-cloudy'
  }

  getWeatherIconUrl(iconCode) {
    // For Open-Meteo, we'll use emoji or simple icons
    const iconMap = {
      'sunny': '☀️',
      'mostly-sunny': '🌤️',
      'partly-cloudy': '⛅',
      'cloudy': '☁️',
      'foggy': '🌫️',
      'drizzle': '🌦️',
      'rainy': '🌧️',
      'snowy': '🌨️',
      'stormy': '⛈️'
    }

    return iconMap[iconCode] || '⛅'
  }

  // Convert weather condition to our icon system
  getLocalIcon(condition) {
    const conditionMap = {
      'Clear': 'sunny',
      'Mainly Clear': 'mostly-sunny',
      'Partly Cloudy': 'partly-cloudy',
      'Overcast': 'cloudy',
      'Fog': 'foggy',
      'Drizzle': 'drizzle',
      'Rain': 'rainy',
      'Snow': 'snowy',
      'Thunderstorm': 'stormy'
    }

    return conditionMap[condition] || 'partly-cloudy'
  }
}

export const weatherService = new WeatherService()