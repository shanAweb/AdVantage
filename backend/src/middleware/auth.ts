import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '@/config/database'
import { logger } from '@/utils/logger'
import { ApiError } from './errorHandler'

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Access token required', 401)
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        subscription: true
      }
    })

    if (!user) {
      throw new ApiError('User not found', 401)
    }

    // Attach user to request
    ;(req as any).user = user

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError('Invalid token', 401))
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError('Token expired', 401))
    } else {
      next(error)
    }
  }
}

/**
 * Optional authentication middleware
 * Similar to authenticate but doesn't throw error if no token
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next()
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          subscription: true
        }
      })

      if (user) {
        ;(req as any).user = user
      }
    } catch (jwtError) {
      // Ignore JWT errors for optional auth
      logger.debug('Optional auth JWT error:', jwtError)
    }

    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Authorization middleware for subscription plans
 * @param requiredPlan - Required subscription plan
 * @returns Middleware function
 */
export const requirePlan = (requiredPlan: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = (req as any).user

      if (!user) {
        throw new ApiError('Authentication required', 401)
      }

      const userPlan = user.subscription?.planId

      // Define plan hierarchy
      const planHierarchy = {
        free: 0,
        starter: 1,
        professional: 2,
        enterprise: 3
      }

      const userPlanLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0
      const requiredPlanLevel = planHierarchy[requiredPlan as keyof typeof planHierarchy] || 0

      if (userPlanLevel < requiredPlanLevel) {
        throw new ApiError(`This feature requires ${requiredPlan} plan or higher`, 403)
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

/**
 * Rate limiting middleware for API endpoints
 * @param windowMs - Time window in milliseconds
 * @param maxRequests - Maximum requests per window
 * @returns Middleware function
 */
export const createRateLimit = (windowMs: number, maxRequests: number) => {
  const requests = new Map()

  return (req: Request, res: Response, next: NextFunction): void => {
    const userId = (req as any).user?.id || req.ip
    const now = Date.now()
    const windowStart = now - windowMs

    // Clean old entries
    for (const [key, timestamp] of requests.entries()) {
      if (timestamp < windowStart) {
        requests.delete(key)
      }
    }

    // Check current user's request count
    const userRequests = Array.from(requests.entries())
      .filter(([key, timestamp]) => key.startsWith(userId) && timestamp > windowStart)

    if (userRequests.length >= maxRequests) {
      throw new ApiError('Too many requests, please try again later', 429)
    }

    // Record this request
    requests.set(`${userId}-${now}`, now)

    next()
  }
}











