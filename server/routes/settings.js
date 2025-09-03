import express from 'express'
import Settings from '../models/Settings.js'
import Joi from 'joi'

// In-memory fallback storage for development
let fallbackSettings = {
  _id: 'default',
  theme: 'auto',
  clockFormat: '12h',
  weatherLocation: 'Arkadelphia, AR 71923',
  weatherUnit: 'fahrenheit',
  backgroundRefresh: 30,
  notifications: true,
  aiAssistant: true,
  monitoringInterval: 60,
  aiProvider: 'basegeek',
  aiModel: 'gpt-3.5-turbo',
  newsCategories: ['technology', 'science'],
  dashboardLayout: {
    widgets: ['weather', 'clock', 'services', 'news', 'ai-chat'],
    columns: 3
  }
}

const router = express.Router()

// Validation schema
const settingsSchema = Joi.object({
  theme: Joi.string().valid('auto', 'light', 'dark'),
  clockFormat: Joi.string().valid('12h', '24h'),
  weatherLocation: Joi.string().min(1).max(100),
  weatherUnit: Joi.string().valid('fahrenheit', 'celsius'),
  backgroundRefresh: Joi.number().min(10).max(300),
  notifications: Joi.boolean(),
  aiAssistant: Joi.boolean(),
  monitoringInterval: Joi.number().min(30).max(3600),
  aiProvider: Joi.string().valid('basegeek', 'openai', 'anthropic', 'local'),
  aiModel: Joi.string().min(1).max(50),
  newsCategories: Joi.array().items(
    Joi.string().valid('technology', 'science', 'business', 'entertainment', 'health', 'sports')
  ),
  dashboardLayout: Joi.object({
    widgets: Joi.array().items(Joi.string()),
    columns: Joi.number().min(1).max(6)
  })
})

// GET /api/settings - Get current settings
router.get('/', async (req, res) => {
  try {
    // Try MongoDB first
    try {
      let settings = await Settings.findById('default')

      if (!settings) {
        // Create default settings if none exist
        settings = new Settings(fallbackSettings)
        await settings.save()
      }

      return res.json({
        success: true,
        data: settings
      })
    } catch (mongoError) {
      console.log('MongoDB not available, using fallback storage')
      // Fall through to fallback storage
    }

    // Use fallback storage
    res.json({
      success: true,
      data: fallbackSettings,
      fallback: true
    })

  } catch (error) {
    console.error('Error fetching settings:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch settings'
    })
  }
})

// PUT /api/settings - Update settings
router.put('/', async (req, res) => {
  try {
    // Validate request body
    const { error, value } = settingsSchema.validate(req.body, {
      allowUnknown: false,
      stripUnknown: true
    })

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map(d => d.message)
      })
    }

    // Try MongoDB first
    try {
      const settings = await Settings.findByIdAndUpdate(
        'default',
        { ...value, updatedAt: new Date() },
        {
          new: true,
          upsert: true,
          runValidators: true
        }
      )

      return res.json({
        success: true,
        data: settings,
        message: 'Settings updated successfully'
      })
    } catch (mongoError) {
      console.log('MongoDB not available, using fallback storage')
      // Fall through to fallback storage
    }

    // Update fallback storage
    fallbackSettings = { ...fallbackSettings, ...value, updatedAt: new Date() }

    res.json({
      success: true,
      data: fallbackSettings,
      message: 'Settings updated successfully (fallback storage)',
      fallback: true
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update settings'
    })
  }
})

// DELETE /api/settings - Reset to defaults
router.delete('/', async (req, res) => {
  try {
    // Try MongoDB first
    try {
      const settings = await Settings.findByIdAndUpdate(
        'default',
        fallbackSettings,
        {
          new: true,
          upsert: true,
          runValidators: true
        }
      )

      return res.json({
        success: true,
        data: settings,
        message: 'Settings reset to defaults'
      })
    } catch (mongoError) {
      console.log('MongoDB not available, using fallback storage')
      // Fall through to fallback storage
    }

    // Reset fallback storage
    fallbackSettings = {
      _id: 'default',
      theme: 'auto',
      clockFormat: '12h',
      weatherLocation: 'Arkadelphia, AR 71923',
      weatherUnit: 'fahrenheit',
      backgroundRefresh: 30,
      notifications: true,
      aiAssistant: true,
      monitoringInterval: 60,
      aiProvider: 'basegeek',
      aiModel: 'gpt-3.5-turbo',
      newsCategories: ['technology', 'science'],
      dashboardLayout: {
        widgets: ['weather', 'clock', 'services', 'news', 'ai-chat'],
        columns: 3
      }
    }

    res.json({
      success: true,
      data: fallbackSettings,
      message: 'Settings reset to defaults (fallback storage)',
      fallback: true
    })
  } catch (error) {
    console.error('Error resetting settings:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to reset settings'
    })
  }
})

export default router