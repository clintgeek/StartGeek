import React from 'react'
import { motion } from 'framer-motion'
import {
  RefreshCw,
  Power,
  Settings,
  Download,
  Upload,
  Terminal,
  Database,
  Shield
} from 'lucide-react'
import toast from 'react-hot-toast'

const QuickActions = () => {
  const actions = [
    {
      icon: RefreshCw,
      label: 'Refresh Services',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      action: () => {
        toast.success('Services refreshed')
      }
    },
    {
      icon: Database,
      label: 'Check DB',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      action: () => {
        toast.success('Database connection verified')
      }
    },
    {
      icon: Terminal,
      label: 'System Logs',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      action: () => {
        toast.info('Opening system logs...')
      }
    },
    {
      icon: Shield,
      label: 'Security Scan',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      action: () => {
        toast.loading('Running security scan...', { duration: 2000 })
      }
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <h2 className="text-xl font-medium mb-4">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={index}
              onClick={action.action}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center space-y-2 p-4 glass-dark rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              <div className={`p-3 ${action.bgColor} rounded-lg`}>
                <Icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <span className="text-sm font-medium text-white/90 text-center">
                {action.label}
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">System Status</span>
          <span className="text-green-400 flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Healthy</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default QuickActions