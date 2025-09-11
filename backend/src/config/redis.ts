import { createClient, RedisClientType } from 'redis'
import { logger } from '@/utils/logger'

/**
 * Redis client instance for caching and job queues
 */
let redisClient: RedisClientType | null = null

/**
 * Get Redis client instance
 * @returns RedisClientType
 */
export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.')
  }
  return redisClient
}

/**
 * Connect to Redis server (optional - works without Redis)
 * @returns Promise<void>
 */
export async function connectRedis(): Promise<void> {
  // If no Redis URL is provided, skip Redis connection
  if (!process.env.REDIS_URL) {
    logger.info('⚠️  Redis URL not provided - running without Redis')
    return
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Redis connection failed after 10 retries')
            return new Error('Redis connection failed')
          }
          return Math.min(retries * 50, 1000)
        }
      }
    })

    redisClient.on('error', (err) => {
      logger.error('Redis client error:', err)
    })

    redisClient.on('connect', () => {
      logger.info('✅ Redis client connected')
    })

    redisClient.on('ready', () => {
      logger.info('✅ Redis client ready')
    })

    redisClient.on('end', () => {
      logger.info('Redis client disconnected')
    })

    await redisClient.connect()
  } catch (error) {
    logger.error('❌ Redis connection failed:', error)
    logger.info('⚠️  Continuing without Redis - some features may be limited')
    redisClient = null
  }
}

/**
 * Disconnect from Redis server
 * @returns Promise<void>
 */
export async function disconnectRedis(): Promise<void> {
  try {
    if (redisClient) {
      await redisClient.quit()
      redisClient = null
      logger.info('✅ Redis disconnected successfully')
    }
  } catch (error) {
    logger.error('❌ Redis disconnection failed:', error)
    throw error
  }
}

/**
 * Health check for Redis connection
 * @returns Promise<boolean>
 */
export async function checkRedisHealth(): Promise<boolean> {
  try {
    if (!redisClient) {
      return false
    }
    await redisClient.ping()
    return true
  } catch (error) {
    logger.error('Redis health check failed:', error)
    return false
  }
}

/**
 * Cache utility functions
 */
export class CacheService {
  private client: RedisClientType

  constructor() {
    this.client = getRedisClient()
  }

  /**
   * Set a key-value pair in Redis with optional expiration
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in seconds (optional)
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value)
      if (ttl) {
        await this.client.setEx(key, ttl, serializedValue)
      } else {
        await this.client.set(key, serializedValue)
      }
    } catch (error) {
      logger.error('Cache set error:', error)
      throw error
    }
  }

  /**
   * Get a value from Redis cache
   * @param key - Cache key
   * @returns Cached value or null
   */
  async get(key: string): Promise<any> {
    try {
      const value = await this.client.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      logger.error('Cache get error:', error)
      return null
    }
  }

  /**
   * Delete a key from Redis cache
   * @param key - Cache key
   */
  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key)
    } catch (error) {
      logger.error('Cache delete error:', error)
      throw error
    }
  }

  /**
   * Check if a key exists in Redis
   * @param key - Cache key
   * @returns Boolean indicating if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key)
      return result === 1
    } catch (error) {
      logger.error('Cache exists error:', error)
      return false
    }
  }

  /**
   * Set expiration for a key
   * @param key - Cache key
   * @param ttl - Time to live in seconds
   */
  async expire(key: string, ttl: number): Promise<void> {
    try {
      await this.client.expire(key, ttl)
    } catch (error) {
      logger.error('Cache expire error:', error)
      throw error
    }
  }
}

