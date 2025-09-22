import { Request, Response, NextFunction } from 'express'
import { prisma } from '@/config/database'
import { logger } from '@/utils/logger'

/**
 * Handle Stripe webhooks
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const stripeWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, data } = req.body

    // Store webhook event
    await prisma.webhookEvent.create({
      data: {
        platform: 'stripe',
        eventType: type,
        payload: data
      }
    })

    // Handle different event types
    switch (type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        // Handle subscription changes
        logger.info('Stripe subscription event', { type, subscriptionId: data.object.id })
        break
      
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        logger.info('Stripe subscription cancelled', { subscriptionId: data.object.id })
        break
      
      case 'invoice.payment_succeeded':
        // Handle successful payment
        logger.info('Stripe payment succeeded', { invoiceId: data.object.id })
        break
      
      case 'invoice.payment_failed':
        // Handle failed payment
        logger.info('Stripe payment failed', { invoiceId: data.object.id })
        break
      
      default:
        logger.info('Unhandled Stripe webhook event', { type })
    }

    res.json({ success: true, message: 'Webhook processed' })
  } catch (error) {
    logger.error('Stripe webhook error:', error)
    next(error)
  }
}

/**
 * Handle Google Ads webhooks
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const googleAdsWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { eventType, resourceName } = req.body

    // Store webhook event
    await prisma.webhookEvent.create({
      data: {
        platform: 'google',
        eventType,
        payload: { resourceName }
      }
    })

    // Handle different event types
    switch (eventType) {
      case 'campaign.created':
        logger.info('Google Ads campaign created', { resourceName })
        break
      
      case 'campaign.updated':
        logger.info('Google Ads campaign updated', { resourceName })
        break
      
      case 'campaign.paused':
        logger.info('Google Ads campaign paused', { resourceName })
        break
      
      case 'campaign.resumed':
        logger.info('Google Ads campaign resumed', { resourceName })
        break
      
      default:
        logger.info('Unhandled Google Ads webhook event', { eventType })
    }

    res.json({ success: true, message: 'Webhook processed' })
  } catch (error) {
    logger.error('Google Ads webhook error:', error)
    next(error)
  }
}

/**
 * Handle Microsoft Ads webhooks
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const microsoftAdsWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { eventType, resourceId } = req.body

    // Store webhook event
    await prisma.webhookEvent.create({
      data: {
        platform: 'microsoft',
        eventType,
        payload: { resourceId }
      }
    })

    // Handle different event types
    switch (eventType) {
      case 'campaign.created':
        logger.info('Microsoft Ads campaign created', { resourceId })
        break
      
      case 'campaign.updated':
        logger.info('Microsoft Ads campaign updated', { resourceId })
        break
      
      case 'campaign.paused':
        logger.info('Microsoft Ads campaign paused', { resourceId })
        break
      
      case 'campaign.resumed':
        logger.info('Microsoft Ads campaign resumed', { resourceId })
        break
      
      default:
        logger.info('Unhandled Microsoft Ads webhook event', { eventType })
    }

    res.json({ success: true, message: 'Webhook processed' })
  } catch (error) {
    logger.error('Microsoft Ads webhook error:', error)
    next(error)
  }
}

/**
 * Handle YouTube webhooks
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const youtubeWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { eventType, videoId } = req.body

    // Store webhook event
    await prisma.webhookEvent.create({
      data: {
        platform: 'youtube',
        eventType,
        payload: { videoId }
      }
    })

    // Handle different event types
    switch (eventType) {
      case 'video.uploaded':
        logger.info('YouTube video uploaded', { videoId })
        break
      
      case 'video.published':
        logger.info('YouTube video published', { videoId })
        break
      
      case 'video.updated':
        logger.info('YouTube video updated', { videoId })
        break
      
      case 'video.deleted':
        logger.info('YouTube video deleted', { videoId })
        break
      
      default:
        logger.info('Unhandled YouTube webhook event', { eventType })
    }

    res.json({ success: true, message: 'Webhook processed' })
  } catch (error) {
    logger.error('YouTube webhook error:', error)
    next(error)
  }
}











