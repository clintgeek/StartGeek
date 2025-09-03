import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: 'default'
  },
  theme: {
    type: String,
    enum: ['auto', 'light', 'dark'],
    default: 'auto'
  },
  clockFormat: {
    type: String,
    enum: ['12h', '24h'],
    default: '12h'
  },
  weatherLocation: {
    type: String,
    default: 'Arkadelphia, AR 71923'
  },
  weatherUnit: {
    type: String,
    enum: ['fahrenheit', 'celsius'],
    default: 'fahrenheit'
  },
  backgroundRefresh: {
    type: Number,
    min: 10,
    max: 300,
    default: 30
  },
  notifications: {
    type: Boolean,
    default: true
  },
  aiAssistant: {
    type: Boolean,
    default: true
  },
  monitoringInterval: {
    type: Number,
    min: 30,
    max: 3600,
    default: 60
  },
  aiProvider: {
    type: String,
    enum: ['basegeek', 'openai', 'anthropic', 'local'],
    default: 'basegeek'
  },
  aiModel: {
    type: String,
    default: 'gpt-3.5-turbo'
  },
  newsCategories: [{
    type: String,
    enum: ['technology', 'science', 'business', 'entertainment', 'health', 'sports']
  }],
  dashboardLayout: {
    type: Object,
    default: {
      widgets: ['weather', 'clock', 'services', 'news', 'ai-chat'],
      columns: 3
    }
  }
}, {
  timestamps: true,
  versionKey: false
})

export default mongoose.model('Settings', settingsSchema)