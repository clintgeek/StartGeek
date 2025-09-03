import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import config from './config.js'

// Import routes
import settingsRoutes from './routes/settings.js'
import servicesRoutes from './routes/services.js'
import weatherRoutes from './routes/weather.js'
import newsRoutes from './routes/news.js'
import systemRoutes from './routes/system.js'

const app = express()
const PORT = config.port

// Security middleware
app.use(helmet())
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Logging
app.use(morgan('combined'))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// MongoDB connection with graceful fallback
let mongoConnected = false
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    })
    console.log('✅ MongoDB connected successfully')
    mongoConnected = true
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed, running in development mode with fallback storage')
    console.warn('   Install MongoDB locally or use MongoDB Atlas for full functionality')
    mongoConnected = false
    // Don't exit in development - continue with fallback storage
  }
}

// Routes
app.use('/api/settings', settingsRoutes)
app.use('/api/services', servicesRoutes)
app.use('/api/weather', weatherRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/system', systemRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  })
})

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error)
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  })
})

// Start server
const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`🚀 StartGeek API Server running on port ${PORT}`)
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  })
}

startServer().catch(console.error)

export default app
export { mongoConnected }