import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Cpu, HardDrive, Activity, Zap } from 'lucide-react'

const SystemStats = () => {
  const [data, setData] = useState([])
  const [currentStats, setCurrentStats] = useState({
    cpu: 45,
    memory: 68,
    disk: 32,
    network: 12
  })

  useEffect(() => {
    // Generate initial data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }),
      cpu: Math.floor(Math.random() * 40) + 20,
      memory: Math.floor(Math.random() * 30) + 50,
      disk: Math.floor(Math.random() * 20) + 25,
      network: Math.floor(Math.random() * 20) + 5
    }))

    setData(initialData)

    // Update data every 30 seconds
    const interval = setInterval(() => {
      const newDataPoint = {
        time: new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        }),
        cpu: Math.floor(Math.random() * 40) + 20,
        memory: Math.floor(Math.random() * 30) + 50,
        disk: Math.floor(Math.random() * 20) + 25,
        network: Math.floor(Math.random() * 20) + 5
      }

      setData(prev => [...prev.slice(1), newDataPoint])
      setCurrentStats({
        cpu: newDataPoint.cpu,
        memory: newDataPoint.memory,
        disk: newDataPoint.disk,
        network: newDataPoint.network
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
    bgColor
  }) => (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 ${bgColor} rounded-lg`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className="text-2xl font-light">{value}%</span>
      </div>
      <h3 className="text-white/90 font-medium text-sm">{label}</h3>
      <div className="mt-2 bg-white/10 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <h2 className="text-xl font-medium mb-6">System Performance</h2>

      {/* Current Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Cpu}
          label="CPU Usage"
          value={currentStats.cpu}
          color="text-blue-400"
          bgColor="bg-blue-500/20"
        />
        <StatCard
          icon={Activity}
          label="Memory"
          value={currentStats.memory}
          color="text-green-400"
          bgColor="bg-green-500/20"
        />
        <StatCard
          icon={HardDrive}
          label="Disk Usage"
          value={currentStats.disk}
          color="text-purple-400"
          bgColor="bg-purple-500/20"
        />
        <StatCard
          icon={Zap}
          label="Network"
          value={currentStats.network}
          color="text-orange-400"
          bgColor="bg-orange-500/20"
        />
      </div>

      {/* Performance Chart */}
      <div className="h-64">
        <h3 className="text-lg font-medium mb-4 text-white/90">Performance Over Time</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#ffffff60', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#ffffff60', fontSize: 12 }}
              domain={[0, 100]}
            />
            <Area
              type="monotone"
              dataKey="cpu"
              stroke="#60A5FA"
              strokeWidth={2}
              fill="url(#cpuGradient)"
            />
            <Area
              type="monotone"
              dataKey="memory"
              stroke="#4ADE80"
              strokeWidth={2}
              fill="url(#memoryGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

export default SystemStats