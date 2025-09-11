import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { 
  createAd, 
  getAds, 
  getAd, 
  updateAd, 
  deleteAd, 
  bulkCreateAds 
} from '@/controllers/adController'
import { validateRequest } from '@/middleware/validateRequest'
import { authenticate } from '@/middleware/auth'

const router = Router()

/**
 * @route   POST /api/ads
 * @desc    Create a new ad from a product
 * @access  Private
 */
router.post('/', [
  authenticate,
  body('feedId').isString().withMessage('Feed ID is required'),
  body('productId').isString().withMessage('Product ID is required'),
  body('headline').optional().isString().withMessage('Headline must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  validateRequest
], createAd)

/**
 * @route   POST /api/ads/bulk
 * @desc    Bulk create ads from products
 * @access  Private
 */
router.post('/bulk', [
  authenticate,
  body('feedId').isString().withMessage('Feed ID is required'),
  body('productIds').isArray({ min: 1 }).withMessage('Product IDs array is required'),
  body('productIds.*').isString().withMessage('Each product ID must be a string'),
  body('headlineTemplate').optional().isString().withMessage('Headline template must be a string'),
  body('descriptionTemplate').optional().isString().withMessage('Description template must be a string'),
  validateRequest
], bulkCreateAds)

/**
 * @route   GET /api/ads
 * @desc    Get all ads for user
 * @access  Private
 */
router.get('/', [
  authenticate,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('feedId').optional().isString().withMessage('Feed ID must be a string'),
  query('search').optional().isString().withMessage('Search must be a string'),
  validateRequest
], getAds)

/**
 * @route   GET /api/ads/:id
 * @desc    Get ad by ID
 * @access  Private
 */
router.get('/:id', [
  authenticate,
  param('id').isString().withMessage('Ad ID is required'),
  validateRequest
], getAd)

/**
 * @route   PUT /api/ads/:id
 * @desc    Update ad
 * @access  Private
 */
router.put('/:id', [
  authenticate,
  param('id').isString().withMessage('Ad ID is required'),
  body('headline').optional().notEmpty().withMessage('Headline cannot be empty'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('finalUrl').optional().isURL().withMessage('Final URL must be a valid URL'),
  body('imageUrl').optional().isURL().withMessage('Image URL must be a valid URL'),
  validateRequest
], updateAd)

/**
 * @route   DELETE /api/ads/:id
 * @desc    Delete ad
 * @access  Private
 */
router.delete('/:id', [
  authenticate,
  param('id').isString().withMessage('Ad ID is required'),
  validateRequest
], deleteAd)

export default router


