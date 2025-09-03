import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Server,
  Globe,
  Database,
  Container,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import ServerMonitor from '../components/ServerMonitor'
import ServiceStatus from '../components/ServiceStatus'

const MonitoringPage = () => {
  const [services, setServices] = useState([
    {
      id: '1',
      name: 'Home Server',
      url: 'https://home.clintgeek.com',
      status: 'online',
      responseTime: 120,
      lastChecked: new Date(),
      uptime: 99.9
    },
    {
      id: '2',
      name: 'SABnzbd',
      url: 'https://sab.clintgeek.com',
      status: 'online',
      responseTime: 85,
      lastChecked: new Date(),
      uptime: 98.5
    },
    {
      id: '3',
      name: 'Sonarr',
      url: 'https://sonarr.clintgeek.com',
      status: 'online',
      responseTime: 95,
      lastChecked: new Date(),
      uptime: 99.2
    },
    {
      id: '4',
      name: 'Radarr',
      url: 'https://radarr.clintgeek.com',
      status: 'warning',
      responseTime: 450,
      lastChecked: new Date(),
      uptime: 97.8
    },
    {
      id: '5',
      name: 'BaseGeek API',
      url: 'http://localhost:3001',
      status: 'online',
      responseTime: 25,
      lastChecked: new Date(),
      uptime: 99.8
    },
    {
      id: '6',
      name: 'MongoDB',
      url: 'mongodb://localhost:27017',
      status: 'online',
      responseTime: 15,
      lastChecked: new Date(),
      uptime: 99.9
    }
  ])

  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshServices = async () => {
    setIsRefreshing(true)

    // Simulate API calls to check service status
    setTimeout(() => {
      setServices(prev => prev.map(service => ({
        ...service,
        lastChecked: new Date(),
        responseTime: Math.floor(Math.random() * 200) + 50
      })))
      setIsRefreshing(false)
    }, 2000)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'border-green-400/50 bg-green-400/10'
      case 'offline':
        return 'border-red-400/50 bg-red-400/10'
      case 'warning':
        return 'border-yellow-400/50 bg-yellow-400/10'
    }
  }

  const onlineServices = services.filter(s => s.status === 'online').length
  const totalServices = services.length

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-light text-shadow mb-2">Server Monitoring</h1>
            <p className="text-white/70">
              {onlineServices}/{totalServices} services online
            </p>
          </div>

          <button
            onClick={refreshServices}
            disabled={isRefreshing}
            className="glass rounded-xl p-3 hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Server className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-light text-green-400">{onlineServices}</span>
            </div>
            <h3 className="text-white/90 font-medium">Online</h3>
            <p className="text-white/60 text-sm">Services running</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-light">
                {Math.round(services.reduce((acc, s) => acc + s.responseTime, 0) / services.length)}ms
              </span>
            </div>
            <h3 className="text-white/90 font-medium">Avg Response</h3>
            <p className="text-white/60 text-sm">All services</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-light">
                {Math.round(services.reduce((acc, s) => acc + s.uptime, 0) / services.length * 10) / 10}%
              </span>
            </div>
            <h3 className="text-white/90 font-medium">Avg Uptime</h3>
            <p className="text-white/60 text-sm">Last 30 days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Container className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-2xl font-light">6</span>
            </div>
            <h3 className="text-white/90 font-medium">Containers</h3>
            <p className="text-white/60 text-sm">Docker services</p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`glass rounded-2xl p-6 border ${getStatusColor(service.status)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(service.status)}
                  <h3 className="font-medium text-white/90">{service.name}</h3>
                </div>
                <span className="text-sm text-white/60 capitalize">{service.status}</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Response Time</span>
                  <span className="text-white/90">{service.responseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Uptime</span>
                  <span className="text-white/90">{service.uptime}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Last Check</span>
                  <span className="text-white/90">
                    {service.lastChecked.toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/50 hover:text-white/70 transition-colors break-all"
                >
                  {service.url}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default MonitoringPage