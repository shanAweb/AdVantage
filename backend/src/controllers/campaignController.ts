import { Request, Response, NextFunction } from 'express'
import { prisma } from '@/config/database'
import { logger } from '@/utils/logger'
import { ApiError } from '@/middleware/errorHandler'

/**
 * Create a new campaign
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const createCampaign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { name, platform, budget, targetAudience, keywords, adGroups } = req.body

    const campaign = await prisma.campaign.create({
      data: {
        userId,
        name,
        platform,
        budget,
        targetAudience,
        keywords,
        adGroups,
        status: 'draft'
      }
    })

    logger.info('Campaign created', { campaignId: campaign.id, userId, platform })

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: { campaign }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get all campaigns for user
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getCampaigns = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { page = 1, limit = 10, platform, status } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    const where: any = { userId }
    if (platform) where.platform = platform
    if (status) where.status = status

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              performance: true
            }
          }
        }
      }),
      prisma.campaign.count({ where })
    ])

    res.json({
      success: true,
      data: {
        campaigns,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get campaign by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getCampaign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    const campaign = await prisma.campaign.findFirst({
      where: { id, userId },
      include: {
        adGroups_rel: true,
        performance: {
          orderBy: { date: 'desc' },
          take: 30
        }
      }
    })

    if (!campaign) {
      throw new ApiError('Campaign not found', 404)
    }

    res.json({
      success: true,
      data: { campaign }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update campaign
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const updateCampaign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    const updateData = req.body

    const campaign = await prisma.campaign.findFirst({
      where: { id, userId }
    })

    if (!campaign) {
      throw new ApiError('Campaign not found', 404)
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: updateData
    })

    logger.info('Campaign updated', { campaignId: id, userId, updatedFields: Object.keys(updateData) })

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      data: { campaign: updatedCampaign }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete campaign
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const deleteCampaign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    const campaign = await prisma.campaign.findFirst({
      where: { id, userId }
    })

    if (!campaign) {
      throw new ApiError('Campaign not found', 404)
    }

    await prisma.campaign.delete({
      where: { id }
    })

    logger.info('Campaign deleted', { campaignId: id, userId })

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Launch campaign
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const launchCampaign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    const campaign = await prisma.campaign.findFirst({
      where: { id, userId }
    })

    if (!campaign) {
      throw new ApiError('Campaign not found', 404)
    }

    if (campaign.status !== 'draft') {
      throw new ApiError('Only draft campaigns can be launched', 400)
    }

    // TODO: Integrate with actual ad platform APIs
    // For now, just update the status
    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: { status: 'active' }
    })

    logger.info('Campaign launched', { campaignId: id, userId, platform: campaign.platform })

    res.json({
      success: true,
      message: 'Campaign launched successfully',
      data: { campaign: updatedCampaign }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Pause campaign
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const pauseCampaign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    const campaign = await prisma.campaign.findFirst({
      where: { id, userId }
    })

    if (!campaign) {
      throw new ApiError('Campaign not found', 404)
    }

    if (campaign.status !== 'active') {
      throw new ApiError('Only active campaigns can be paused', 400)
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: { status: 'paused' }
    })

    logger.info('Campaign paused', { campaignId: id, userId })

    res.json({
      success: true,
      message: 'Campaign paused successfully',
      data: { campaign: updatedCampaign }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Resume campaign
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const resumeCampaign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    const campaign = await prisma.campaign.findFirst({
      where: { id, userId }
    })

    if (!campaign) {
      throw new ApiError('Campaign not found', 404)
    }

    if (campaign.status !== 'paused') {
      throw new ApiError('Only paused campaigns can be resumed', 400)
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: { status: 'active' }
    })

    logger.info('Campaign resumed', { campaignId: id, userId })

    res.json({
      success: true,
      message: 'Campaign resumed successfully',
      data: { campaign: updatedCampaign }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get campaign performance data
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getCampaignPerformance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    const { startDate, endDate } = req.query

    const campaign = await prisma.campaign.findFirst({
      where: { id, userId }
    })

    if (!campaign) {
      throw new ApiError('Campaign not found', 404)
    }

    const where: any = { campaignId: id }
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      }
    }

    const performance = await prisma.campaignPerformance.findMany({
      where,
      orderBy: { date: 'desc' }
    })

    res.json({
      success: true,
      data: { performance }
    })
  } catch (error) {
    next(error)
  }
}










