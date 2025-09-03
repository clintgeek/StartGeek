import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock
} from 'lucide-react'

const RecentActivity = () => {
  const [activities, setActivities] = useState([
    {
      id: '1',
      type: 'success',
      message: 'All services are running normally',
      timestamp: new Date(Date.now() - 5 * 60000),
      service: 'System'
    },
    {
      id: '2',
      type: 'info',
      message: 'Background updated successfully',
      timestamp: new Date(Date.now() - 15 * 60000),
      service: 'StartGeek'
    },
    {
      id: '3',
      type: 'warning',
      message: 'High response time detected',
      timestamp: new Date(Date.now() - 25 * 60000),
      service: 'Radarr'
    },
    {
      id: '4',
      type: 'success',
      message: 'Database backup completed',
      timestamp: new Date(Date.now() - 45 * 60000),
      service: 'MongoDB'
    },
    {
      id: '5',
      type: 'info',
      message: 'Weather data refreshed',
      timestamp: new Date(Date.now() - 60 * 60000),
      service: 'Weather API'
    }
  ])

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-400" />
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-green-400'
      case 'warning':
        return 'border-l-yellow-400'
      case 'error':
        return 'border-l-red-400'
      case 'info':
      default:
        return 'border-l-blue-400'
    }
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / 60000)

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  useEffect(() => {
    // Simulate new activities
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now().toString(),
        type: Math.random() > 0.7 ? 'warning' : 'success',
        message: Math.random() > 0.5
          ? 'Service health check completed'
          : 'System monitoring update',
        timestamp: new Date(),
        service: ['System', 'StartGeek', 'MongoDB', 'Redis'][Math.floor(Math.random() * 4)]
      }

      setActivities(prev => [newActivity, ...prev.slice(0, 9)])
    }, 120000) // Every 2 minutes

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="w-5 h-5 text-white/80" />
        <h2 className="text-xl font-medium">Recent Activity</h2>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`border-l-2 ${getActivityColor(activity.type)} pl-4 py-2`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2 flex-1">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/90 leading-relaxed">
                    {activity.message}
                  </p>
                  {activity.service && (
                    <p className="text-xs text-white/50 mt-1">
                      {activity.service}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs text-white/50 ml-2">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(activity.timestamp)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          View all activity →
        </button>
      </div>
    </motion.div>
  )
}

export default RecentActivity