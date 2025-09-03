import express from 'express'
import axios from 'axios'
import Service from '../models/Service.js'

const router = express.Router()

// GET /api/services - Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ enabled: true })
      .sort({ name: 1 })

    res.json({
      success: true,
      data: services
    })
  } catch (error) {
    console.error('Error fetching services:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch services'
    })
  }
})

// GET /api/services/status - Check status of all services
router.get('/status', async (req, res) => {
  try {
    const services = await Service.find({ enabled: true })
    const statusChecks = await Promise.allSettled(
      services.map(service => checkServiceHealth(service))
    )

    const results = statusChecks.map((result, index) => ({
      service: services[index].name,
      ...result.value
    }))

    res.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error checking service status:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to check service status'
    })
  }
})

// POST /api/services - Add new service
router.post('/', async (req, res) => {
  try {
    const { name, url, type, description, tags, alertThreshold, checkInterval } = req.body

    if (!name || !url) {
      return res.status(400).json({
        success: false,
        error: 'Name and URL are required'
      })
    }

    // Check if service already exists
    const existingService = await Service.findOne({ name })
    if (existingService) {
      return res.status(409).json({
        success: false,
        error: 'Service with this name already exists'
      })
    }

    const service = new Service({
      name,
      url,
      type: type || 'web',
      description,
      tags: tags || [],
      alertThreshold: alertThreshold || 5000,
      checkInterval: checkInterval || 300
    })

    await service.save()

    // Perform initial health check
    const healthCheck = await checkServiceHealth(service)
    service.status = healthCheck.status
    service.responseTime = healthCheck.responseTime
    service.lastChecked = new Date()
    await service.save()

    res.status(201).json({
      success: true,
      data: service,
      message: 'Service added successfully'
    })
  } catch (error) {
    console.error('Error adding service:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to add service'
    })
  }
})

// PUT /api/services/:id - Update service
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const service = await Service.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      })
    }

    res.json({
      success: true,
      data: service,
      message: 'Service updated successfully'
    })
  } catch (error) {
    console.error('Error updating service:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update service'
    })
  }
})

// DELETE /api/services/:id - Delete service
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const service = await Service.findByIdAndDelete(id)

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      })
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting service:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to delete service'
    })
  }
})

// POST /api/services/:id/check - Manual health check
router.post('/:id/check', async (req, res) => {
  try {
    const { id } = req.params

    const service = await Service.findById(id)
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      })
    }

    const healthCheck = await checkServiceHealth(service)

    // Update service with health check results
    service.status = healthCheck.status
    service.responseTime = healthCheck.responseTime
    service.lastChecked = new Date()
    await service.save()

    res.json({
      success: true,
      data: {
        service: service.name,
        ...healthCheck
      }
    })
  } catch (error) {
    console.error('Error performing health check:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to perform health check'
    })
  }
})

// Health check function
async function checkServiceHealth(service) {
  const startTime = Date.now()

  try {
    const response = await axios.get(service.url, {
      timeout: service.alertThreshold || 5000,
      validateStatus: (status) => status < 500 // Accept 4xx as "online" but not 5xx
    })

    const responseTime = Date.now() - startTime

    let status = 'online'
    if (response.status >= 400) {
      status = 'warning'
    }
    if (responseTime > (service.alertThreshold || 5000)) {
      status = 'warning'
    }

    return {
      status,
      responseTime,
      statusCode: response.status,
      lastChecked: new Date()
    }
  } catch (error) {
    const responseTime = Date.now() - startTime

    return {
      status: 'offline',
      responseTime,
      error: error.message,
      lastChecked: new Date()
    }
  }
}

export default router