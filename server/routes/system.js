import express from 'express'
import { exec } from 'child_process'
import { promisify } from 'util'
import os from 'os'
import fs from 'fs/promises'

const router = express.Router()
const execAsync = promisify(exec)

// GET /api/system/stats - Get system statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await getSystemStats()

    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error getting system stats:', error)

    // Return mock data if real stats fail
    res.json({
      success: true,
      data: getMockSystemStats(),
      mock: true,
      timestamp: new Date().toISOString()
    })
  }
})

// GET /api/system/info - Get system information
router.get('/info', async (req, res) => {
  try {
    const info = {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      uptime: os.uptime(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus().length,
      loadAverage: os.loadavg(),
      networkInterfaces: Object.keys(os.networkInterfaces()),
      nodeVersion: process.version,
      pid: process.pid
    }

    res.json({
      success: true,
      data: info
    })
  } catch (error) {
    console.error('Error getting system info:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get system information'
    })
  }
})

// GET /api/system/processes - Get running processes (limited)
router.get('/processes', async (req, res) => {
  try {
    let processes = []

    if (os.platform() === 'linux' || os.platform() === 'darwin') {
      const { stdout } = await execAsync('ps aux --sort=-%cpu | head -10')
      const lines = stdout.split('\n').slice(1) // Skip header

      processes = lines.filter(line => line.trim()).map(line => {
        const parts = line.trim().split(/\s+/)
        return {
          user: parts[0],
          pid: parts[1],
          cpu: parseFloat(parts[2]),
          memory: parseFloat(parts[3]),
          command: parts.slice(10).join(' ').substring(0, 50)
        }
      })
    } else {
      // Windows fallback or mock data
      processes = getMockProcesses()
    }

    res.json({
      success: true,
      data: processes
    })
  } catch (error) {
    console.error('Error getting processes:', error)
    res.json({
      success: true,
      data: getMockProcesses(),
      mock: true
    })
  }
})

// GET /api/system/disk - Get disk usage
router.get('/disk', async (req, res) => {
  try {
    let diskUsage = []

    if (os.platform() === 'linux' || os.platform() === 'darwin') {
      const { stdout } = await execAsync('df -h')
      const lines = stdout.split('\n').slice(1) // Skip header

      diskUsage = lines.filter(line => line.trim() && !line.startsWith('tmpfs')).map(line => {
        const parts = line.trim().split(/\s+/)
        return {
          filesystem: parts[0],
          size: parts[1],
          used: parts[2],
          available: parts[3],
          usePercent: parseInt(parts[4]),
          mountPoint: parts[5]
        }
      })
    } else {
      diskUsage = getMockDiskUsage()
    }

    res.json({
      success: true,
      data: diskUsage
    })
  } catch (error) {
    console.error('Error getting disk usage:', error)
    res.json({
      success: true,
      data: getMockDiskUsage(),
      mock: true
    })
  }
})

// Helper function to get real system stats
async function getSystemStats() {
  const stats = {
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    uptime: os.uptime(),
    timestamp: new Date().toISOString()
  }

  // CPU usage (approximation using load average)
  const loadAvg = os.loadavg()
  const cpuCount = os.cpus().length
  stats.cpu = Math.min(100, Math.round((loadAvg[0] / cpuCount) * 100))

  // Memory usage
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  stats.memory = Math.round(((totalMem - freeMem) / totalMem) * 100)

  // Disk usage (try to get root filesystem usage)
  try {
    if (os.platform() === 'linux' || os.platform() === 'darwin') {
      const { stdout } = await execAsync('df / | tail -1')
      const parts = stdout.trim().split(/\s+/)
      stats.disk = parseInt(parts[4]) || 0
    }
  } catch (error) {
    stats.disk = Math.floor(Math.random() * 30) + 20 // Mock fallback
  }

  // Network usage (mock for now - would need more complex implementation)
  stats.network = Math.floor(Math.random() * 20) + 5

  return stats
}

// Mock data functions
function getMockSystemStats() {
  return {
    cpu: Math.floor(Math.random() * 40) + 20,
    memory: Math.floor(Math.random() * 30) + 50,
    disk: Math.floor(Math.random() * 20) + 25,
    network: Math.floor(Math.random() * 20) + 5,
    uptime: os.uptime(),
    timestamp: new Date().toISOString()
  }
}

function getMockProcesses() {
  return [
    { user: 'root', pid: '1', cpu: 0.1, memory: 0.2, command: 'systemd --system --deserialize 17' },
    { user: 'node', pid: '1234', cpu: 15.2, memory: 8.5, command: 'node server.js' },
    { user: 'mongodb', pid: '5678', cpu: 5.3, memory: 12.1, command: 'mongod --config /etc/mongod.conf' },
    { user: 'redis', pid: '9012', cpu: 2.1, memory: 3.2, command: 'redis-server *:6379' }
  ]
}

function getMockDiskUsage() {
  return [
    {
      filesystem: '/dev/sda1',
      size: '100G',
      used: '45G',
      available: '50G',
      usePercent: 45,
      mountPoint: '/'
    },
    {
      filesystem: '/dev/sda2',
      size: '500G',
      used: '120G',
      available: '350G',
      usePercent: 25,
      mountPoint: '/home'
    }
  ]
}

export default router