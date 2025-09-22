import { feedCrawlerService } from './feedCrawler'
import { getSelectorsForUrl, getSelectorSuggestions } from './siteSelectors'
import { logger } from '@/utils/logger'
import { prisma } from '@/config/database'

/**
 * Test and debug crawler functionality
 */
export class CrawlerTestService {
  /**
   * Test crawler with a specific URL
   */
  async testCrawler(url: string, selectors?: any) {
    try {
      logger.info(`Testing crawler for URL: ${url}`)
      
      // Get selectors for the URL if not provided
      if (!selectors) {
        selectors = await getSelectorsForUrl(url)
      }
      
      // Test the crawler - using correct method signature
      const result = await feedCrawlerService.crawlFeed(url)
      
      logger.info('Crawler test completed', { url, result })
      return result
    } catch (error) {
      logger.error('Crawler test failed', { url, error })
      throw error
    }
  }

  /**
   * Test selector suggestions
   */
  async testSelectorSuggestions(url: string) {
    try {
      logger.info(`Testing selector suggestions for URL: ${url}`)
      
      const suggestions = await getSelectorSuggestions(url)
      
      logger.info('Selector suggestions test completed', { url, suggestions })
      return suggestions
    } catch (error) {
      logger.error('Selector suggestions test failed', { url, error })
      throw error
    }
  }

  /**
   * Test database operations
   */
  async testDatabaseOperations() {
    try {
      logger.info('Testing database operations')
      
      // Test basic database connection
      await prisma.$connect()
      
      // Test a simple query
      const userCount = await prisma.user.count()
      
      logger.info('Database test completed', { userCount })
      return { userCount, connected: true }
    } catch (error) {
      logger.error('Database test failed', { error })
      throw error
    }
  }

  /**
   * Run comprehensive crawler test
   */
  async runComprehensiveTest(url: string) {
    try {
      logger.info(`Running comprehensive test for URL: ${url}`)
      
      const results: any = {
        url,
        timestamp: new Date().toISOString(),
        tests: {}
      }

      // Test 1: Database connection
      try {
        results.tests.database = await this.testDatabaseOperations()
      } catch (error: any) {
        results.tests.database = { error: error.message }
      }

      // Test 2: Selector suggestions
      try {
        results.tests.selectorSuggestions = await this.testSelectorSuggestions(url)
      } catch (error: any) {
        results.tests.selectorSuggestions = { error: error.message }
      }

      // Test 3: Crawler functionality
      try {
        results.tests.crawler = await this.testCrawler(url)
      } catch (error: any) {
        results.tests.crawler = { error: error.message }
      }

      logger.info('Comprehensive test completed', results)
      return results
    } catch (error) {
      logger.error('Comprehensive test failed', { url, error })
      throw error
    }
  }

  /**
   * Test crawler with multiple URLs
   */
  async testMultipleUrls(urls: string[]) {
    try {
      logger.info(`Testing crawler with ${urls.length} URLs`)
      
      const results: any[] = []
      
      for (const url of urls) {
        try {
          const result = await this.testCrawler(url)
          results.push({ url, success: true, result })
        } catch (error: any) {
          results.push({ url, success: false, error: error.message })
        }
      }
      
      logger.info('Multiple URLs test completed', { results })
      return results
    } catch (error) {
      logger.error('Multiple URLs test failed', { urls, error })
      throw error
    }
  }

  /**
   * Test crawler performance
   */
  async testPerformance(url: string, iterations: number = 5) {
    try {
      logger.info(`Testing crawler performance for URL: ${url} with ${iterations} iterations`)
      
      const times = []
      
      for (let i = 0; i < iterations; i++) {
        const startTime = Date.now()
        
        try {
          await this.testCrawler(url)
          const endTime = Date.now()
          times.push(endTime - startTime)
        } catch (error) {
          logger.warn(`Performance test iteration ${i + 1} failed`, { error })
        }
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length
      const minTime = Math.min(...times)
      const maxTime = Math.max(...times)
      
      const performanceResults = {
        url,
        iterations,
        successfulRuns: times.length,
        averageTime: avgTime,
        minTime,
        maxTime,
        times
      }
      
      logger.info('Performance test completed', performanceResults)
      return performanceResults
    } catch (error) {
      logger.error('Performance test failed', { url, iterations, error })
      throw error
    }
  }

  /**
   * Validate selectors configuration
   */
  validateSelectors(selectors: any) {
    try {
      logger.info('Validating selectors configuration')
      
      const validation: {
        isValid: boolean
        errors: string[]
        warnings: string[]
      } = {
        isValid: true,
        errors: [],
        warnings: []
      }

      // Check required fields
      if (!selectors) {
        validation.isValid = false
        validation.errors.push('Selectors object is required')
        return validation
      }

      // Check for basic selector structure
      if (!selectors.title && !selectors.productTitle) {
        validation.warnings.push('No title selector found')
      }

      if (!selectors.price && !selectors.productPrice) {
        validation.warnings.push('No price selector found')
      }

      if (!selectors.link && !selectors.productLink) {
        validation.warnings.push('No link selector found')
      }

      // Validate CSS selectors format
      const selectorFields = ['title', 'price', 'link', 'image', 'description', 'productTitle', 'productPrice', 'productLink', 'productImage', 'productDescription']
      
      for (const field of selectorFields) {
        if (selectors[field]) {
          const selector = selectors[field]
          if (typeof selector === 'string') {
            // Basic CSS selector validation
            if (selector.includes('//') || selector.includes('@')) {
              validation.warnings.push(`Field '${field}' contains XPath or attribute syntax: ${selector}`)
            }
          }
        }
      }

      logger.info('Selector validation completed', validation)
      return validation
    } catch (error: any) {
      logger.error('Selector validation failed', { error })
      return {
        isValid: false,
        errors: ['Validation failed: ' + error.message],
        warnings: []
      }
    }
  }

  /**
   * Get performance metrics for a specific feed
   */
  async getPerformanceMetrics(feedId: string) {
    try {
      logger.info(`Getting performance metrics for feed: ${feedId}`)
      
      // Get feed from database
      const feed = await prisma.feed.findUnique({
        where: { id: feedId },
        include: {
          products: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })

      if (!feed) {
        throw new Error('Feed not found')
      }

      // Calculate metrics based on actual schema
      const metrics = {
        feedId,
        feedUrl: feed.siteUrl,
        totalProducts: feed.products.length,
        lastCrawlTime: feed.lastCrawlAt,
        lastCrawlStatus: feed.lastCrawlStatus,
        createdAt: feed.createdAt,
        updatedAt: feed.updatedAt,
        productHistory: feed.products.map((product: any) => ({
          id: product.id,
          title: product.title,
          price: product.price,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }))
      }

      logger.info('Performance metrics retrieved', metrics)
      return metrics
    } catch (error: any) {
      logger.error('Failed to get performance metrics', { feedId, error })
      throw error
    }
  }
}

// Export singleton instance
export const crawlerTestService = new CrawlerTestService()
