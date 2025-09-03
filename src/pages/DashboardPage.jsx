import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Clock,
  Calendar,
  TrendingUp,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react'
import SystemStats from '../components/SystemStats'
import QuickActions from '../components/QuickActions'
import RecentActivity from '../components/RecentActivity'

const DashboardPage = ({ currentTime }) => {
  const [stats, setStats] = useState({
    uptime: '2d 14h 32m',
    activeServices: 8,
    totalRequests: 1247,
    responseTime: '45ms'
  })

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-shadow mb-2">Dashboard</h1>
          <p className="text-white/70">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} • {currentTime.toLocaleTimeString()}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-light">{stats.activeServices}</span>
            </div>
            <h3 className="text-white/90 font-medium">Active Services</h3>
            <p className="text-white/60 text-sm">All systems operational</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-light">{stats.uptime}</span>
            </div>
            <h3 className="text-white/90 font-medium">System Uptime</h3>
            <p className="text-white/60 text-sm">Since last restart</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-light">{stats.totalRequests}</span>
            </div>
            <h3 className="text-white/90 font-medium">Total Requests</h3>
            <p className="text-white/60 text-sm">Last 24 hours</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Wifi className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-2xl font-light">{stats.responseTime}</span>
            </div>
            <h3 className="text-white/90 font-medium">Avg Response</h3>
            <p className="text-white/60 text-sm">Last hour</p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* System Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <SystemStats />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <QuickActions />
            <RecentActivity />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardPage