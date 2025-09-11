import { Request, Response, NextFunction } from 'express'
import { prisma } from '@/config/database'
import { logger } from '@/utils/logger'
import { ApiError } from '@/middleware/errorHandler'

/**
 * Create a new ad from a product
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const createAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { feedId, productId, headline, description } = req.body

    // Verify feed belongs to user
    const feed = await prisma.feed.findFirst({
      where: { id: feedId, userId }
    })

    if (!feed) {
      throw new ApiError('Feed not found', 404)
    }

    // Get product
    const product = await prisma.product.findFirst({
      where: { id: productId, feedId }
    })

    if (!product) {
      throw new ApiError('Product not found', 404)
    }

    // Create ad with defaults from product if not provided
    const ad = await prisma.ad.create({
      data: {
        userId,
        feedId,
        productId,
        headline: headline || product.title,
        description: description || product.description || '',
        finalUrl: product.link,
        imageUrl: product.imageUrl,
      },
      include: {
        product: true,
        feed: true,
      }
    })

    logger.info('Ad created', { adId: ad.id, userId, feedId, productId })

    res.status(201).json({
      success: true,
      message: 'Ad created successfully',
      data: { ad }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get all ads for user
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getAds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { page = 1, limit = 20, feedId, search } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    const where: any = { userId }
    if (feedId) where.feedId = feedId
    if (search) {
      where.OR = [
        { headline: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { product: { title: { contains: search as string, mode: 'insensitive' } } }
      ]
    }

    const [ads, total] = await Promise.all([
      prisma.ad.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              currency: true,
              imageUrl: true,
            }
          },
          feed: {
            select: {
              id: true,
              name: true,
            }
          },
          campaigns: {
            include: {
              campaign: {
                select: {
                  id: true,
                  name: true,
                  status: true,
                  channel: true,
                }
              }
            }
          },
          _count: {
            select: {
              campaigns: true,
            }
          }
        }
      }),
      prisma.ad.count({ where })
    ])

    res.json({
      success: true,
      data: {
        ads,
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
 * Get ad by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    const ad = await prisma.ad.findFirst({
      where: { id, userId },
      include: {
        product: true,
        feed: {
          select: {
            id: true,
            name: true,
            siteUrl: true,
          }
        },
        campaigns: {
          include: {
            campaign: {
              select: {
                id: true,
                name: true,
                status: true,
                channel: true,
                budget: true,
                currency: true,
                country: true,
              }
            }
          }
        }
      }
    })

    if (!ad) {
      throw new ApiError('Ad not found', 404)
    }

    res.json({
      success: true,
      data: { ad }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update ad
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const updateAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    const updateData = req.body

    const ad = await prisma.ad.findFirst({
      where: { id, userId }
    })

    if (!ad) {
      throw new ApiError('Ad not found', 404)
    }

    const updatedAd = await prisma.ad.update({
      where: { id },
      data: updateData,
      include: {
        product: true,
        feed: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    logger.info('Ad updated', { adId: id, userId, updatedFields: Object.keys(updateData) })

    res.json({
      success: true,
      message: 'Ad updated successfully',
      data: { ad: updatedAd }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete ad
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const deleteAd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    const ad = await prisma.ad.findFirst({
      where: { id, userId }
    })

    if (!ad) {
      throw new ApiError('Ad not found', 404)
    }

    await prisma.ad.delete({
      where: { id }
    })

    logger.info('Ad deleted', { adId: id, userId })

    res.json({
      success: true,
      message: 'Ad deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Bulk create ads from products
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const bulkCreateAds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { feedId, productIds, headlineTemplate, descriptionTemplate } = req.body

    // Verify feed belongs to user
    const feed = await prisma.feed.findFirst({
      where: { id: feedId, userId }
    })

    if (!feed) {
      throw new ApiError('Feed not found', 404)
    }

    // Get products
    const products = await prisma.product.findMany({
      where: { 
        id: { in: productIds },
        feedId 
      }
    })

    if (products.length === 0) {
      throw new ApiError('No valid products found', 404)
    }

    // Create ads
    const ads = await Promise.all(
      products.map(product => 
        prisma.ad.create({
          data: {
            userId,
            feedId,
            productId: product.id,
            headline: headlineTemplate 
              ? headlineTemplate.replace('{title}', product.title)
              : product.title,
            description: descriptionTemplate 
              ? descriptionTemplate.replace('{description}', product.description || '')
              : product.description || '',
            finalUrl: product.link,
            imageUrl: product.imageUrl,
          },
          include: {
            product: true,
          }
        })
      )
    )

    logger.info('Bulk ads created', { userId, feedId, count: ads.length })

    res.status(201).json({
      success: true,
      message: `${ads.length} ads created successfully`,
      data: { ads }
    })
  } catch (error) {
    next(error)
  }
}


