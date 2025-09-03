import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['web', 'api', 'database', 'service'],
    default: 'web'
  },
  enabled: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'warning', 'unknown'],
    default: 'unknown'
  },
  responseTime: {
    type: Number,
    default: 0
  },
  lastChecked: {
    type: Date,
    default: Date.now
  },
  uptime: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  alertThreshold: {
    type: Number,
    default: 5000 // 5 seconds
  },
  checkInterval: {
    type: Number,
    default: 300 // 5 minutes
  }
}, {
  timestamps: true
})

// Index for efficient queries
serviceSchema.index({ status: 1, enabled: 1 })
serviceSchema.index({ lastChecked: -1 })

export default mongoose.model('Service', serviceSchema)