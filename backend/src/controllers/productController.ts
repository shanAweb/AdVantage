import { Request, Response, NextFunction } from 'express'
import { prisma } from '@/config/database'
import { logger } from '@/utils/logger'
import { ApiError } from '@/middleware/errorHandler'

/**
 * Get all products for user across all feeds
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { page = 1, limit = 20, search, feedId, category } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    // Build where clause
    const where: any = {
      feed: {
        userId
      }
    }

    if (search) {
      where.title = {
        contains: search as string,
        mode: 'insensitive'
      }
    }

    if (feedId) {
      where.feedId = feedId as string
    }

    if (category) {
      where.category = {
        contains: category as string,
        mode: 'insensitive'
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
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
              country: true,
              currency: true
            }
          },
          _count: {
            select: {
              ads: true
            }
          }
        }
      }),
      prisma.product.count({ where })
    ])

    res.json({
      success: true,
      data: {
        products,
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
 * Get product by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    const product = await prisma.product.findFirst({
      where: {
        id,
        feed: {
          userId
        }
      },
      include: {
        feed: {
          select: {
            id: true,
            name: true,
            siteUrl: true,
            country: true,
            currency: true
          }
        },
        ads: {
          select: {
            id: true,
            headline: true,
            description: true,
            createdAt: true
          }
        }
      }
    })

    if (!product) {
      throw new ApiError('Product not found', 404)
    }

    res.json({
      success: true,
      data: { product }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete product
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    const product = await prisma.product.findFirst({
      where: {
        id,
        feed: {
          userId
        }
      }
    })

    if (!product) {
      throw new ApiError('Product not found', 404)
    }

    await prisma.product.delete({
      where: { id }
    })

    logger.info('Product deleted', { productId: id, userId })

    res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get product statistics
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getProductStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id

    const [
      totalProducts,
      productsWithAds,
      productsByCategory,
      recentProducts
    ] = await Promise.all([
      prisma.product.count({
        where: {
          feed: { userId }
        }
      }),
      prisma.product.count({
        where: {
          feed: { userId },
          ads: {
            some: {}
          }
        }
      }),
      prisma.product.groupBy({
        by: ['category'],
        where: {
          feed: { userId },
          category: {
            not: null
          }
        },
        _count: {
          category: true
        },
        orderBy: {
          _count: {
            category: 'desc'
          }
        },
        take: 10
      }),
      prisma.product.count({
        where: {
          feed: { userId },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      })
    ])

    res.json({
      success: true,
      data: {
        totalProducts,
        productsWithAds,
        productsWithoutAds: totalProducts - productsWithAds,
        productsByCategory,
        recentProducts
      }
    })
  } catch (error) {
    next(error)
  }
}
