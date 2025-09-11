import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ApiError } from './errorHandler'

/**
 * Request validation middleware
 * Checks validation results and throws error if validation fails
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined
    }))

    throw new ApiError('Validation failed', 400, true, errorMessages)
  }

  next()
}










