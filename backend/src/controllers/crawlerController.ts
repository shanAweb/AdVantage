import { Request, Response } from 'express'
import { crawlerTestService } from '@/services/crawlerTest'
import { feedCrawlerService } from '@/services/feedCrawler'
import { getSelectorsForUrl, getSelectorSuggestions } from '@/services/siteSelectors'
import { logger } from '@/utils/logger'

/**
 * Crawler management controller
 */
export class CrawlerController {
  /**
   * Test crawler on a specific URL
   * POST /api/crawler/test
   */
  async testCrawler(req: Request, res: Response): Promise<void> {
    try {
      const { url, customSelectors } = req.body

      if (!url) {
        res.status(400).json({
          success: false,
          error: 'URL is required',
        })
        return
      }

      // Validate URL
      try {
        new URL(url)
      } catch (error) {
        res.status(400).json({
          success: false,
          error: 'Invalid URL format',
        })
        return
      }

      const result = await crawlerTestService.testCrawler(url, customSelectors)

      res.json({
        success: true,
        data: result,
      })
    } catch (error) {
      logger.error('Test crawler error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    }
  }

  /**
   * Get selector suggestions for a URL
   * GET /api/crawler/suggestions?url=...
   */
  async getSelectorSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const { url } = req.query

      if (!url || typeof url !== 'string') {
        res.status(400).json({
          success: false,
          error: 'URL parameter is required',
        })
        return
      }

      // Validate URL
      try {
        new URL(url)
      } catch (error) {
        res.status(400).json({
          success: false,
          error: 'Invalid URL format',
        })
        return
      }

      const selectors = getSelectorsForUrl(url)
      const suggestions = getSelectorSuggestions(url)

      res.json({
        success: true,
        data: {
          selectors,
          suggestions,
        },
      })
    } catch (error) {
      logger.error('Get suggestions error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    }
  }

  /**
   * Validate selector configuration
   * POST /api/crawler/validate-selectors
   */
  async validateSelectors(req: Request, res: Response): Promise<void> {
    try {
      const { selectors } = req.body

      if (!selectors) {
        res.status(400).json({
          success: false,
          error: 'Selectors configuration is required',
        })
        return
      }

      const result = crawlerTestService.validateSelectors(selectors)

      res.json({
        success: true,
        data: result,
      })
    } catch (error) {
      logger.error('Validate selectors error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    }
  }

  /**
   * Get crawler performance metrics
   * GET /api/crawler/metrics/:feedId
   */
  async getPerformanceMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { feedId } = req.params

      if (!feedId) {
        res.status(400).json({
          success: false,
          error: 'Feed ID is required',
        })
        return
      }

      const metrics = await crawlerTestService.getPerformanceMetrics(feedId)

      res.json({
        success: true,
        data: metrics,
      })
    } catch (error) {
      logger.error('Get performance metrics error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    }
  }

  /**
   * Test multiple URLs
   * POST /api/crawler/test-multiple
   */
  async testMultipleUrls(req: Request, res: Response): Promise<void> {
    try {
      const { urls } = req.body

      if (!urls || !Array.isArray(urls) || urls.length === 0) {
        res.status(400).json({
          success: false,
          error: 'URLs array is required',
        })
        return
      }

      if (urls.length > 10) {
        res.status(400).json({
          success: false,
          error: 'Maximum 10 URLs allowed per test',
        })
        return
      }

      // Validate all URLs
      for (const url of urls) {
        try {
          new URL(url)
        } catch (error) {
          res.status(400).json({
            success: false,
            error: `Invalid URL format: ${url}`,
          })
          return
        }
      }

      const results = await crawlerTestService.testMultipleUrls(urls)

      res.json({
        success: true,
        data: results,
      })
    } catch (error) {
      logger.error('Test multiple URLs error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    }
  }

  /**
   * Get crawler status and configuration
   * GET /api/crawler/status
   */
  async getCrawlerStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = {
        version: '2.0.0',
        features: [
          'Static HTML crawling (axios + cheerio)',
          'JavaScript rendering (Playwright)',
          'Automatic fallback detection',
          'Pagination support',
          'Rate limiting',
          'Site-specific selectors',
          'JSON-LD extraction',
        ],
        supportedSites: [
          'Amazon',
          'Shopify stores',
          'WooCommerce stores',
          'eBay',
          'Etsy',
          'AliExpress',
          'Generic e-commerce sites',
          'JavaScript-heavy sites (SPA)',
        ],
        rateLimits: {
          maxConcurrentRequests: 2,
          timeWindow: '1 minute',
          delayBetweenRequests: '1 second',
        },
        pagination: {
          enabled: true,
          maxPages: 10,
          supportedTypes: ['next page button', 'load more button', 'infinite scroll'],
        },
      }

      res.json({
        success: true,
        data: status,
      })
    } catch (error) {
      logger.error('Get crawler status error:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      })
    }
  }
}

/**
 * Export singleton instance
 */
export const crawlerController = new CrawlerController()
