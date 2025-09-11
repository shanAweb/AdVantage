import { Product, Feed } from '@prisma/client'
import { logger } from '@/utils/logger'

/**
 * Feed export service for generating various feed formats
 */
export class FeedExportService {
  /**
   * Export products to CSV format
   * @param products - Array of products
   * @param feed - Feed information
   * @returns CSV string
   */
  exportToCSV(products: Product[], feed: Feed): string {
    try {
      const headers = [
        'id',
        'title',
        'description',
        'price',
        'currency',
        'image_url',
        'link',
        'availability',
        'brand',
        'category',
        'sku',
        'gtin',
        'mpn',
        'condition',
      ]

      const csvRows = [headers.join(',')]

      products.forEach(product => {
        const row = [
          this.escapeCsvField(product.id),
          this.escapeCsvField(product.title),
          this.escapeCsvField(product.description || ''),
          this.escapeCsvField(product.price?.toString() || ''),
          this.escapeCsvField(product.currency || ''),
          this.escapeCsvField(product.imageUrl || ''),
          this.escapeCsvField(product.link),
          this.escapeCsvField(product.availability || ''),
          this.escapeCsvField(product.brand || ''),
          this.escapeCsvField(product.category || ''),
          this.escapeCsvField(product.sku || ''),
          this.escapeCsvField(product.gtin || ''),
          this.escapeCsvField(product.mpn || ''),
          this.escapeCsvField(product.condition || ''),
        ]
        csvRows.push(row.join(','))
      })

      return csvRows.join('\n')
    } catch (error) {
      logger.error('Error exporting to CSV:', error)
      throw error
    }
  }

  /**
   * Export products to JSON format
   * @param products - Array of products
   * @param feed - Feed information
   * @returns JSON string
   */
  exportToJSON(products: Product[], feed: Feed): string {
    try {
      const feedData = {
        feed: {
          id: feed.id,
          name: feed.name,
          siteUrl: feed.siteUrl,
          country: feed.country,
          currency: feed.currency,
          lastCrawlAt: feed.lastCrawlAt,
          productCount: products.length,
        },
        products: products.map(product => ({
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          currency: product.currency,
          imageUrl: product.imageUrl,
          link: product.link,
          availability: product.availability,
          brand: product.brand,
          category: product.category,
          sku: product.sku,
          gtin: product.gtin,
          mpn: product.mpn,
          condition: product.condition,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        })),
        exportedAt: new Date().toISOString(),
      }

      return JSON.stringify(feedData, null, 2)
    } catch (error) {
      logger.error('Error exporting to JSON:', error)
      throw error
    }
  }

  /**
   * Export products to Google Shopping XML format
   * @param products - Array of products
   * @param feed - Feed information
   * @returns XML string
   */
  exportToGoogleXML(products: Product[], feed: Feed): string {
    try {
      const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
      const rssHeader = `
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${this.escapeXml(feed.name)}</title>
    <link>${this.escapeXml(feed.siteUrl)}</link>
    <description>Product feed for ${this.escapeXml(feed.name)}</description>
    <lastBuildDate>${new Date().toISOString()}</lastBuildDate>
`

      const xmlFooter = `
  </channel>
</rss>`

      const productItems = products.map(product => {
        return `
    <item>
      <g:id>${this.escapeXml(product.id)}</g:id>
      <g:title>${this.escapeXml(product.title)}</g:title>
      <g:description>${this.escapeXml(product.description || '')}</g:description>
      <g:link>${this.escapeXml(product.link)}</g:link>
      <g:image_link>${this.escapeXml(product.imageUrl || '')}</g:image_link>
      <g:availability>${this.mapAvailability(product.availability)}</g:availability>
      <g:price>${product.price ? `${product.price} ${product.currency || 'USD'}` : ''}</g:price>
      <g:brand>${this.escapeXml(product.brand || '')}</g:brand>
      <g:condition>${this.mapCondition(product.condition)}</g:condition>
      <g:product_type>${this.escapeXml(product.category || '')}</g:product_type>
      <g:mpn>${this.escapeXml(product.mpn || '')}</g:mpn>
      <g:gtin>${this.escapeXml(product.gtin || '')}</g:gtin>
    </item>`
      }).join('')

      return xmlHeader + rssHeader + productItems + xmlFooter
    } catch (error) {
      logger.error('Error exporting to Google XML:', error)
      throw error
    }
  }

  /**
   * Export products to Facebook Catalog XML format
   * @param products - Array of products
   * @param feed - Feed information
   * @returns XML string
   */
  exportToFacebookXML(products: Product[], feed: Feed): string {
    try {
      const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
      const catalogHeader = `
<catalog>
  <products>`

      const catalogFooter = `
  </products>
</catalog>`

      const productItems = products.map(product => {
        return `
    <product>
      <id>${this.escapeXml(product.id)}</id>
      <title>${this.escapeXml(product.title)}</title>
      <description>${this.escapeXml(product.description || '')}</description>
      <link>${this.escapeXml(product.link)}</link>
      <image_link>${this.escapeXml(product.imageUrl || '')}</image_link>
      <availability>${this.mapAvailability(product.availability)}</availability>
      <price>${product.price ? `${product.price} ${product.currency || 'USD'}` : ''}</price>
      <brand>${this.escapeXml(product.brand || '')}</brand>
      <condition>${this.mapCondition(product.condition)}</condition>
      <product_type>${this.escapeXml(product.category || '')}</product_type>
      <mpn>${this.escapeXml(product.mpn || '')}</mpn>
      <gtin>${this.escapeXml(product.gtin || '')}</gtin>
    </product>`
      }).join('')

      return xmlHeader + catalogHeader + productItems + catalogFooter
    } catch (error) {
      logger.error('Error exporting to Facebook XML:', error)
      throw error
    }
  }

  /**
   * Escape CSV field value
   * @param field - Field value
   * @returns Escaped field value
   */
  private escapeCsvField(field: string): string {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`
    }
    return field
  }

  /**
   * Escape XML content
   * @param content - Content to escape
   * @returns Escaped content
   */
  private escapeXml(content: string): string {
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  /**
   * Map availability to Google Shopping format
   * @param availability - Product availability
   * @returns Mapped availability
   */
  private mapAvailability(availability?: string | null): string {
    switch (availability) {
      case 'in_stock':
        return 'in stock'
      case 'out_of_stock':
        return 'out of stock'
      case 'preorder':
        return 'preorder'
      default:
        return 'in stock'
    }
  }

  /**
   * Map condition to Google Shopping format
   * @param condition - Product condition
   * @returns Mapped condition
   */
  private mapCondition(condition?: string | null): string {
    switch (condition) {
      case 'new':
        return 'new'
      case 'used':
        return 'used'
      case 'refurbished':
        return 'refurbished'
      default:
        return 'new'
    }
  }
}

/**
 * Export singleton instance
 */
export const feedExportService = new FeedExportService()


