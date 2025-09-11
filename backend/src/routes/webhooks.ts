import { Router } from 'express'
import { body } from 'express-validator'
import { 
  stripeWebhook,
  googleAdsWebhook,
  microsoftAdsWebhook,
  youtubeWebhook
} from '@/controllers/webhookController'
import { validateRequest } from '@/middleware/validateRequest'

const router = Router()

/**
 * @route   POST /api/webhooks/stripe
 * @desc    Handle Stripe webhooks
 * @access  Public (verified by Stripe signature)
 */
router.post('/stripe', [
  body('type').notEmpty().withMessage('Event type is required'),
  body('data').notEmpty().withMessage('Event data is required'),
  validateRequest
], stripeWebhook)

/**
 * @route   POST /api/webhooks/google-ads
 * @desc    Handle Google Ads webhooks
 * @access  Public (verified by Google signature)
 */
router.post('/google-ads', [
  body('eventType').notEmpty().withMessage('Event type is required'),
  body('resourceName').notEmpty().withMessage('Resource name is required'),
  validateRequest
], googleAdsWebhook)

/**
 * @route   POST /api/webhooks/microsoft-ads
 * @desc    Handle Microsoft Ads webhooks
 * @access  Public (verified by Microsoft signature)
 */
router.post('/microsoft-ads', [
  body('eventType').notEmpty().withMessage('Event type is required'),
  body('resourceId').notEmpty().withMessage('Resource ID is required'),
  validateRequest
], microsoftAdsWebhook)

/**
 * @route   POST /api/webhooks/youtube
 * @desc    Handle YouTube webhooks
 * @access  Public (verified by YouTube signature)
 */
router.post('/youtube', [
  body('eventType').notEmpty().withMessage('Event type is required'),
  body('videoId').notEmpty().withMessage('Video ID is required'),
  validateRequest
], youtubeWebhook)

export default router

