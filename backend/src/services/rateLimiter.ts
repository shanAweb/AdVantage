import { logger } from '@/utils/logger'

/**
 * Rate limiter for controlling request frequency
 */
export class RateLimiter {
  private requestTimes: Map<string, number[]> = new Map()
  private readonly maxRequests: number
  private readonly timeWindow: number
  private readonly delayBetweenRequests: number

  constructor(
    maxRequests: number = 2,
    timeWindow: number = 60000, // 1 minute
    delayBetweenRequests: number = 1000 // 1 second
  ) {
    this.maxRequests = maxRequests
    this.timeWindow = timeWindow
    this.delayBetweenRequests = delayBetweenRequests
  }

  /**
   * Check if a request can be made for a given domain
   * @param domain - Domain to check
   * @returns boolean - Whether request is allowed
   */
  canMakeRequest(domain: string): boolean {
    const now = Date.now()
    const requestTimes = this.requestTimes.get(domain) || []
    
    // Remove old requests outside the time window
    const validRequests = requestTimes.filter(time => now - time < this.timeWindow)
    
    // Update the request times
    this.requestTimes.set(domain, validRequests)
    
    // Check if we can make another request
    return validRequests.length < this.maxRequests
  }

  /**
   * Record a request for a given domain
   * @param domain - Domain to record request for
   */
  recordRequest(domain: string): void {
    const now = Date.now()
    const requestTimes = this.requestTimes.get(domain) || []
    requestTimes.push(now)
    this.requestTimes.set(domain, requestTimes)
  }

  /**
   * Wait for the appropriate delay before making a request
   * @param domain - Domain to wait for
   * @returns Promise<void>
   */
  async waitForDelay(domain: string): Promise<void> {
    const requestTimes = this.requestTimes.get(domain) || []
    
    if (requestTimes.length > 0) {
      const lastRequest = Math.max(...requestTimes)
      const timeSinceLastRequest = Date.now() - lastRequest
      
      if (timeSinceLastRequest < this.delayBetweenRequests) {
        const waitTime = this.delayBetweenRequests - timeSinceLastRequest
        logger.info(`Rate limiting: waiting ${waitTime}ms before next request to ${domain}`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }

  /**
   * Get the delay needed before the next request
   * @param domain - Domain to check
   * @returns number - Delay in milliseconds
   */
  getDelayNeeded(domain: string): number {
    const requestTimes = this.requestTimes.get(domain) || []
    
    if (requestTimes.length === 0) {
      return 0
    }
    
    const lastRequest = Math.max(...requestTimes)
    const timeSinceLastRequest = Date.now() - lastRequest
    
    return Math.max(0, this.delayBetweenRequests - timeSinceLastRequest)
  }

  /**
   * Get current request count for a domain
   * @param domain - Domain to check
   * @returns number - Current request count
   */
  getRequestCount(domain: string): number {
    const now = Date.now()
    const requestTimes = this.requestTimes.get(domain) || []
    return requestTimes.filter(time => now - time < this.timeWindow).length
  }

  /**
   * Clear all request history
   */
  clear(): void {
    this.requestTimes.clear()
  }

  /**
   * Clear request history for a specific domain
   * @param domain - Domain to clear
   */
  clearDomain(domain: string): void {
    this.requestTimes.delete(domain)
  }
}

/**
 * Global rate limiter instance
 */
export const rateLimiter = new RateLimiter(2, 60000, 1000)
