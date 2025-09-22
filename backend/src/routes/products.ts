import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { authenticate } from '@/middleware/auth'
import { validateRequest } from '@/middleware/validateRequest'
import { getProducts, getProduct, deleteProduct, getProductStats } from '@/controllers/productController'

const router = Router()

/**
 * @route   GET /api/products
 * @desc    Get all products for user
 * @access  Private
 */
router.get('/', [
  authenticate,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('feedId').optional().isString().withMessage('Feed ID must be a string'),
  query('category').optional().isString().withMessage('Category must be a string'),
  validateRequest
], getProducts)

/**
 * @route   GET /api/products/stats
 * @desc    Get product statistics
 * @access  Private
 */
router.get('/stats', [
  authenticate
], getProductStats)

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Private
 */
router.get('/:id', [
  authenticate,
  param('id').isString().withMessage('Product ID is required'),
  validateRequest
], getProduct)

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private
 */
router.delete('/:id', [
  authenticate,
  param('id').isString().withMessage('Product ID is required'),
  validateRequest
], deleteProduct)

export default router

