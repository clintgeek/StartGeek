import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import BackgroundManager from './components/BackgroundManager'
import Clock from './components/Clock'
import CombinedWeather from './components/CombinedWeather'
import SearchBox from './components/SearchBox'

function App() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen relative">
      <BackgroundManager />

      {/* Bottom Left - Date */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute bottom-6 left-6 z-10"
      >
        <div className="text-2xl font-light text-shadow text-white">
          {currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </motion.div>

      {/* Bottom Right - Combined Weather */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute bottom-6 right-6 z-10"
      >
        <CombinedWeather />
      </motion.div>

      {/* Main Content - Clock and Search */}
      <div className="min-h-screen flex flex-col justify-center items-center p-8">
        {/* Center Section - Main Clock */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Clock currentTime={currentTime} />
        </motion.div>

        {/* Search Box - Directly under clock */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full max-w-4xl px-4"
        >
          <SearchBox />
        </motion.div>
      </div>



      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'glass-dark text-white',
          duration: 4000,
        }}
      />
    </div>
  )
}

export default App