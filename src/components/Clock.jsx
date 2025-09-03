import React from 'react'
import { motion } from 'framer-motion'

const Clock = ({ currentTime }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const time = formatTime(currentTime)
  const [mainTime, period] = time.split(' ')

  return (
    <div className="text-center relative">
      <div className="flex items-baseline justify-center space-x-2">
        {/* Main time display - no jarring animations */}
        <motion.span
          animate={{
            opacity: [0.95, 1, 0.95],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="text-8xl md:text-9xl font-light text-shadow tracking-tight"
        >
          {mainTime}
        </motion.span>

        {/* AM/PM indicator */}
        <span className="text-3xl md:text-4xl font-light text-white/80 text-shadow">
          {period}
        </span>
      </div>

      {/* Subtle time zone indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-sm text-white/60 font-mono"
      >
        {Intl.DateTimeFormat().resolvedOptions().timeZone}
      </motion.div>

      {/* Subtle hover effect only */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        whileHover={{
          scale: 1.01,
          transition: { type: "spring", stiffness: 400, damping: 25 }
        }}
      />
    </div>
  )
}

export default Clock