import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  BarChart3,
  Monitor,
  Settings,
  X,
  LogOut,
  User
} from 'lucide-react'

const Navigation = ({ isVisible, onClose, user, onLogout }) => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/monitoring', icon: Monitor, label: 'Monitoring' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Navigation Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 glass-dark z-50 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">StartGeek</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* User Info & Logout */}
            <div className="absolute bottom-6 left-6 right-6 space-y-4">
              {user && (
                <div className="glass rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">
                        {user.username || user.email}
                      </div>
                      <div className="text-xs text-white/60">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center space-x-2 p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-300 hover:text-red-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}

              <div className="text-xs text-white/50 text-center">
                StartGeek v1.0.0
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Navigation