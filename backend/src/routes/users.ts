import { Router } from 'express'
import { body, param } from 'express-validator'
import { 
  getProfile, 
  updateProfile, 
  changePassword, 
  deleteAccount,
  getUserStats,
  updateSubscription
} from '@/controllers/userController'
import { validateRequest } from '@/middleware/validateRequest'
import { authenticate } from '@/middleware/auth'

const router = Router()

// All routes require authentication
router.use(authenticate)

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', getProfile)

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', [
  body('firstName').optional().isString().withMessage('First name must be a string'),
  body('lastName').optional().isString().withMessage('Last name must be a string'),
  body('company').optional().isString().withMessage('Company must be a string'),
  body('phone').optional().isString().withMessage('Phone must be a string'),
  body('timezone').optional().isString().withMessage('Timezone must be a string'),
  validateRequest
], updateProfile)

/**
 * @route   PUT /api/users/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  validateRequest
], changePassword)

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', getUserStats)

/**
 * @route   PUT /api/users/subscription
 * @desc    Update user subscription
 * @access  Private
 */
router.put('/subscription', [
  body('planId').notEmpty().withMessage('Plan ID is required'),
  body('paymentMethodId').optional().isString().withMessage('Payment method ID must be a string'),
  validateRequest
], updateSubscription)

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', deleteAccount)

export default router

