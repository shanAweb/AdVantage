import { Router } from 'express'
import { crawlerController } from '@/controllers/crawlerController'
import { authenticateToken } from '@/middleware/auth'
import { validateRequest } from '@/middleware/validateRequest'
import { body, param, query } from 'express-validator'

const router = Router()

/**
 * Test crawler on a specific URL
 * POST /api/crawler/test
 */
router.post(
  '/test',
  authenticateToken,
  [
    body('url').isURL().withMessage('Valid URL is required'),
    body('customSelectors').optional().isObject().withMessage('Custom selectors must be an object'),
  ],
  validateRequest,
  (req, res) => crawlerController.testCrawler(req, res)
)

/**
 * Get selector suggestions for a URL
 * GET /api/crawler/suggestions
 */
router.get(
  '/suggestions',
  authenticateToken,
  [
    query('url').isURL().withMessage('Valid URL is required'),
  ],
  validateRequest,
  (req, res) => crawlerController.getSelectorSuggestions(req, res)
)

/**
 * Validate selector configuration
 * POST /api/crawler/validate-selectors
 */
router.post(
  '/validate-selectors',
  authenticateToken,
  [
    body('selectors').isObject().withMessage('Selectors configuration is required'),
  ],
  validateRequest,
  (req, res) => crawlerController.validateSelectors(req, res)
)

/**
 * Get crawler performance metrics
 * GET /api/crawler/metrics/:feedId
 */
router.get(
  '/metrics/:feedId',
  authenticateToken,
  [
    param('feedId').isString().notEmpty().withMessage('Feed ID is required'),
  ],
  validateRequest,
  (req, res) => crawlerController.getPerformanceMetrics(req, res)
)

/**
 * Test multiple URLs
 * POST /api/crawler/test-multiple
 */
router.post(
  '/test-multiple',
  authenticateToken,
  [
    body('urls').isArray({ min: 1, max: 10 }).withMessage('URLs array is required (1-10 URLs)'),
    body('urls.*').isURL().withMessage('All URLs must be valid'),
  ],
  validateRequest,
  (req, res) => crawlerController.testMultipleUrls(req, res)
)

/**
 * Get crawler status and configuration
 * GET /api/crawler/status
 */
router.get(
  '/status',
  authenticateToken,
  (req, res) => crawlerController.getCrawlerStatus(req, res)
)

export default router
