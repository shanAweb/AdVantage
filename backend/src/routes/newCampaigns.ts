import { Router } from 'express'
import { body, param, query } from 'express-validator'
import { 
  createCampaign, 
  getCampaigns, 
  getCampaign, 
  updateCampaign, 
  deleteCampaign,
  addAdsToCampaign,
  removeAdsFromCampaign,
  launchCampaign,
  pauseCampaign
} from '@/controllers/newCampaignController'
import { validateRequest } from '@/middleware/validateRequest'
import { authenticate } from '@/middleware/auth'

const router = Router()

/**
 * @route   POST /api/campaigns
 * @desc    Create a new campaign
 * @access  Private
 */
router.post('/', [
  authenticate,
  body('feedId').isString().withMessage('Feed ID is required'),
  body('name').notEmpty().withMessage('Campaign name is required'),
  body('channel').isIn(['google', 'facebook', 'linkedin', 'microsoft']).withMessage('Channel must be google, facebook, linkedin, or microsoft'),
  body('budget').isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('currency').optional().isString().withMessage('Currency must be a string'),
  body('country').notEmpty().withMessage('Country is required'),
  body('adIds').optional().isArray().withMessage('Ad IDs must be an array'),
  body('adIds.*').optional().isString().withMessage('Each ad ID must be a string'),
  validateRequest
], createCampaign)

/**
 * @route   GET /api/campaigns
 * @desc    Get all campaigns for user
 * @access  Private
 */
router.get('/', [
  authenticate,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('feedId').optional().isString().withMessage('Feed ID must be a string'),
  query('status').optional().isIn(['draft', 'active', 'paused', 'completed']).withMessage('Status must be draft, active, paused, or completed'),
  query('channel').optional().isIn(['google', 'facebook', 'linkedin', 'microsoft']).withMessage('Channel must be google, facebook, linkedin, or microsoft'),
  validateRequest
], getCampaigns)

/**
 * @route   GET /api/campaigns/:id
 * @desc    Get campaign by ID
 * @access  Private
 */
router.get('/:id', [
  authenticate,
  param('id').isString().withMessage('Campaign ID is required'),
  validateRequest
], getCampaign)

/**
 * @route   PUT /api/campaigns/:id
 * @desc    Update campaign
 * @access  Private
 */
router.put('/:id', [
  authenticate,
  param('id').isString().withMessage('Campaign ID is required'),
  body('name').optional().notEmpty().withMessage('Campaign name cannot be empty'),
  body('channel').optional().isIn(['google', 'facebook', 'linkedin', 'microsoft']).withMessage('Channel must be google, facebook, linkedin, or microsoft'),
  body('budget').optional().isFloat({ min: 0 }).withMessage('Budget must be a positive number'),
  body('currency').optional().isString().withMessage('Currency must be a string'),
  body('country').optional().notEmpty().withMessage('Country cannot be empty'),
  body('status').optional().isIn(['draft', 'active', 'paused', 'completed']).withMessage('Status must be draft, active, paused, or completed'),
  validateRequest
], updateCampaign)

/**
 * @route   DELETE /api/campaigns/:id
 * @desc    Delete campaign
 * @access  Private
 */
router.delete('/:id', [
  authenticate,
  param('id').isString().withMessage('Campaign ID is required'),
  validateRequest
], deleteCampaign)

/**
 * @route   POST /api/campaigns/:id/ads
 * @desc    Add ads to campaign
 * @access  Private
 */
router.post('/:id/ads', [
  authenticate,
  param('id').isString().withMessage('Campaign ID is required'),
  body('adIds').isArray({ min: 1 }).withMessage('Ad IDs array is required'),
  body('adIds.*').isString().withMessage('Each ad ID must be a string'),
  validateRequest
], addAdsToCampaign)

/**
 * @route   DELETE /api/campaigns/:id/ads
 * @desc    Remove ads from campaign
 * @access  Private
 */
router.delete('/:id/ads', [
  authenticate,
  param('id').isString().withMessage('Campaign ID is required'),
  body('adIds').isArray({ min: 1 }).withMessage('Ad IDs array is required'),
  body('adIds.*').isString().withMessage('Each ad ID must be a string'),
  validateRequest
], removeAdsFromCampaign)

/**
 * @route   POST /api/campaigns/:id/launch
 * @desc    Launch campaign (change status to active)
 * @access  Private
 */
router.post('/:id/launch', [
  authenticate,
  param('id').isString().withMessage('Campaign ID is required'),
  validateRequest
], launchCampaign)

/**
 * @route   POST /api/campaigns/:id/pause
 * @desc    Pause campaign
 * @access  Private
 */
router.post('/:id/pause', [
  authenticate,
  param('id').isString().withMessage('Campaign ID is required'),
  validateRequest
], pauseCampaign)

export default router


