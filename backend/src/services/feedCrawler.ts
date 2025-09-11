import axios from 'axios'
import * as cheerio from 'cheerio'
import { chromium, Browser, Page } from 'playwright'
import { prisma } from '@/config/database'
import { logger } from '@/utils/logger'
import { getSelectorsForUrl } from './siteSelectors'
import { rateLimiter } from './rateLimiter'

/**
 * Product data interface
 */
export interface CrawledProduct {
  title: string
  description?: string
  price?: number
  currency?: string
  imageUrl?: string
  link: string
  availability?: string
  brand?: string
  category?: string
  sku?: string
  gtin?: string
  mpn?: string
  condition?: string
  rawData?: any
}

/**
 * Crawler configuration interface
 */
export interface CrawlerConfig {
  maxProducts: number
  timeout: number
  maxConcurrentRequests: number
  delayBetweenRequests: number
  enablePagination: boolean
  maxPages: number
  waitForLoad: number
}

/**
 * Site-specific selector configuration
 */
export interface SelectorConfig {
  productContainer: string
  title: string
  description?: string
  price: string
  image: string
  link: string
  nextPageButton?: string
  loadMoreButton?: string
  infiniteScroll?: boolean
  waitForSelector?: string
  customExtractors?: {
    [key: string]: (element: any) => string
  }
}

/**
 * Enhanced feed crawler service with Playwright support
 */
export class FeedCrawlerService {
  private readonly defaultConfig: CrawlerConfig = {
    maxProducts: 100,
    timeout: 30000,
    maxConcurrentRequests: 2,
    delayBetweenRequests: 1000,
    enablePagination: true,
    maxPages: 10,
    waitForLoad: 2000,
  }

  private browser: Browser | null = null

  /**
   * Initialize Playwright browser
   */
  private async initBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      })
    }
    return this.browser
  }

  /**
   * Close Playwright browser
   */
  private async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }

  /**
   * Crawl a feed and extract products
   * @param feedId - Feed ID to crawl
   * @returns Promise<void>
   */
  async crawlFeed(feedId: string): Promise<void> {
    try {
      logger.info(`Starting enhanced crawl for feed ${feedId}`)

      // Get feed data
      const feed = await prisma.feed.findUnique({
        where: { id: feedId },
      })

      if (!feed) {
        throw new Error(`Feed ${feedId} not found`)
      }

      // Update status to running
      await prisma.feed.update({
        where: { id: feedId },
        data: {
          lastCrawlStatus: 'running',
          lastCrawlAt: new Date(),
        },
      })

      // Try static HTML first (fast)
      let products: CrawledProduct[] = []
      let crawlerType = 'static'

      try {
        logger.info(`Attempting static HTML crawl for ${feed.siteUrl}`)
        products = await this.crawlWithStaticHtml(feed.siteUrl, feed.selectorConfig)
        
        if (products.length === 0) {
          logger.info(`No products found with static HTML, trying Playwright for ${feed.siteUrl}`)
          products = await this.crawlWithPlaywright(feed.siteUrl, feed.selectorConfig)
          crawlerType = 'playwright'
        } else {
          logger.info(`Successfully extracted ${products.length} products using static HTML`)
        }
      } catch (error) {
        logger.warn(`Static HTML crawl failed, trying Playwright: ${error}`)
        try {
          products = await this.crawlWithPlaywright(feed.siteUrl, feed.selectorConfig)
          crawlerType = 'playwright'
        } catch (playwrightError) {
          logger.error(`Both static and Playwright crawls failed:`, { staticError: error, playwrightError })
          throw new Error(`Failed to crawl ${feed.siteUrl}: ${playwrightError}`)
        }
      }

      // Clear existing products for this feed
      await prisma.product.deleteMany({
        where: { feedId },
      })

      // Save new products
      if (products.length > 0) {
        await prisma.product.createMany({
          data: products.map(product => ({
            feedId,
            title: product.title,
            description: product.description,
            price: product.price,
            currency: product.currency || feed.currency || 'USD',
            imageUrl: product.imageUrl,
            link: product.link,
            availability: product.availability,
            brand: product.brand,
            category: product.category,
            sku: product.sku,
            gtin: product.gtin,
            mpn: product.mpn,
            condition: product.condition,
            rawData: product.rawData,
          })),
        })

        logger.info(`Crawled ${products.length} products for feed ${feedId} using ${crawlerType} method`)
      } else {
        logger.warn(`No products found for feed ${feedId}`)
      }

      // Update status to completed
      await prisma.feed.update({
        where: { id: feedId },
        data: {
          lastCrawlStatus: 'completed',
          lastCrawlAt: new Date(),
        },
      })

    } catch (error) {
      logger.error(`Crawl failed for feed ${feedId}:`, error)

      // Update status to failed
      await prisma.feed.update({
        where: { id: feedId },
        data: {
          lastCrawlStatus: 'failed',
          lastCrawlAt: new Date(),
        },
      })

      throw error
    } finally {
      // Ensure browser is closed
      await this.closeBrowser()
    }
  }

  /**
   * Crawl using static HTML (axios + cheerio)
   * @param siteUrl - Website URL to crawl
   * @param selectorConfig - CSS selectors configuration
   * @returns Promise<CrawledProduct[]>
   */
  private async crawlWithStaticHtml(siteUrl: string, selectorConfig?: any): Promise<CrawledProduct[]> {
    try {
      // Apply rate limiting
      const domain = new URL(siteUrl).hostname
      await rateLimiter.waitForDelay(domain)
      
      if (!rateLimiter.canMakeRequest(domain)) {
        throw new Error(`Rate limit exceeded for ${domain}`)
      }

      const response = await axios.get(siteUrl, {
        timeout: this.defaultConfig.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      })

      // Record the request
      rateLimiter.recordRequest(domain)

      const $ = cheerio.load(response.data)
      const products: CrawledProduct[] = []

      // Try JSON-LD structured data first
      const jsonLdProducts = this.extractFromJsonLd($)
      if (jsonLdProducts.length > 0) {
        products.push(...jsonLdProducts.slice(0, this.defaultConfig.maxProducts))
        logger.info(`Extracted ${jsonLdProducts.length} products from JSON-LD`)
        return products
      }

      // Fallback to CSS selectors
      const selectorProducts = this.extractFromSelectors($, selectorConfig, siteUrl)
      products.push(...selectorProducts.slice(0, this.defaultConfig.maxProducts))

      logger.info(`Extracted ${products.length} products from static HTML selectors`)
      return products

    } catch (error) {
      logger.error(`Error in static HTML crawl for ${siteUrl}:`, error)
      throw error
    }
  }

  /**
   * Crawl using Playwright (for JavaScript-rendered sites)
   * @param siteUrl - Website URL to crawl
   * @param selectorConfig - CSS selectors configuration
   * @returns Promise<CrawledProduct[]>
   */
  private async crawlWithPlaywright(siteUrl: string, selectorConfig?: any): Promise<CrawledProduct[]> {
    // Apply rate limiting
    const domain = new URL(siteUrl).hostname
    await rateLimiter.waitForDelay(domain)
    
    if (!rateLimiter.canMakeRequest(domain)) {
      throw new Error(`Rate limit exceeded for ${domain}`)
    }

    const browser = await this.initBrowser()
    const page = await browser.newPage()
    
    try {
      // Set viewport and user agent
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      })

      // Navigate to the page
      await page.goto(siteUrl, { 
        waitUntil: 'networkidle',
        timeout: this.defaultConfig.timeout 
      })

      // Record the request
      rateLimiter.recordRequest(domain)

      // Wait for initial load
      await page.waitForTimeout(this.defaultConfig.waitForLoad)

      const allProducts: CrawledProduct[] = []
      let currentPage = 1
      const maxPages = this.defaultConfig.maxPages

      // Extract products from current page
      let pageProducts = await this.extractProductsFromPage(page, selectorConfig, siteUrl)
      allProducts.push(...pageProducts)

      logger.info(`Page ${currentPage}: Found ${pageProducts.length} products`)

      // Handle pagination if enabled
      if (this.defaultConfig.enablePagination && allProducts.length < this.defaultConfig.maxProducts) {
        while (currentPage < maxPages && allProducts.length < this.defaultConfig.maxProducts) {
          const nextPageFound = await this.goToNextPage(page, selectorConfig, siteUrl)
          
          if (!nextPageFound) {
            logger.info('No more pages found, stopping pagination')
            break
          }

          currentPage++
          
          // Wait for page to load
          await page.waitForTimeout(this.defaultConfig.waitForLoad)
          
          // Extract products from new page
          pageProducts = await this.extractProductsFromPage(page, selectorConfig, siteUrl)
          
          if (pageProducts.length === 0) {
            logger.info(`No products found on page ${currentPage}, stopping pagination`)
            break
          }

          allProducts.push(...pageProducts)
          logger.info(`Page ${currentPage}: Found ${pageProducts.length} products (Total: ${allProducts.length})`)
        }
      }

      // Limit to max products
      const finalProducts = allProducts.slice(0, this.defaultConfig.maxProducts)
      logger.info(`Total products extracted with Playwright: ${finalProducts.length}`)
      
      return finalProducts

    } catch (error) {
      logger.error(`Error in Playwright crawl for ${siteUrl}:`, error)
      throw error
    } finally {
      await page.close()
    }
  }

  /**
   * Extract products from current page using Playwright
   * @param page - Playwright page instance
   * @param selectorConfig - CSS selectors configuration
   * @returns Promise<CrawledProduct[]>
   */
  private async extractProductsFromPage(page: Page, selectorConfig?: any, siteUrl?: string): Promise<CrawledProduct[]> {
    const selectors = this.getSelectorConfig(selectorConfig, siteUrl)
    const products: CrawledProduct[] = []

    try {
      // Wait for product containers to load
      if (selectors.waitForSelector) {
        await page.waitForSelector(selectors.productContainer, { timeout: 10000 })
      }

      // Extract products using selectors
      const productElements = await page.$$(selectors.productContainer)
      
      for (const element of productElements) {
        try {
          const product = await this.extractProductFromElement(page, element, selectors)
          if (product && product.title && product.link) {
            products.push(product)
          }
        } catch (error) {
          logger.warn('Error extracting individual product:', error)
        }
      }

    } catch (error) {
      logger.warn('Error extracting products from page:', error)
    }

    return products
  }

  /**
   * Extract a single product from a Playwright element
   * @param page - Playwright page instance
   * @param element - Product element
   * @param selectors - Selector configuration
   * @returns Promise<CrawledProduct | null>
   */
  private async extractProductFromElement(page: Page, element: any, selectors: SelectorConfig): Promise<CrawledProduct | null> {
    try {
      const product: CrawledProduct = {
        title: '',
        link: '',
      }

      // Extract title
      const titleElement = await element.$(selectors.title)
      if (titleElement) {
        product.title = await titleElement.textContent() || ''
      }

      // Extract description
      if (selectors.description) {
        const descElement = await element.$(selectors.description)
        if (descElement) {
          product.description = await descElement.textContent() || ''
        }
      }

      // Extract price
      const priceElement = await element.$(selectors.price)
      if (priceElement) {
        const priceText = await priceElement.textContent() || ''
        product.price = this.parsePrice(priceText)
      }

      // Extract image
      const imageElement = await element.$(selectors.image)
      if (imageElement) {
        product.imageUrl = await imageElement.getAttribute('src') || 
                          await imageElement.getAttribute('data-src') || ''
      }

      // Extract link
      const linkElement = await element.$(selectors.link)
      if (linkElement) {
        const href = await linkElement.getAttribute('href') || ''
        product.link = this.resolveUrl(href, page.url())
      }

      // Apply custom extractors
      if (selectors.customExtractors) {
        for (const [key, extractor] of Object.entries(selectors.customExtractors)) {
          try {
            (product as any)[key] = await extractor(element)
          } catch (error) {
            logger.warn(`Error applying custom extractor ${key}:`, error)
          }
        }
      }

      return product.title && product.link ? product : null

    } catch (error) {
      logger.warn('Error extracting product from element:', error)
      return null
    }
  }

  /**
   * Navigate to next page
   * @param page - Playwright page instance
   * @param selectorConfig - Selector configuration
   * @returns Promise<boolean> - Whether next page was found and navigated to
   */
  private async goToNextPage(page: Page, selectorConfig?: any, siteUrl?: string): Promise<boolean> {
    const selectors = this.getSelectorConfig(selectorConfig, siteUrl)

    try {
      // Try next page button first
      if (selectors.nextPageButton) {
        const nextButton = await page.$(selectors.nextPageButton)
        if (nextButton) {
          const isDisabled = await nextButton.isDisabled()
          if (!isDisabled) {
            await nextButton.click()
            await page.waitForLoadState('networkidle')
            return true
          }
        }
      }

      // Try load more button
      if (selectors.loadMoreButton) {
        const loadMoreButton = await page.$(selectors.loadMoreButton)
        if (loadMoreButton) {
          const isDisabled = await loadMoreButton.isDisabled()
          if (!isDisabled) {
            await loadMoreButton.click()
            await page.waitForTimeout(2000) // Wait for content to load
            return true
          }
        }
      }

      // Try infinite scroll
      if (selectors.infiniteScroll) {
        const previousHeight = await page.evaluate('document.body.scrollHeight') as number
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        await page.waitForTimeout(2000)
        
        const newHeight = await page.evaluate('document.body.scrollHeight') as number
        return newHeight > previousHeight
      }

      return false

    } catch (error) {
      logger.warn('Error navigating to next page:', error)
      return false
    }
  }

  /**
   * Get selector configuration with defaults
   * @param selectorConfig - Custom selector configuration
   * @param siteUrl - Website URL for site-specific selectors
   * @returns SelectorConfig
   */
  private getSelectorConfig(selectorConfig?: any, siteUrl?: string): SelectorConfig {
    // Get site-specific selectors if URL is provided
    const siteSelectors = siteUrl ? getSelectorsForUrl(siteUrl) : {}
    
    const defaultSelectors: SelectorConfig = {
      productContainer: '.product, .item, [data-product], .product-item, .product-card, .product-tile',
      title: 'h1, h2, h3, .title, .name, .product-title, .product-name, [data-title]',
      description: '.description, .summary, .excerpt, .product-description',
      price: '.price, .cost, .amount, [data-price], .price-current, .price-value',
      image: 'img, .product-image img, .product-photo img',
      link: 'a, .product-link',
      nextPageButton: '.next, .pagination-next, [aria-label="Next"], .page-next',
      loadMoreButton: '.load-more, .show-more, .load-more-btn',
      infiniteScroll: false,
      waitForSelector: '.product, .item, [data-product]',
    }

    return { ...defaultSelectors, ...siteSelectors, ...selectorConfig }
  }

  /**
   * Extract products from JSON-LD structured data
   * @param $ - Cheerio instance
   * @returns CrawledProduct[]
   */
  private extractFromJsonLd($: cheerio.Root): CrawledProduct[] {
    const products: CrawledProduct[] = []

    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const jsonData = JSON.parse($(element).html() || '{}')
        
        if (jsonData['@type'] === 'Product') {
          products.push(this.parseJsonLdProduct(jsonData))
        } else if (Array.isArray(jsonData)) {
          jsonData.forEach(item => {
            if (item['@type'] === 'Product') {
              products.push(this.parseJsonLdProduct(item))
            }
          })
        } else if (jsonData['@type'] === 'ItemList' && Array.isArray(jsonData.itemListElement)) {
          jsonData.itemListElement.forEach((item: any) => {
            if (item.item && item.item['@type'] === 'Product') {
              products.push(this.parseJsonLdProduct(item.item))
            }
          })
        }
      } catch (error) {
        logger.warn('Error parsing JSON-LD:', error)
      }
    })

    return products
  }

  /**
   * Parse a single product from JSON-LD data
   * @param jsonData - JSON-LD product data
   * @returns CrawledProduct
   */
  private parseJsonLdProduct(jsonData: any): CrawledProduct {
    return {
      title: jsonData.name || '',
      description: jsonData.description || '',
      price: this.parsePrice(jsonData.offers?.price || jsonData.price),
      currency: jsonData.offers?.priceCurrency || jsonData.priceCurrency || 'USD',
      imageUrl: this.getImageUrl(jsonData.image),
      link: jsonData.url || '',
      availability: jsonData.offers?.availability || 'in_stock',
      brand: jsonData.brand?.name || jsonData.brand,
      category: jsonData.category,
      sku: jsonData.sku,
      gtin: jsonData.gtin,
      mpn: jsonData.mpn,
      condition: jsonData.condition,
      rawData: jsonData,
    }
  }

  /**
   * Extract products using CSS selectors (static HTML)
   * @param $ - Cheerio instance
   * @param selectorConfig - CSS selectors configuration
   * @returns CrawledProduct[]
   */
  private extractFromSelectors($: cheerio.Root, selectorConfig?: any, siteUrl?: string): CrawledProduct[] {
    const products: CrawledProduct[] = []
    const selectors = this.getSelectorConfig(selectorConfig, siteUrl)

    $(selectors.productContainer).each((_, element) => {
      try {
        const $product = $(element)
        const product: CrawledProduct = {
          title: this.extractText($product, selectors.title),
          description: this.extractText($product, selectors.description || ''),
          price: this.parsePrice(this.extractText($product, selectors.price)),
          imageUrl: this.extractImageUrl($product, selectors.image),
          link: this.extractLink($product, selectors.link),
          availability: 'in_stock', // Default assumption
        }

        if (product.title && product.link) {
          products.push(product)
        }
      } catch (error) {
        logger.warn('Error extracting product from selector:', error)
      }
    })

    return products
  }

  /**
   * Extract text content from element using selector
   * @param $parent - Parent cheerio element
   * @param selector - CSS selector
   * @returns string
   */
  private extractText($parent: cheerio.Cheerio, selector: string): string {
    return $parent.find(selector).first().text().trim()
  }

  /**
   * Extract image URL from element
   * @param $parent - Parent cheerio element
   * @param selector - CSS selector
   * @returns string
   */
  private extractImageUrl($parent: cheerio.Cheerio, selector: string): string {
    const $img = $parent.find(selector).first()
    return $img.attr('src') || $img.attr('data-src') || ''
  }

  /**
   * Extract link URL from element
   * @param $parent - Parent cheerio element
   * @param selector - CSS selector
   * @returns string
   */
  private extractLink($parent: cheerio.Cheerio, selector: string): string {
    const $link = $parent.find(selector).first()
    return $link.attr('href') || ''
  }

  /**
   * Parse price string to number
   * @param priceStr - Price string
   * @returns number | undefined
   */
  private parsePrice(priceStr: string | number): number | undefined {
    if (typeof priceStr === 'number') return priceStr
    
    if (!priceStr) return undefined
    
    const cleaned = priceStr.toString().replace(/[^\d.,]/g, '')
    const parsed = parseFloat(cleaned.replace(',', '.'))
    
    return isNaN(parsed) ? undefined : parsed
  }

  /**
   * Get image URL from various formats
   * @param imageData - Image data (string, array, or object)
   * @returns string
   */
  private getImageUrl(imageData: any): string {
    if (typeof imageData === 'string') {
      return imageData
    }
    
    if (Array.isArray(imageData) && imageData.length > 0) {
      return imageData[0]
    }
    
    if (imageData && imageData.url) {
      return imageData.url
    }
    
    return ''
  }

  /**
   * Resolve relative URL to absolute URL
   * @param url - URL to resolve
   * @param baseUrl - Base URL
   * @returns string
   */
  private resolveUrl(url: string, baseUrl: string): string {
    if (url.startsWith('http')) {
      return url
    }
    
    if (url.startsWith('/')) {
      const base = new URL(baseUrl)
      return `${base.protocol}//${base.host}${url}`
    }
    
    return new URL(url, baseUrl).href
  }
}

/**
 * Export singleton instance
 */
export const feedCrawlerService = new FeedCrawlerService()

