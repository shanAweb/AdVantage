import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/config/database'
import { logger } from '@/utils/logger'
import { ApiError } from '@/middleware/errorHandler'

/**
 * Register a new user
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, firstName, lastName, company } = req.body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new ApiError('User already exists with this email', 400)
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        company,
        subscription: {
          create: {
            planId: 'free',
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          }
        }
      },
      include: {
        subscription: true
      }
    })

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    )

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    logger.info('User registered successfully', { userId: user.id, email: user.email })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
          subscription: user.subscription
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Login user
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        subscription: true
      }
    })

    if (!user) {
      throw new ApiError('Invalid credentials', 401)
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new ApiError('Invalid credentials', 401)
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    )

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })

    logger.info('User logged in successfully', { userId: user.id, email: user.email })

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
          subscription: user.subscription
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Logout user
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body
    const userId = (req as any).user.id

    // Remove refresh token
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: {
          token: refreshToken,
          userId
        }
      })
    }

    logger.info('User logged out successfully', { userId })

    res.json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Refresh access token
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any

    // Check if refresh token exists in database
    const tokenRecord = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: decoded.userId,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!tokenRecord) {
      throw new ApiError('Invalid refresh token', 401)
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        subscription: true
      }
    })

    if (!user) {
      throw new ApiError('User not found', 404)
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    )

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Send password reset email
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Don't reveal if user exists or not
      res.json({
        success: true,
        message: 'If an account with that email exists, we sent a password reset link.'
      })
      return
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    )

    // Store reset token
    await prisma.passwordReset.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      }
    })

    // TODO: Send email with reset link
    logger.info('Password reset token generated', { userId: user.id, email: user.email })

    res.json({
      success: true,
      message: 'If an account with that email exists, we sent a password reset link.'
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Reset user password
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, password } = req.body

    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    // Check if reset token exists and is valid
    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        token,
        userId: decoded.userId,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!resetRecord) {
      throw new ApiError('Invalid or expired reset token', 400)
    }

    // Hash new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Update user password
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword }
    })

    // Delete reset token
    await prisma.passwordReset.delete({
      where: { id: resetRecord.id }
    })

    // Delete all refresh tokens for security
    await prisma.refreshToken.deleteMany({
      where: { userId: decoded.userId }
    })

    logger.info('Password reset successfully', { userId: decoded.userId })

    res.json({
      success: true,
      message: 'Password reset successfully'
    })
  } catch (error) {
    next(error)
  }
}

