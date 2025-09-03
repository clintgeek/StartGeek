// MongoDB initialization script for StartGeek
db = db.getSiblingDB('startgeek');

// Create collections
db.createCollection('settings');
db.createCollection('activities');
db.createCollection('services');
db.createCollection('weather_cache');

// Insert default settings
db.settings.insertOne({
  _id: 'default',
  theme: 'auto',
  clockFormat: '12h',
  weatherLocation: 'Arkadelphia, AR 71923',
  weatherUnit: 'fahrenheit',
  backgroundRefresh: 30,
  notifications: true,
  aiAssistant: true,
  monitoringInterval: 60,
  createdAt: new Date(),
  updatedAt: new Date()
});

// Insert default services to monitor
db.services.insertMany([
  {
    name: 'Home Server',
    url: 'https://home.clintgeek.com',
    type: 'web',
    enabled: true,
    createdAt: new Date()
  },
  {
    name: 'SABnzbd',
    url: 'https://sab.clintgeek.com',
    type: 'web',
    enabled: true,
    createdAt: new Date()
  },
  {
    name: 'Sonarr',
    url: 'https://sonarr.clintgeek.com',
    type: 'web',
    enabled: true,
    createdAt: new Date()
  },
  {
    name: 'Radarr',
    url: 'https://radarr.clintgeek.com',
    type: 'web',
    enabled: true,
    createdAt: new Date()
  }
]);

// Create indexes
db.activities.createIndex({ "timestamp": -1 });
db.services.createIndex({ "name": 1 });
db.weather_cache.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 1800 }); // 30 minutes TTL

print('StartGeek database initialized successfully!');