import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '@/config/database'
import { logger } from '@/utils/logger'
import { ApiError } from '@/middleware/errorHandler'

/**
 * Get user profile
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        _count: {
          select: {
            campaigns: true,
            integrations: true
          }
        }
      }
    })

    if (!user) {
      throw new ApiError('User not found', 404)
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
          phone: user.phone,
          timezone: user.timezone,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          subscription: user.subscription,
          stats: {
            campaignsCount: user._count.campaigns,
            integrationsCount: user._count.integrations
          }
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update user profile
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { firstName, lastName, company, phone, timezone } = req.body

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(company !== undefined && { company }),
        ...(phone !== undefined && { phone }),
        ...(timezone && { timezone })
      },
      include: {
        subscription: true
      }
    })

    logger.info('User profile updated', { userId, updatedFields: Object.keys(req.body) })

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
          phone: user.phone,
          timezone: user.timezone,
          subscription: user.subscription
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Change user password
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { currentPassword, newPassword } = req.body

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      throw new ApiError('User not found', 404)
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      throw new ApiError('Current password is incorrect', 400)
    }

    // Hash new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    // Delete all refresh tokens for security
    await prisma.refreshToken.deleteMany({
      where: { userId }
    })

    logger.info('User password changed', { userId })

    res.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get user statistics
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getUserStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id

    // Get campaign statistics
    const campaignStats = await prisma.campaign.aggregate({
      where: { userId },
      _count: {
        id: true
      },
      _sum: {
        budget: true
      }
    })

    // Get active campaigns count
    const activeCampaigns = await prisma.campaign.count({
      where: {
        userId,
        status: 'active'
      }
    })

    // Get total spend (this would come from analytics in real implementation)
    const totalSpend = 0 // TODO: Calculate from campaign performance data

    // Get conversion count (this would come from analytics in real implementation)
    const totalConversions = 0 // TODO: Calculate from conversion data

    res.json({
      success: true,
      data: {
        stats: {
          totalCampaigns: campaignStats._count.id,
          activeCampaigns,
          totalBudget: campaignStats._sum.budget || 0,
          totalSpend,
          totalConversions
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update user subscription
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const updateSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { planId, paymentMethodId } = req.body

    // TODO: Integrate with Stripe for subscription management
    // This is a placeholder implementation

    const subscription = await prisma.subscription.update({
      where: { userId },
      data: {
        planId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })

    logger.info('User subscription updated', { userId, planId })

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      data: {
        subscription
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete user account
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id

    // Delete user and all related data (cascade delete)
    await prisma.user.delete({
      where: { id: userId }
    })

    logger.info('User account deleted', { userId })

    res.json({
      success: true,
      message: 'Account deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

