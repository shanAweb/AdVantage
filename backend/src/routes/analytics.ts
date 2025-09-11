import { Router } from 'express'
import { query, param } from 'express-validator'
import { 
  getDashboardStats,
  getCampaignAnalytics,
  getPlatformAnalytics,
  getConversionAnalytics,
  exportAnalytics,
  getKeywordPerformance,
  getAudienceInsights
} from '@/controllers/analyticsController'
import { validateRequest } from '@/middleware/validateRequest'
import { authenticate } from '@/middleware/auth'

const router = Router()

// All routes require authentication
router.use(authenticate)

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/dashboard', [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
  query('platform').optional().isIn(['google', 'microsoft', 'youtube', 'all']).withMessage('Platform must be google, microsoft, youtube, or all'),
  validateRequest
], getDashboardStats)

/**
 * @route   GET /api/analytics/campaigns
 * @desc    Get campaign analytics
 * @access  Private
 */
router.get('/campaigns', [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
  query('campaignIds').optional().isArray().withMessage('Campaign IDs must be an array'),
  query('platform').optional().isIn(['google', 'microsoft', 'youtube', 'all']).withMessage('Platform must be google, microsoft, youtube, or all'),
  validateRequest
], getCampaignAnalytics)

/**
 * @route   GET /api/analytics/platforms
 * @desc    Get platform-specific analytics
 * @access  Private
 */
router.get('/platforms', [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
  query('platform').isIn(['google', 'microsoft', 'youtube']).withMessage('Platform must be google, microsoft, or youtube'),
  validateRequest
], getPlatformAnalytics)

/**
 * @route   GET /api/analytics/conversions
 * @desc    Get conversion analytics
 * @access  Private
 */
router.get('/conversions', [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
  query('campaignId').optional().isUUID().withMessage('Campaign ID must be a valid UUID'),
  validateRequest
], getConversionAnalytics)

/**
 * @route   GET /api/analytics/keywords
 * @desc    Get keyword performance analytics
 * @access  Private
 */
router.get('/keywords', [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
  query('campaignId').optional().isUUID().withMessage('Campaign ID must be a valid UUID'),
  query('platform').optional().isIn(['google', 'microsoft', 'youtube']).withMessage('Platform must be google, microsoft, or youtube'),
  validateRequest
], getKeywordPerformance)

/**
 * @route   GET /api/analytics/audience
 * @desc    Get audience insights
 * @access  Private
 */
router.get('/audience', [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
  query('campaignId').optional().isUUID().withMessage('Campaign ID must be a valid UUID'),
  validateRequest
], getAudienceInsights)

/**
 * @route   GET /api/analytics/export
 * @desc    Export analytics data
 * @access  Private
 */
router.get('/export', [
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
  query('format').isIn(['csv', 'xlsx', 'json']).withMessage('Format must be csv, xlsx, or json'),
  query('type').isIn(['campaigns', 'keywords', 'conversions', 'all']).withMessage('Type must be campaigns, keywords, conversions, or all'),
  validateRequest
], exportAnalytics)

export default router

