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
    const { feedId, name, channel, budget, currency, country, adIds } = req.body

    // Verify feed belongs to user
    const feed = await prisma.feed.findFirst({
      where: { id: feedId, userId }
    })

    if (!feed) {
      throw new ApiError('Feed not found', 404)
    }

    // Verify all ads belong to user and feed
    if (adIds && adIds.length > 0) {
      const ads = await prisma.ad.findMany({
        where: { 
          id: { in: adIds },
          userId,
          feedId
        }
      })

      if (ads.length !== adIds.length) {
        throw new ApiError('Some ads not found or do not belong to this feed', 400)
      }
    }

    // Create campaign
    const campaign = await prisma.newCampaign.create({
      data: {
        userId,
        feedId,
        name,
        channel,
        budget,
        currency: currency || 'USD',
        country,
        status: 'draft',
      },
      include: {
        feed: {
          select: {
            id: true,
            name: true,
            siteUrl: true,
          }
        }
      }
    })

    // Add ads to campaign if provided
    if (adIds && adIds.length > 0) {
      await prisma.newCampaignAd.createMany({
        data: adIds.map((adId: string) => ({
          campaignId: campaign.id,
          adId,
        }))
      })
    }

    // Get campaign with ads
    const campaignWithAds = await prisma.newCampaign.findUnique({
      where: { id: campaign.id },
      include: {
        feed: {
          select: {
            id: true,
            name: true,
            siteUrl: true,
          }
        },
        ads: {
          include: {
            ad: {
              include: {
                product: {
                  select: {
                    id: true,
                    title: true,
                    price: true,
                    currency: true,
                    imageUrl: true,
                  }
                }
              }
            }
          }
        }
      }
    })

    logger.info('Campaign created', { campaignId: campaign.id, userId, feedId, adCount: adIds?.length || 0 })

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: { campaign: campaignWithAds }
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
    const { page = 1, limit = 10, feedId, status, channel } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    const where: any = { userId }
    if (feedId) where.feedId = feedId
    if (status) where.status = status
    if (channel) where.channel = channel

    const [campaigns, total] = await Promise.all([
      prisma.newCampaign.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          feed: {
            select: {
              id: true,
              name: true,
              siteUrl: true,
            }
          },
          ads: {
            include: {
              ad: {
                select: {
                  id: true,
                  headline: true,
                  description: true,
                  imageUrl: true,
                  product: {
                    select: {
                      id: true,
                      title: true,
                      price: true,
                      currency: true,
                    }
                  }
                }
              }
            }
          },
          _count: {
            select: {
              ads: true,
            }
          }
        }
      }),
      prisma.newCampaign.count({ where })
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

    const campaign = await prisma.newCampaign.findFirst({
      where: { id, userId },
      include: {
        feed: {
          select: {
            id: true,
            name: true,
            siteUrl: true,
            country: true,
            currency: true,
          }
        },
        ads: {
          include: {
            ad: {
              include: {
                product: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true,
                    currency: true,
                    imageUrl: true,
                    link: true,
                    availability: true,
                    brand: true,
                    category: true,
                  }
                }
              }
            }
          }
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

    const campaign = await prisma.newCampaign.findFirst({
      where: { id, userId }
    })

    if (!campaign) {
      throw new ApiError('Campaign not found', 404)
    }

    const updatedCampaign = await prisma.newCampaign.update({
      where: { id },
      data: updateData,
      include: {
        feed: {
          select: {
            id: true,
            name: true,
            siteUrl: true,
          }
        },
        ads: {
          include: {
            ad: {
              include: {
                product: {
                  select: {
                    id: true,
                    title: true,
                    price: true,
                    currency: true,
                    imageUrl: true,
                  }
                }
              }
            }
          }
        }
      }
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

    const campaign = await prisma.newCampaign.findFirst({
      where: { id, userId }
    })

    if (!campaign) {
      throw new ApiError('Campaign not found', 404)
    }

    await prisma.newCampaign.delete({
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
 * Add ads to campaign
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const addAdsToCampaign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    const { adIds } = req.body

    // Verify campaign belongs to user
    const campaign = await prisma.newCampaign.findFirst({
      where: { id, userId }
    })

    if (!campaign) {
      throw new ApiError('Campaign not found', 404)
    }

    // Verify all ads belong to user and feed
    const ads = await prisma.ad.findMany({
      where: { 
        id: { in: adIds },
        userId,
        feedId: campaign.feedId
      }
    })

    if (ads.length !== adIds.length) {
      throw new ApiError('Some ads not found or do not belong to this feed', 400)
    }

    // Add ads to campaign (ignore duplicates)
    await prisma.newCampaignAd.createMany({
      data: adIds.map((adId: string) => ({
        campaignId: campaign.id,
        adId,
      })),
      skipDuplicates: true
    })

    logger.info('Ads added to campaign', { campaignId: id, userId, adCount: adIds.length })

    res.json({
      success: true,
      message: `${adIds.length} ads added to campaign successfully`
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Remove ads from campaign
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const removeAdsFromCampaign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    const { adIds } = req.body

    // Verify campaign belongs to user
    const campaign = await prisma.newCampaign.findFirst({
      where: { id, userId }
    })

    if (!campaign) {
      throw new ApiError('Campaign not found', 404)
    }

    // Remove ads from campaign
    await prisma.newCampaignAd.deleteMany({
      where: {
        campaignId: campaign.id,
        adId: { in: adIds }
      }
    })

    logger.info('Ads removed from campaign', { campaignId: id, userId, adCount: adIds.length })

    res.json({
      success: true,
      message: `${adIds.length} ads removed from campaign successfully`
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Launch campaign (change status to active)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const launchCampaign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    const campaign = await prisma.newCampaign.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: {
            ads: true
          }
        }
      }
    })

    if (!campaign) {
      throw new ApiError('Campaign not found', 404)
    }

    if (campaign.status !== 'draft') {
      throw new ApiError('Only draft campaigns can be launched', 400)
    }

    if (campaign._count.ads === 0) {
      throw new ApiError('Campaign must have at least one ad to launch', 400)
    }

    const updatedCampaign = await prisma.newCampaign.update({
      where: { id },
      data: { status: 'active' }
    })

    logger.info('Campaign launched', { campaignId: id, userId, channel: campaign.channel })

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

    const campaign = await prisma.newCampaign.findFirst({
      where: { id, userId }
    })

    if (!campaign) {
      throw new ApiError('Campaign not found', 404)
    }

    if (campaign.status !== 'active') {
      throw new ApiError('Only active campaigns can be paused', 400)
    }

    const updatedCampaign = await prisma.newCampaign.update({
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


