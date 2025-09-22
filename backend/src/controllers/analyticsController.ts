import { Request, Response, NextFunction } from 'express'
import { prisma } from '@/config/database'
import { logger } from '@/utils/logger'
import { ApiError } from '@/middleware/errorHandler'

/**
 * Get dashboard statistics
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { startDate, endDate, platform } = req.query

    const where: any = { userId }
    if (platform && platform !== 'all') {
      where.platform = platform
    }

    // Get campaign counts
    const campaignStats = await prisma.campaign.aggregate({
      where,
      _count: { id: true },
      _sum: { budget: true }
    })

    // Get performance data
    const performanceWhere: any = {}
    if (startDate && endDate) {
      performanceWhere.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      }
    }

    const performanceStats = await prisma.campaignPerformance.aggregate({
      where: performanceWhere,
      _sum: {
        impressions: true,
        clicks: true,
        spend: true,
        conversions: true,
        conversionsValue: true
      },
      _avg: {
        ctr: true,
        cpc: true,
        cpm: true,
        roas: true
      }
    })

    // Get recent campaigns
    const recentCampaigns = await prisma.campaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        platform: true,
        status: true,
        budget: true,
        createdAt: true
      }
    })

    res.json({
      success: true,
      data: {
        stats: {
          totalCampaigns: campaignStats._count.id,
          totalBudget: campaignStats._sum.budget || 0,
          totalImpressions: performanceStats._sum.impressions || 0,
          totalClicks: performanceStats._sum.clicks || 0,
          totalSpend: performanceStats._sum.spend || 0,
          totalConversions: performanceStats._sum.conversions || 0,
          totalConversionsValue: performanceStats._sum.conversionsValue || 0,
          avgCtr: performanceStats._avg.ctr || 0,
          avgCpc: performanceStats._avg.cpc || 0,
          avgCpm: performanceStats._avg.cpm || 0,
          avgRoas: performanceStats._avg.roas || 0
        },
        recentCampaigns
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get campaign analytics
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getCampaignAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { startDate, endDate, campaignIds, platform } = req.query

    const where: any = { userId }
    if (platform && platform !== 'all') {
      where.platform = platform
    }
    if (campaignIds) {
      where.id = { in: (campaignIds as string).split(',') }
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        performance: {
          where: startDate && endDate ? {
            date: {
              gte: new Date(startDate as string),
              lte: new Date(endDate as string)
            }
          } : undefined,
          orderBy: { date: 'desc' }
        }
      }
    })

    res.json({
      success: true,
      data: { campaigns }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get platform-specific analytics
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getPlatformAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { platform, startDate, endDate } = req.query

    if (!platform || !['google', 'microsoft', 'youtube'].includes(platform as string)) {
      throw new ApiError('Valid platform is required', 400)
    }

    const where: any = { userId, platform }
    const performanceWhere: any = {}
    
    if (startDate && endDate) {
      performanceWhere.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      }
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        performance: {
          where: performanceWhere,
          orderBy: { date: 'desc' }
        }
      }
    })

    // Calculate platform totals
    const platformStats = campaigns.reduce((acc, campaign) => {
      const campaignPerformance = campaign.performance.reduce((campAcc, perf) => ({
        impressions: campAcc.impressions + perf.impressions,
        clicks: campAcc.clicks + perf.clicks,
        spend: campAcc.spend + perf.spend,
        conversions: campAcc.conversions + perf.conversions,
        conversionsValue: campAcc.conversionsValue + perf.conversionsValue
      }), { impressions: 0, clicks: 0, spend: 0, conversions: 0, conversionsValue: 0 })

      return {
        impressions: acc.impressions + campaignPerformance.impressions,
        clicks: acc.clicks + campaignPerformance.clicks,
        spend: acc.spend + campaignPerformance.spend,
        conversions: acc.conversions + campaignPerformance.conversions,
        conversionsValue: acc.conversionsValue + campaignPerformance.conversionsValue,
        campaigns: acc.campaigns + 1
      }
    }, { impressions: 0, clicks: 0, spend: 0, conversions: 0, conversionsValue: 0, campaigns: 0 })

    res.json({
      success: true,
      data: {
        platform,
        stats: platformStats,
        campaigns
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get conversion analytics
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getConversionAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { startDate, endDate, campaignId } = req.query

    const where: any = {}
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      }
    }

    if (campaignId) {
      where.campaignId = campaignId
    } else {
      // Get all campaigns for user
      const userCampaigns = await prisma.campaign.findMany({
        where: { userId },
        select: { id: true }
      })
      where.campaignId = { in: userCampaigns.map(c => c.id) }
    }

    const conversions = await prisma.campaignPerformance.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            platform: true
          }
        }
      }
    })

    res.json({
      success: true,
      data: { conversions }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get keyword performance analytics
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getKeywordPerformance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { startDate, endDate, campaignId, platform } = req.query

    // TODO: Implement keyword performance tracking
    // This would require a separate keyword performance table
    // For now, return mock data

    res.json({
      success: true,
      message: 'Keyword performance tracking not yet implemented',
      data: { keywords: [] }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get audience insights
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getAudienceInsights = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { startDate, endDate, campaignId } = req.query

    // TODO: Implement audience insights
    // This would require integration with analytics platforms
    // For now, return mock data

    res.json({
      success: true,
      message: 'Audience insights not yet implemented',
      data: { insights: [] }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Export analytics data
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const exportAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { startDate, endDate, format, type } = req.query

    // TODO: Implement data export functionality
    // This would generate CSV/Excel/JSON files based on the requested data

    res.json({
      success: true,
      message: 'Data export not yet implemented',
      data: { downloadUrl: null }
    })
  } catch (error) {
    next(error)
  }
}











