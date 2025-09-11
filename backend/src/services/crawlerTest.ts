import { feedCrawlerService } from './feedCrawler'
import { getSelectorsForUrl, getSelectorSuggestions } from './siteSelectors'
import { logger } from '@/utils/logger'

/**
 * Test and debug crawler functionality
 */
export class CrawlerTestService {
  /**
   * Test crawler on a specific URL
   * @param url - URL to test
   * @param customSelectors - Optional custom selectors
   * @returns Promise<TestResult>
   */
  async testCrawler(url: string, customSelectors?: any): Promise<TestResult> {
    const startTime = Date.now()
    const result: TestResult = {
      url,
      success: false,
      productsFound: 0,
      method: 'unknown',
      duration: 0,
      error: null,
      suggestions: [],
      selectors: null,
    }

    try {
      logger.info(`Testing crawler on ${url}`)

      // Get suggested selectors
      const suggestedSelectors = getSelectorsForUrl(url)
      result.selectors = suggestedSelectors

      // Test static HTML first
      try {
        const staticProducts = await feedCrawlerService['crawlWithStaticHtml'](url, customSelectors)
        if (staticProducts.length > 0) {
          result.success = true
          result.productsFound = staticProducts.length
          result.method = 'static'
          result.products = staticProducts.slice(0, 5) // Show first 5 products
          logger.info(`Static HTML test successful: ${staticProducts.length} products found`)
        } else {
          logger.info('No products found with static HTML, trying Playwright...')
          
          // Test Playwright
          const playwrightProducts = await feedCrawlerService['crawlWithPlaywright'](url, customSelectors)
          result.success = true
          result.productsFound = playwrightProducts.length
          result.method = 'playwright'
          result.products = playwrightProducts.slice(0, 5) // Show first 5 products
          logger.info(`Playwright test successful: ${playwrightProducts.length} products found`)
        }
      } catch (error) {
        logger.error('Crawler test failed:', error)
        result.error = error instanceof Error ? error.message : String(error)
        result.suggestions = getSelectorSuggestions(url)
      }

    } catch (error) {
      logger.error('Test setup failed:', error)
      result.error = error instanceof Error ? error.message : String(error)
    } finally {
      result.duration = Date.now() - startTime
    }

    return result
  }

  /**
   * Test multiple URLs to find the best selectors
   * @param urls - Array of URLs to test
   * @returns Promise<TestResult[]>
   */
  async testMultipleUrls(urls: string[]): Promise<TestResult[]> {
    const results: TestResult[] = []
    
    for (const url of urls) {
      try {
        const result = await this.testCrawler(url)
        results.push(result)
        
        // Add delay between tests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (error) {
        logger.error(`Failed to test ${url}:`, error)
        results.push({
          url,
          success: false,
          productsFound: 0,
          method: 'unknown',
          duration: 0,
          error: error instanceof Error ? error.message : String(error),
          suggestions: [],
          selectors: null,
        })
      }
    }

    return results
  }

  /**
   * Validate selector configuration
   * @param selectors - Selector configuration to validate
   * @returns ValidationResult
   */
  validateSelectors(selectors: any): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
    }

    const required = ['productContainer', 'title', 'price', 'image', 'link']
    
    for (const field of required) {
      if (!selectors[field]) {
        result.valid = false
        result.errors.push(`Missing required field: ${field}`)
      }
    }

    // Check for common issues
    if (selectors.productContainer && !selectors.productContainer.includes('.')) {
      result.warnings.push('Product container selector should include class selector (e.g., .product)')
    }

    if (selectors.title && !selectors.title.includes('h1, h2, h3')) {
      result.warnings.push('Title selector should include heading tags (h1, h2, h3)')
    }

    if (selectors.price && !selectors.price.includes('price')) {
      result.warnings.push('Price selector should include "price" keyword')
    }

    return result
  }

  /**
   * Get performance metrics for crawler
   * @param feedId - Feed ID to analyze
   * @returns Promise<PerformanceMetrics>
   */
  async getPerformanceMetrics(feedId: string): Promise<PerformanceMetrics> {
    try {
      const feed = await feedCrawlerService['prisma'].feed.findUnique({
        where: { id: feedId },
        include: {
          products: {
            select: {
              id: true,
              createdAt: true,
            },
          },
        },
      })

      if (!feed) {
        throw new Error('Feed not found')
      }

      const productCount = feed.products.length
      const lastCrawl = feed.lastCrawlAt
      const status = feed.lastCrawlStatus

      return {
        feedId,
        productCount,
        lastCrawl,
        status,
        success: status === 'completed',
        averageProductsPerCrawl: productCount,
      }
    } catch (error) {
      logger.error('Failed to get performance metrics:', error)
      throw error
    }
  }
}

/**
 * Test result interface
 */
export interface TestResult {
  url: string
  success: boolean
  productsFound: number
  method: 'static' | 'playwright' | 'unknown'
  duration: number
  error: string | null
  suggestions: string[]
  selectors: any
  products?: any[]
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  feedId: string
  productCount: number
  lastCrawl: Date | null
  status: string
  success: boolean
  averageProductsPerCrawl: number
}

/**
 * Export singleton instance
 */
export const crawlerTestService = new CrawlerTestService()
