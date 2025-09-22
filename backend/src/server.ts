import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import { errorHandler } from '@/middleware/errorHandler'
import { notFoundHandler } from '@/middleware/notFoundHandler'
import { corsMiddleware } from '@/middleware/cors'
import { logger } from '@/utils/logger'
import { connectDatabase } from '@/config/database'
import { connectRedis } from '@/config/redis'

// Import workers
import { initializeFeedCrawlerWorker } from '@/workers/feedCrawlerWorker'

// Import routes
import authRoutes from '@/routes/auth'
import userRoutes from '@/routes/users'
import campaignRoutes from '@/routes/campaigns'
import analyticsRoutes from '@/routes/analytics'
import webhookRoutes from '@/routes/webhooks'
import feedRoutes from '@/routes/feeds'
import adRoutes from '@/routes/ads'
import newCampaignRoutes from '@/routes/newCampaigns'
import crawlerRoutes from '@/routes/crawler'
import productRoutes from '@/routes/products'

// Load environment variables
dotenv.config()

/**
 * Main Express server application
 * Handles all API routes, middleware, and error handling
 */
class Server {
  public app: express.Application
  private port: number

  constructor() {
    this.app = express()
    this.port = parseInt(process.env.PORT || '5000', 10)
    
    this.initializeMiddleware()
    this.initializeRoutes()
    this.initializeErrorHandling()
  }

  /**
   * Initialize all middleware
   */
  private initializeMiddleware(): void {
    // Use the custom CORS middleware
    this.app.use(corsMiddleware);

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    })
    this.app.use('/api/', limiter)

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))

    // Force JSON content type for all responses
    this.app.use((req, res, next) => {
      res.setHeader('Content-Type', 'application/json')
      next()
    })

    // Compression middleware
    this.app.use(compression())

    // Logging middleware
    this.app.use(morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim())
      }
    }))

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      })
    })

    // API ping endpoint
    this.app.get('/api/ping', (req, res) => {
      res.status(200).json({
        message: 'Global Ads Launch API is running!',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
      })
    })
  }

  /**
   * Initialize all API routes
   */
  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/auth', authRoutes)
    this.app.use('/api/users', userRoutes)
    this.app.use('/api/campaigns', campaignRoutes)
    this.app.use('/api/analytics', analyticsRoutes)
    this.app.use('/api/webhooks', webhookRoutes)
    this.app.use('/api/feeds', feedRoutes)
    this.app.use('/api/ads', adRoutes)
    this.app.use('/api/new-campaigns', newCampaignRoutes)
    this.app.use('/api/crawler', crawlerRoutes)
    this.app.use('/api/products', productRoutes)

    // API documentation endpoint
    this.app.get('/api', (req, res) => {
      res.json({
        name: 'Global Ads Launch API',
        version: '1.0.0',
        description: 'Production-ready SaaS API for global advertising campaign management',
        endpoints: {
          health: '/health',
          ping: '/api/ping',
          auth: '/api/auth',
          users: '/api/users',
          campaigns: '/api/campaigns',
          analytics: '/api/analytics',
          webhooks: '/api/webhooks',
          feeds: '/api/feeds',
          ads: '/api/ads',
          newCampaigns: '/api/new-campaigns',
          crawler: '/api/crawler'
        },
        documentation: 'https://docs.globaladslaunch.com'
      })
    })
  }

  /**
   * Initialize error handling middleware
   */
  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler)
    
    // Global error handler
    this.app.use(errorHandler)
  }

  /**
   * Start the server
   */
  public async start(): Promise<void> {
    try {
      // Connect to database
      await connectDatabase()
      logger.info('Database connected successfully')

      // Connect to Redis (optional)
      await connectRedis()
      logger.info('Redis connection attempted')

      // Initialize workers (works with or without Redis)
      initializeFeedCrawlerWorker()
      logger.info('Workers initialized successfully')

      // Start server
      this.app.listen(this.port, () => {
        logger.info(`🚀 Server running on port ${this.port}`)
        logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
        logger.info(`🌐 API URL: http://localhost:${this.port}/api`)
        logger.info(`❤️  Health check: http://localhost:${this.port}/health`)
      })
    } catch (error) {
      logger.error('Failed to start server:', error)
      process.exit(1)
    }
  }

  /**
   * Graceful shutdown
   */
  public async shutdown(): Promise<void> {
    logger.info('Shutting down server...')
    process.exit(0)
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error)
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

// Handle SIGINT signal (Ctrl+C)
process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  process.exit(0)
})

// Create and start server
const server = new Server()
server.start()

export default server
