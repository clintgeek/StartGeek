import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BackgroundManager = () => {
  const [currentBg, setCurrentBg] = useState('')
  const [nextBg, setNextBg] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const getTimeBasedBackgrounds = () => {
    const hour = new Date().getHours()
    let period, backgrounds

    if (hour >= 5 && hour < 7) {
      period = 'Dawn'
      backgrounds = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Mountain sunrise
        'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Ocean sunrise
        'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Forest sunrise
        'https://images.unsplash.com/photo-1464822759844-d150baec0494?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Field sunrise
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'  // Lake sunrise
      ]
    } else if (hour >= 7 && hour < 18) {
      period = 'Day'
      backgrounds = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Clear mountain day
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Forest path
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Blue sky clouds
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Green hills
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Ocean day
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'  // Desert landscape
      ]
    } else if (hour >= 18 && hour < 20) {
      period = 'Dusk'
      backgrounds = [
        'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Ocean sunset
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Mountain sunset
        'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // City sunset
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Field sunset
        'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'  // Lake sunset
      ]
    } else {
      period = 'Night'
      backgrounds = [
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Starry night
        'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Milky way
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Night city
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Moon night
        'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'  // Aurora
      ]
    }

    console.log(`🎨 Background: Loading ${period} theme (${hour}:00)`)
    return { period, backgrounds }
  }

  const generateBackgroundUrl = () => {
    const { backgrounds } = getTimeBasedBackgrounds()
    // Pick a random background from the time-appropriate collection
    const randomIndex = Math.floor(Math.random() * backgrounds.length)
    return backgrounds[randomIndex]
  }

  const getFallbackBackground = () => {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 7) {
      // Dawn - warm gradient
      return 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)'
    } else if (hour >= 7 && hour < 18) {
      // Day - bright blue gradient
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    } else if (hour >= 18 && hour < 20) {
      // Dusk - sunset gradient
      return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    } else {
      // Night - dark gradient
      return 'linear-gradient(135deg, #2c3e50 0%, #000428 100%)'
    }
  }

  const loadBackground = () => {
    const newBgUrl = generateBackgroundUrl()

    // Preload the image
    const img = new Image()
    img.onload = () => {
      setNextBg(newBgUrl)
      setIsTransitioning(true)

      setTimeout(() => {
        setCurrentBg(newBgUrl)
        setIsTransitioning(false)
      }, 1000)
    }

    // Fallback if main image fails to load
    img.onerror = () => {
      console.log('🔄 Image failed to load, using gradient fallback')
      const fallbackGradient = getFallbackBackground()
      setNextBg(fallbackGradient)
      setIsTransitioning(true)

      setTimeout(() => {
        setCurrentBg(fallbackGradient)
        setIsTransitioning(false)
      }, 1000)
    }

    img.src = newBgUrl
  }

  useEffect(() => {
    // Set immediate fallback background
    const fallback = getFallbackBackground()
    setCurrentBg(fallback)

    // Load initial background after a short delay
    setTimeout(() => {
      loadBackground()
    }, 1000)

    // Change background every 15 minutes (more frequent for testing)
    const interval = setInterval(loadBackground, 15 * 60 * 1000)

    // Also check for time period changes every hour
    const hourlyCheck = setInterval(() => {
      const currentHour = new Date().getHours()
      // Check if we've crossed into a new time period
      if (currentHour === 5 || currentHour === 7 || currentHour === 18 || currentHour === 20) {
        console.log('🕐 Time period changed - updating background theme')
        loadBackground()
      }
    }, 60 * 60 * 1000) // Check every hour

    return () => {
      clearInterval(interval)
      clearInterval(hourlyCheck)
    }
  }, [])

  const isGradient = currentBg.includes('gradient')
  const isNextGradient = nextBg.includes('gradient')

  return (
    <div className="fixed inset-0 -z-10">
      {/* Current Background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={isGradient ?
          { background: currentBg } :
          { backgroundImage: `url(${currentBg})` }
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Gradient overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Transitioning background */}
      <AnimatePresence>
        {isTransitioning && nextBg && (
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={isNextGradient ?
              { background: nextBg } :
              { backgroundImage: `url(${nextBg})` }
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      {/* Final fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 -z-10" />
    </div>
  )
}

export default BackgroundManager