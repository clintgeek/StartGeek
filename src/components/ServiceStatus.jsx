import React from 'react'
import { motion } from 'framer-motion'

const ServiceStatus = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <h2 className="text-xl font-medium mb-4">Service Status</h2>
      <p className="text-white/60">Service status component placeholder</p>
    </motion.div>
  )
}

export default ServiceStatus