import React from 'react'
import { motion } from 'framer-motion'
import Clock from '../components/Clock'
import Weather from '../components/Weather'

const HomePage = ({ currentTime }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center p-8">
      {/* Center Section - Main Clock */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex items-center justify-center"
      >
        <Clock currentTime={currentTime} />
      </motion.div>

      {/* Bottom Section - Weather and Date */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-between items-end"
      >
        <div className="flex flex-col space-y-2">
          <div className="text-2xl font-light text-shadow">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        <Weather />
      </motion.div>
    </div>
  )
}

export default HomePage