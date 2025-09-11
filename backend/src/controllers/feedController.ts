import { Request, Response, NextFunction } from 'express'
import { prisma } from '@/config/database'
import { logger } from '@/utils/logger'
import { ApiError } from '@/middleware/errorHandler'
import { getFeedCrawlQueue } from '@/config/queue'
import { feedExportService } from '@/services/feedExport'
import { feedCrawlerService } from '@/services/feedCrawler'

/**
 * Create a new feed
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const createFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { name, siteUrl, country, currency, selectorConfig } = req.body

    // Validate URL
    try {
      new URL(siteUrl)
    } catch {
      throw new ApiError('Invalid site URL', 400)
    }

    const feed = await prisma.feed.create({
      data: {
        userId,
        name,
        siteUrl,
        country,
        currency: currency || 'USD',
        selectorConfig,
      },
    })

    // Queue the feed for crawling (if Redis is available) or process immediately
    const crawlQueue = getFeedCrawlQueue()
    if (crawlQueue) {
      await crawlQueue.add('crawl-feed', { feedId: feed.id })
      logger.info('Feed created and queued for crawling', { feedId: feed.id, userId, siteUrl })
    } else {
      // Process feed immediately without Redis
      try {
        await feedCrawlerService.crawlFeed(feed.id)
        logger.info('Feed created and crawled immediately', { feedId: feed.id, userId, siteUrl })
      } catch (error) {
        logger.error('Failed to crawl feed immediately:', error)
        // Don't fail the request, just log the error
      }
    }

    res.status(201).json({
      success: true,
      message: 'Feed created successfully',
      data: { feed }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get all feeds for user
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getFeeds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { page = 1, limit = 10 } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    const [feeds, total] = await Promise.all([
      prisma.feed.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              products: true,
              ads: true,
              campaigns: true,
            }
          }
        }
      }),
      prisma.feed.count({ where: { userId } })
    ])

    res.json({
      success: true,
      data: {
        feeds,
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
 * Get feed by ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    const feed = await prisma.feed.findFirst({
      where: { id, userId },
      include: {
        _count: {
          select: {
            products: true,
            ads: true,
            campaigns: true,
          }
        }
      }
    })

    if (!feed) {
      throw new ApiError('Feed not found', 404)
    }

    res.json({
      success: true,
      data: { feed }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update feed
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const updateFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    const updateData = req.body

    // Validate URL if provided
    if (updateData.siteUrl) {
      try {
        new URL(updateData.siteUrl)
      } catch {
        throw new ApiError('Invalid site URL', 400)
      }
    }

    const feed = await prisma.feed.findFirst({
      where: { id, userId }
    })

    if (!feed) {
      throw new ApiError('Feed not found', 404)
    }

    const updatedFeed = await prisma.feed.update({
      where: { id },
      data: updateData
    })

    logger.info('Feed updated', { feedId: id, userId, updatedFields: Object.keys(updateData) })

    res.json({
      success: true,
      message: 'Feed updated successfully',
      data: { feed: updatedFeed }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete feed
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const deleteFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    const feed = await prisma.feed.findFirst({
      where: { id, userId }
    })

    if (!feed) {
      throw new ApiError('Feed not found', 404)
    }

    await prisma.feed.delete({
      where: { id }
    })

    logger.info('Feed deleted', { feedId: id, userId })

    res.json({
      success: true,
      message: 'Feed deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Refresh feed (trigger new crawl)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const refreshFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params

    const feed = await prisma.feed.findFirst({
      where: { id, userId }
    })

    if (!feed) {
      throw new ApiError('Feed not found', 404)
    }

    // Queue the feed for crawling (if Redis is available) or process immediately
    const crawlQueue = getFeedCrawlQueue()
    if (crawlQueue) {
      await crawlQueue.add('crawl-feed', { feedId: feed.id })
      logger.info('Feed refresh queued', { feedId: id, userId })
    } else {
      // Process feed immediately without Redis
      try {
        await feedCrawlerService.crawlFeed(feed.id)
        logger.info('Feed refreshed immediately', { feedId: id, userId })
      } catch (error) {
        logger.error('Failed to refresh feed immediately:', error)
        // Don't fail the request, just log the error
      }
    }

    res.json({
      success: true,
      message: 'Feed refresh queued successfully'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get products for a feed
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getFeedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    const { page = 1, limit = 20, search } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    // Verify feed belongs to user
    const feed = await prisma.feed.findFirst({
      where: { id, userId }
    })

    if (!feed) {
      throw new ApiError('Feed not found', 404)
    }

    const where: any = { feedId: id }
    if (search) {
      where.title = {
        contains: search as string,
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
 * Download feed in various formats
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const downloadFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user.id
    const { id } = req.params
    const { format = 'json' } = req.query

    // Verify feed belongs to user
    const feed = await prisma.feed.findFirst({
      where: { id, userId }
    })

    if (!feed) {
      throw new ApiError('Feed not found', 404)
    }

    // Get all products for the feed
    const products = await prisma.product.findMany({
      where: { feedId: id },
      orderBy: { createdAt: 'desc' }
    })

    let content: string
    let contentType: string
    let filename: string

    switch (format) {
      case 'csv':
        content = feedExportService.exportToCSV(products, feed)
        contentType = 'text/csv'
        filename = `${feed.name.replace(/[^a-zA-Z0-9]/g, '_')}_products.csv`
        break
      case 'xml':
        content = feedExportService.exportToGoogleXML(products, feed)
        contentType = 'application/xml'
        filename = `${feed.name.replace(/[^a-zA-Z0-9]/g, '_')}_products.xml`
        break
      case 'facebook':
        content = feedExportService.exportToFacebookXML(products, feed)
        contentType = 'application/xml'
        filename = `${feed.name.replace(/[^a-zA-Z0-9]/g, '_')}_facebook.xml`
        break
      case 'json':
      default:
        content = feedExportService.exportToJSON(products, feed)
        contentType = 'application/json'
        filename = `${feed.name.replace(/[^a-zA-Z0-9]/g, '_')}_products.json`
        break
    }

    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(content)

    logger.info('Feed downloaded', { feedId: id, userId, format, productCount: products.length })
  } catch (error) {
    next(error)
  }
}

/**
 * Get public feed (no authentication required)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getPublicFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.params
    const { format = 'json' } = req.query

    // Find feed by public token
    const feed = await prisma.feed.findUnique({
      where: { publicToken: token }
    })

    if (!feed) {
      throw new ApiError('Feed not found', 404)
    }

    // Get all products for the feed
    const products = await prisma.product.findMany({
      where: { feedId: feed.id },
      orderBy: { createdAt: 'desc' }
    })

    let content: string
    let contentType: string
    let filename: string

    switch (format) {
      case 'csv':
        content = feedExportService.exportToCSV(products, feed)
        contentType = 'text/csv'
        filename = `${feed.name.replace(/[^a-zA-Z0-9]/g, '_')}_products.csv`
        break
      case 'xml':
        content = feedExportService.exportToGoogleXML(products, feed)
        contentType = 'application/xml'
        filename = `${feed.name.replace(/[^a-zA-Z0-9]/g, '_')}_products.xml`
        break
      case 'facebook':
        content = feedExportService.exportToFacebookXML(products, feed)
        contentType = 'application/xml'
        filename = `${feed.name.replace(/[^a-zA-Z0-9]/g, '_')}_facebook.xml`
        break
      case 'json':
      default:
        content = feedExportService.exportToJSON(products, feed)
        contentType = 'application/json'
        filename = `${feed.name.replace(/[^a-zA-Z0-9]/g, '_')}_products.json`
        break
    }

    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.send(content)

    logger.info('Public feed accessed', { feedId: feed.id, token, format, productCount: products.length })
  } catch (error) {
    next(error)
  }
}

