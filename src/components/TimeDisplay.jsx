import React from 'react'

const TimeDisplay = ({ currentTime }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="text-center mb-8">
      {/* Time */}
      <div className="text-8xl md:text-9xl font-light text-white mb-2 font-mono tracking-wider">
        {formatTime(currentTime)}
      </div>

      {/* Date */}
      <div className="text-2xl md:text-3xl text-white/80 font-light">
        {formatDate(currentTime)}
      </div>
    </div>
  )
}

export default TimeDisplay