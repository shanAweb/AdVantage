import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { 
  createFeed, 
  getFeeds, 
  getFeed, 
  updateFeed, 
  deleteFeed, 
  refreshFeed, 
  stopFeedCrawl,
  getFeedProducts, 
  downloadFeed, 
  getPublicFeed 
} from '@/controllers/feedController'
import { validateRequest } from '@/middleware/validateRequest'
import { authenticate } from '@/middleware/auth'

const router = Router()

/**
 * @route   POST /api/feeds
 * @desc    Create a new feed
 * @access  Private
 */
router.post('/', [
  authenticate,
  body('name').notEmpty().withMessage('Feed name is required'),
  body('siteUrl').isURL().withMessage('Valid site URL is required'),
  body('country').optional().isString().withMessage('Country must be a string'),
  body('currency').optional().isString().withMessage('Currency must be a string'),
  body('selectorConfig').optional().isObject().withMessage('Selector config must be an object'),
  validateRequest
], createFeed)

/**
 * @route   GET /api/feeds
 * @desc    Get all feeds for user
 * @access  Private
 */
router.get('/', [
  authenticate,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validateRequest
], getFeeds)

/**
 * @route   GET /api/feeds/:id
 * @desc    Get feed by ID
 * @access  Private
 */
router.get('/:id', [
  authenticate,
  param('id').isString().withMessage('Feed ID is required'),
  validateRequest
], getFeed)

/**
 * @route   PUT /api/feeds/:id
 * @desc    Update feed
 * @access  Private
 */
router.put('/:id', [
  authenticate,
  param('id').isString().withMessage('Feed ID is required'),
  body('name').optional().notEmpty().withMessage('Feed name cannot be empty'),
  body('siteUrl').optional().isURL().withMessage('Valid site URL is required'),
  body('country').optional().isString().withMessage('Country must be a string'),
  body('currency').optional().isString().withMessage('Currency must be a string'),
  body('selectorConfig').optional().isObject().withMessage('Selector config must be an object'),
  validateRequest
], updateFeed)

/**
 * @route   DELETE /api/feeds/:id
 * @desc    Delete feed
 * @access  Private
 */
router.delete('/:id', [
  authenticate,
  param('id').isString().withMessage('Feed ID is required'),
  validateRequest
], deleteFeed)

/**
 * @route   POST /api/feeds/:id/refresh
 * @desc    Refresh feed (trigger new crawl)
 * @access  Private
 */
router.post('/:id/refresh', [
  authenticate,
  param('id').isString().withMessage('Feed ID is required'),
  validateRequest
], refreshFeed)

/**
 * @route   POST /api/feeds/:id/stop
 * @desc    Stop feed crawling
 * @access  Private
 */
router.post('/:id/stop', [
  authenticate,
  param('id').isString().withMessage('Feed ID is required'),
  validateRequest
], stopFeedCrawl)

/**
 * @route   GET /api/feeds/:id/products
 * @desc    Get products for a feed
 * @access  Private
 */
router.get('/:id/products', [
  authenticate,
  param('id').isString().withMessage('Feed ID is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('Search must be a string'),
  validateRequest
], getFeedProducts)

/**
 * @route   GET /api/feeds/:id/download
 * @desc    Download feed in various formats
 * @access  Private
 */
router.get('/:id/download', [
  authenticate,
  param('id').isString().withMessage('Feed ID is required'),
  query('format').optional().isIn(['json', 'csv', 'xml', 'facebook']).withMessage('Format must be json, csv, xml, or facebook'),
  validateRequest
], downloadFeed)

/**
 * @route   GET /api/feeds/public/:token
 * @desc    Get public feed (no authentication required)
 * @access  Public
 */
router.get('/public/:token', [
  param('token').isString().withMessage('Public token is required'),
  query('format').optional().isIn(['json', 'csv', 'xml', 'facebook']).withMessage('Format must be json, csv, xml, or facebook'),
  validateRequest
], getPublicFeed)

export default router


