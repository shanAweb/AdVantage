import { Router, Request, Response } from 'express'
import { crawlerController } from '@/controllers/crawlerController'
import { authenticate } from '@/middleware/auth'
import { validateRequest } from '@/middleware/validateRequest'
import { body, param, query } from 'express-validator'

const router = Router()

/**
 * Test crawler on a specific URL
 * POST /api/crawler/test
 */
router.post(
  '/test',
  authenticate,
  [
    body('url').isURL().withMessage('Valid URL is required'),
    body('customSelectors').optional().isObject().withMessage('Custom selectors must be an object'),
  ],
  validateRequest,
  (req: Request, res: Response) => crawlerController.testCrawler(req, res)
)

/**
 * Get selector suggestions for a URL
 * GET /api/crawler/suggestions
 */
router.get(
  '/suggestions',
  authenticate,
  [
    query('url').isURL().withMessage('Valid URL is required'),
  ],
  validateRequest,
  (req: Request, res: Response) => crawlerController.getSelectorSuggestions(req, res)
)

/**
 * Validate selector configuration
 * POST /api/crawler/validate-selectors
 */
router.post(
  '/validate-selectors',
  authenticate,
  [
    body('selectors').isObject().withMessage('Selectors configuration is required'),
  ],
  validateRequest,
  (req: Request, res: Response) => crawlerController.validateSelectors(req, res)
)

/**
 * Get crawler performance metrics
 * GET /api/crawler/metrics/:feedId
 */
router.get(
  '/metrics/:feedId',
  authenticate,
  [
    param('feedId').isString().notEmpty().withMessage('Feed ID is required'),
  ],
  validateRequest,
  (req: Request, res: Response) => crawlerController.getPerformanceMetrics(req, res)
)

/**
 * Test multiple URLs
 * POST /api/crawler/test-multiple
 */
router.post(
  '/test-multiple',
  authenticate,
  [
    body('urls').isArray({ min: 1, max: 10 }).withMessage('URLs array is required (1-10 URLs)'),
    body('urls.*').isURL().withMessage('All URLs must be valid'),
  ],
  validateRequest,
  (req: Request, res: Response) => crawlerController.testMultipleUrls(req, res)
)

/**
 * Get crawler status and configuration
 * GET /api/crawler/status
 */
router.get(
  '/status',
  authenticate,
  (req: Request, res: Response) => crawlerController.getCrawlerStatus(req, res)
)

/**
 * Test crawler without authentication (for development)
 * POST /api/crawler/test-public
 */
router.post(
  '/test-public',
  [
    body('url').isURL().withMessage('Valid URL is required'),
    body('customSelectors').optional().isObject().withMessage('Custom selectors must be an object'),
  ],
  validateRequest,
  (req: Request, res: Response) => crawlerController.testCrawler(req, res)
)

export default router
