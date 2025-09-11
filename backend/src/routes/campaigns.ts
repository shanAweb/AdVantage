import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { 
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  launchCampaign,
  pauseCampaign,
  resumeCampaign,
  getCampaignPerformance
} from '@/controllers/campaignController'
import { validateRequest } from '@/middleware/validateRequest'
import { authenticate } from '@/middleware/auth'

const router = Router()

// All routes require authentication
router.use(authenticate)

/**
 * @route   POST /api/campaigns
 * @desc    Create a new campaign
 * @access  Private
 */
router.post('/', [
  body('name').notEmpty().withMessage('Campaign name is required'),
  body('platform').isIn(['google', 'microsoft', 'youtube']).withMessage('Platform must be google, microsoft, or youtube'),
  body('budget').isNumeric().withMessage('Budget must be a number'),
  body('targetAudience').optional().isObject().withMessage('Target audience must be an object'),
  body('keywords').optional().isArray().withMessage('Keywords must be an array'),
  body('adGroups').optional().isArray().withMessage('Ad groups must be an array'),
  validateRequest
], createCampaign)

/**
 * @route   GET /api/campaigns
 * @desc    Get all campaigns for user
 * @access  Private
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('platform').optional().isIn(['google', 'microsoft', 'youtube']).withMessage('Platform must be google, microsoft, or youtube'),
  query('status').optional().isIn(['draft', 'active', 'paused', 'completed']).withMessage('Status must be draft, active, paused, or completed'),
  validateRequest
], getCampaigns)

/**
 * @route   GET /api/campaigns/:id
 * @desc    Get campaign by ID
 * @access  Private
 */
router.get('/:id', [
  param('id').isUUID().withMessage('Invalid campaign ID'),
  validateRequest
], getCampaign)

/**
 * @route   PUT /api/campaigns/:id
 * @desc    Update campaign
 * @access  Private
 */
router.put('/:id', [
  param('id').isUUID().withMessage('Invalid campaign ID'),
  body('name').optional().notEmpty().withMessage('Campaign name cannot be empty'),
  body('budget').optional().isNumeric().withMessage('Budget must be a number'),
  body('targetAudience').optional().isObject().withMessage('Target audience must be an object'),
  body('keywords').optional().isArray().withMessage('Keywords must be an array'),
  validateRequest
], updateCampaign)

/**
 * @route   DELETE /api/campaigns/:id
 * @desc    Delete campaign
 * @access  Private
 */
router.delete('/:id', [
  param('id').isUUID().withMessage('Invalid campaign ID'),
  validateRequest
], deleteCampaign)

/**
 * @route   POST /api/campaigns/:id/launch
 * @desc    Launch campaign
 * @access  Private
 */
router.post('/:id/launch', [
  param('id').isUUID().withMessage('Invalid campaign ID'),
  validateRequest
], launchCampaign)

/**
 * @route   POST /api/campaigns/:id/pause
 * @desc    Pause campaign
 * @access  Private
 */
router.post('/:id/pause', [
  param('id').isUUID().withMessage('Invalid campaign ID'),
  validateRequest
], pauseCampaign)

/**
 * @route   POST /api/campaigns/:id/resume
 * @desc    Resume campaign
 * @access  Private
 */
router.post('/:id/resume', [
  param('id').isUUID().withMessage('Invalid campaign ID'),
  validateRequest
], resumeCampaign)

/**
 * @route   GET /api/campaigns/:id/performance
 * @desc    Get campaign performance data
 * @access  Private
 */
router.get('/:id/performance', [
  param('id').isUUID().withMessage('Invalid campaign ID'),
  query('startDate').optional().isISO8601().withMessage('Start date must be a valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be a valid ISO date'),
  validateRequest
], getCampaignPerformance)

export default router

