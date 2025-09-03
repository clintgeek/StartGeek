import express from 'express'
import axios from 'axios'
import mongoose from 'mongoose'

const router = express.Router()

// News cache schema
const newsCacheSchema = new mongoose.Schema({
  category: { type: String, required: true, index: true },
  articles: [{ type: Object }],
  timestamp: { type: Date, default: Date.now, expires: 3600 } // 1 hour TTL
})

const NewsCache = mongoose.model('NewsCache', newsCacheSchema)

// GET /api/news - Get news articles
router.get('/', async (req, res) => {
  try {
    const { category = 'technology', limit = 10 } = req.query

    // Check cache first
    const cached = await NewsCache.findOne({ category })
    if (cached && (Date.now() - cached.timestamp.getTime()) < 3600000) { // 1 hour
      return res.json({
        success: true,
        data: cached.articles.slice(0, parseInt(limit)),
        cached: true,
        timestamp: cached.timestamp
      })
    }

    let articles = []

    // Try NewsAPI if API key is available
    const newsApiKey = process.env.NEWS_API_KEY
    if (newsApiKey) {
      try {
        const newsApiUrl = `https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=${newsApiKey}&pageSize=${limit}`
        const response = await axios.get(newsApiUrl)

        articles = response.data.articles.map(article => ({
          title: article.title,
          description: article.description,
          url: article.url,
          source: article.source.name,
          publishedAt: article.publishedAt,
          urlToImage: article.urlToImage,
          category
        }))
      } catch (error) {
        console.error('NewsAPI error:', error.message)
      }
    }

    // Fallback to RSS feeds if NewsAPI fails or no key
    if (articles.length === 0) {
      articles = await fetchRSSFeeds(category, parseInt(limit))
    }

    // If still no articles, return mock data
    if (articles.length === 0) {
      articles = getMockNews(category, parseInt(limit))
    }

    // Cache the results
    await NewsCache.findOneAndUpdate(
      { category },
      { category, articles, timestamp: new Date() },
      { upsert: true, new: true }
    )

    res.json({
      success: true,
      data: articles,
      cached: false
    })

  } catch (error) {
    console.error('News API error:', error)

    // Return cached data if available, even if expired
    const cached = await NewsCache.findOne({ category: req.query.category || 'technology' })
    if (cached) {
      return res.json({
        success: true,
        data: cached.articles.slice(0, parseInt(req.query.limit || 10)),
        cached: true,
        stale: true,
        timestamp: cached.timestamp
      })
    }

    // Last resort: return mock data
    res.json({
      success: true,
      data: getMockNews(req.query.category || 'technology', parseInt(req.query.limit || 10)),
      mock: true
    })
  }
})

// GET /api/news/categories - Get available news categories
router.get('/categories', (req, res) => {
  const categories = [
    { id: 'technology', name: 'Technology', icon: 'laptop' },
    { id: 'science', name: 'Science', icon: 'flask' },
    { id: 'business', name: 'Business', icon: 'briefcase' },
    { id: 'entertainment', name: 'Entertainment', icon: 'film' },
    { id: 'health', name: 'Health', icon: 'heart' },
    { id: 'sports', name: 'Sports', icon: 'trophy' }
  ]

  res.json({
    success: true,
    data: categories
  })
})

// Helper function to fetch RSS feeds
async function fetchRSSFeeds(category, limit) {
  const rssFeeds = {
    technology: [
      'https://feeds.feedburner.com/oreilly/radar',
      'https://rss.cnn.com/rss/edition_technology.rss',
      'https://feeds.arstechnica.com/arstechnica/index'
    ],
    science: [
      'https://rss.cnn.com/rss/edition_space.rss',
      'https://www.sciencedaily.com/rss/all.xml'
    ],
    business: [
      'https://rss.cnn.com/rss/money_latest.rss',
      'https://feeds.bloomberg.com/markets/news.rss'
    ]
  }

  const feeds = rssFeeds[category] || rssFeeds.technology
  const articles = []

  // Note: In a real implementation, you'd use an RSS parser like 'rss-parser'
  // For now, we'll return empty array and fall back to mock data

  return articles
}

// Mock news data
function getMockNews(category, limit) {
  const mockArticles = {
    technology: [
      {
        title: "AI Breakthrough: New Language Model Achieves Human-Level Performance",
        description: "Researchers announce a significant advancement in artificial intelligence with a new language model that demonstrates human-level understanding across multiple domains.",
        url: "https://example.com/ai-breakthrough",
        source: "Tech News Daily",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        urlToImage: "https://via.placeholder.com/400x200?text=AI+News",
        category: "technology"
      },
      {
        title: "Quantum Computing Milestone: 1000-Qubit Processor Unveiled",
        description: "A major tech company reveals its latest quantum processor with unprecedented qubit count, promising to revolutionize computational capabilities.",
        url: "https://example.com/quantum-computing",
        source: "Quantum Weekly",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        urlToImage: "https://via.placeholder.com/400x200?text=Quantum+Computing",
        category: "technology"
      },
      {
        title: "Cybersecurity Alert: New Vulnerability Discovered in Popular Software",
        description: "Security researchers identify a critical vulnerability affecting millions of users worldwide, patches are being rolled out immediately.",
        url: "https://example.com/security-alert",
        source: "CyberSec Today",
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        urlToImage: "https://via.placeholder.com/400x200?text=Cybersecurity",
        category: "technology"
      }
    ],
    science: [
      {
        title: "Mars Mission Update: Rover Discovers Evidence of Ancient Water",
        description: "Latest findings from the Mars rover mission provide compelling evidence of ancient water activity on the Red Planet.",
        url: "https://example.com/mars-discovery",
        source: "Space Science Journal",
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        urlToImage: "https://via.placeholder.com/400x200?text=Mars+Discovery",
        category: "science"
      }
    ],
    business: [
      {
        title: "Tech Stocks Rally as Market Shows Strong Growth",
        description: "Technology sector leads market gains with strong quarterly earnings reports from major companies.",
        url: "https://example.com/tech-stocks",
        source: "Financial Times",
        publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        urlToImage: "https://via.placeholder.com/400x200?text=Stock+Market",
        category: "business"
      }
    ]
  }

  const articles = mockArticles[category] || mockArticles.technology
  return articles.slice(0, limit)
}

export default router