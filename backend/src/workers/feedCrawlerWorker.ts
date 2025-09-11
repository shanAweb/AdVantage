import { getFeedCrawlQueue } from '@/config/queue'
import { feedCrawlerService } from '@/services/feedCrawler'
import { logger } from '@/utils/logger'

/**
 * Feed crawler worker
 * Processes feed crawling jobs from the queue
 */

let workerInitialized = false

/**
 * Initialize the feed crawler worker
 * This function should be called after Redis connection is established
 */
export function initializeFeedCrawlerWorker(): void {
  if (workerInitialized) {
    return
  }

  try {
    const feedCrawlQueue = getFeedCrawlQueue()

    // Only initialize worker if Redis is available
    if (feedCrawlQueue) {
      // Process feed crawling jobs
      feedCrawlQueue.process('crawl-feed', async (job) => {
        try {
          const { feedId } = job.data
          
          logger.info(`Processing feed crawl job for feed ${feedId}`)
          
          await feedCrawlerService.crawlFeed(feedId)
          
          logger.info(`Feed crawl job completed for feed ${feedId}`)
          
          return { success: true, feedId }
        } catch (error) {
          logger.error(`Feed crawl job failed:`, error)
          throw error
        }
      })

      // Handle job events
      feedCrawlQueue.on('completed', (job, result) => {
        logger.info(`Feed crawl job ${job.id} completed:`, result)
      })

      feedCrawlQueue.on('failed', (job, err) => {
        logger.error(`Feed crawl job ${job?.id} failed:`, err)
      })

      feedCrawlQueue.on('stalled', (job) => {
        logger.warn(`Feed crawl job ${job.id} stalled`)
      })

      logger.info('✅ Feed crawler worker initialized with Redis')
    } else {
      logger.info('⚠️  Feed crawler worker disabled - Redis not available')
    }

    workerInitialized = true
  } catch (error) {
    logger.error('❌ Failed to initialize feed crawler worker:', error)
    throw error
  }
}

export default { initializeFeedCrawlerWorker }