import Queue from 'bull'
import { getRedisClient } from './redis'
import { logger } from '@/utils/logger'

/**
 * Queue configuration for BullMQ
 */
export interface QueueConfig {
  redis: {
    host: string
    port: number
    password?: string
  }
  defaultJobOptions: {
    removeOnComplete: number
    removeOnFail: number
    attempts: number
    backoff: {
      type: string
      delay: number
    }
  }
}

// Store queue instances
let feedCrawlQueue: Queue.Queue | null = null
let campaignQueue: Queue.Queue | null = null
let exportQueue: Queue.Queue | null = null

/**
 * Create queue instance with Redis connection (or fallback without Redis)
 */
export function createQueue(name: string, config?: Partial<QueueConfig>): Queue.Queue | null {
  // If no Redis URL, return null (queues won't work but app will still run)
  if (!process.env.REDIS_URL) {
    logger.info(`⚠️  Queue ${name} disabled - Redis not available`)
    return null
  }

  try {
    const redisClient = getRedisClient()
    
    const queueConfig: QueueConfig = {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
      ...config,
    }

    const queue = new Queue(name, {
      redis: redisClient.options,
      defaultJobOptions: queueConfig.defaultJobOptions,
    })

    // Queue event listeners
    queue.on('error', (error) => {
      logger.error(`Queue ${name} error:`, error)
    })

    queue.on('waiting', (jobId) => {
      logger.info(`Job ${jobId} is waiting in queue ${name}`)
    })

    queue.on('active', (job) => {
      logger.info(`Job ${job.id} is now active in queue ${name}`)
    })

    queue.on('completed', (job) => {
      logger.info(`Job ${job.id} completed in queue ${name}`)
    })

    queue.on('failed', (job, err) => {
      logger.error(`Job ${job?.id} failed in queue ${name}:`, err)
    })

    queue.on('stalled', (job) => {
      logger.warn(`Job ${job.id} stalled in queue ${name}`)
    })

    return queue
  } catch (error) {
    logger.error(`❌ Failed to create queue ${name}:`, error)
    return null
  }
}

/**
 * Get or create feed crawling queue (lazy initialization)
 */
export function getFeedCrawlQueue(): Queue.Queue | null {
  if (!feedCrawlQueue) {
    feedCrawlQueue = createQueue('feeds:crawl', {
      defaultJobOptions: {
        removeOnComplete: 5,
        removeOnFail: 3,
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    })
  }
  return feedCrawlQueue
}

/**
 * Get or create campaign processing queue (lazy initialization)
 */
export function getCampaignQueue(): Queue.Queue | null {
  if (!campaignQueue) {
    campaignQueue = createQueue('campaigns:process', {
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
      },
    })
  }
  return campaignQueue
}

/**
 * Get or create export queue (lazy initialization)
 */
export function getExportQueue(): Queue.Queue | null {
  if (!exportQueue) {
    exportQueue = createQueue('feeds:export', {
      defaultJobOptions: {
        removeOnComplete: 20,
        removeOnFail: 10,
        attempts: 2,
        backoff: {
          type: 'fixed',
          delay: 1000,
        },
      },
    })
  }
  return exportQueue
}

/**
 * Clean up queues on shutdown
 */
export async function cleanupQueues(): Promise<void> {
  try {
    const queuesToClose = []
    
    if (feedCrawlQueue) {
      queuesToClose.push(feedCrawlQueue.close())
    }
    if (campaignQueue) {
      queuesToClose.push(campaignQueue.close())
    }
    if (exportQueue) {
      queuesToClose.push(exportQueue.close())
    }
    
    if (queuesToClose.length > 0) {
      await Promise.all(queuesToClose)
    }
    
    logger.info('✅ All queues closed successfully')
  } catch (error) {
    logger.error('❌ Error closing queues:', error)
  }
}

