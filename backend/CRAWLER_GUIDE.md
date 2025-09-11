# Enhanced Feed Crawler Guide

## Overview

The enhanced feed crawler is a powerful tool that can extract products from both static HTML websites and JavaScript-rendered sites. It automatically detects the best extraction method and provides comprehensive pagination support.

## Features

### 🚀 **Dual Extraction Methods**
- **Static HTML (Fast)**: Uses axios + cheerio for quick extraction from traditional websites
- **JavaScript Rendering (Comprehensive)**: Uses Playwright for dynamic content and SPAs

### 🔄 **Automatic Fallback**
- Tries static HTML first for speed
- Automatically falls back to Playwright if no products found
- Ensures maximum extraction success

### 📄 **Pagination Support**
- Next page button clicking
- Load more button support
- Infinite scroll detection
- Configurable maximum pages

### 🎯 **Site-Specific Selectors**
- Pre-configured selectors for popular e-commerce sites
- Automatic site detection
- Easy customization for new sites

### ⚡ **Rate Limiting**
- Respects website resources
- Configurable delays between requests
- Prevents overloading target sites

## Supported Sites

### Pre-configured Sites
- **Amazon**: Product search results
- **Shopify Stores**: Generic Shopify themes
- **WooCommerce**: WordPress e-commerce sites
- **eBay**: Product listings
- **Etsy**: Handmade product listings
- **AliExpress**: Product catalog
- **Generic E-commerce**: Common patterns
- **SPA Sites**: JavaScript-heavy applications

## API Endpoints

### Test Crawler
```http
POST /api/crawler/test
Content-Type: application/json
Authorization: Bearer <token>

{
  "url": "https://example-store.com/products",
  "customSelectors": {
    "productContainer": ".product-item",
    "title": ".product-title",
    "price": ".price"
  }
}
```

### Get Selector Suggestions
```http
GET /api/crawler/suggestions?url=https://example-store.com
Authorization: Bearer <token>
```

### Validate Selectors
```http
POST /api/crawler/validate-selectors
Content-Type: application/json
Authorization: Bearer <token>

{
  "selectors": {
    "productContainer": ".product",
    "title": "h2",
    "price": ".price",
    "image": "img",
    "link": "a"
  }
}
```

### Test Multiple URLs
```http
POST /api/crawler/test-multiple
Content-Type: application/json
Authorization: Bearer <token>

{
  "urls": [
    "https://store1.com/products",
    "https://store2.com/items"
  ]
}
```

### Get Performance Metrics
```http
GET /api/crawler/metrics/:feedId
Authorization: Bearer <token>
```

### Get Crawler Status
```http
GET /api/crawler/status
Authorization: Bearer <token>
```

## Selector Configuration

### Basic Selectors
```json
{
  "productContainer": ".product, .item, [data-product]",
  "title": "h1, h2, h3, .title, .name",
  "description": ".description, .summary",
  "price": ".price, .cost, .amount",
  "image": "img, .product-image img",
  "link": "a, .product-link"
}
```

### Pagination Selectors
```json
{
  "nextPageButton": ".next, .pagination-next",
  "loadMoreButton": ".load-more, .show-more",
  "infiniteScroll": true
}
```

### Advanced Selectors
```json
{
  "waitForSelector": ".product-container",
  "customExtractors": {
    "brand": "element => element.querySelector('.brand')?.textContent || ''",
    "category": "element => element.querySelector('.category')?.textContent || ''"
  }
}
```

## Usage Examples

### 1. Basic Product Extraction
```typescript
import { feedCrawlerService } from '@/services/feedCrawler'

// Crawl a feed
await feedCrawlerService.crawlFeed('feed-id')
```

### 2. Test Before Adding Feed
```typescript
import { crawlerTestService } from '@/services/crawlerTest'

// Test a URL
const result = await crawlerTestService.testCrawler('https://store.com/products')
console.log(`Found ${result.productsFound} products using ${result.method}`)
```

### 3. Custom Selectors
```typescript
const customSelectors = {
  productContainer: '.custom-product',
  title: '.custom-title',
  price: '.custom-price',
  image: '.custom-image img',
  link: '.custom-link'
}

const result = await crawlerTestService.testCrawler('https://store.com', customSelectors)
```

## Configuration Options

### Crawler Config
```typescript
{
  maxProducts: 100,           // Maximum products to extract
  timeout: 30000,             // Request timeout (ms)
  maxConcurrentRequests: 2,   // Max concurrent requests per domain
  delayBetweenRequests: 1000, // Delay between requests (ms)
  enablePagination: true,     // Enable pagination
  maxPages: 10,              // Maximum pages to crawl
  waitForLoad: 2000          // Wait time for page load (ms)
}
```

### Rate Limiting
```typescript
{
  maxRequests: 2,        // Max requests per time window
  timeWindow: 60000,     // Time window (ms)
  delayBetweenRequests: 1000  // Delay between requests (ms)
}
```

## Best Practices

### 1. **Test Before Production**
Always test your selectors before adding a feed to production:
```bash
curl -X POST http://localhost:5000/api/crawler/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"url": "https://store.com/products"}'
```

### 2. **Use Site-Specific Selectors**
The crawler automatically detects popular sites and uses optimized selectors:
- Amazon: `[data-component-type="s-search-result"]`
- Shopify: `.product-item, .grid-product`
- WooCommerce: `.product, .woocommerce-loop-product__link`

### 3. **Handle Pagination**
Configure pagination selectors for better extraction:
```json
{
  "nextPageButton": ".pagination-next",
  "loadMoreButton": ".load-more",
  "infiniteScroll": true
}
```

### 4. **Monitor Performance**
Check crawler performance regularly:
```bash
curl -X GET http://localhost:5000/api/crawler/metrics/feed-id \
  -H "Authorization: Bearer <token>"
```

### 5. **Rate Limiting**
Respect website resources by using appropriate delays:
- Default: 1 second between requests
- Maximum: 2 concurrent requests per domain
- Time window: 1 minute

## Troubleshooting

### Common Issues

#### 1. **No Products Found**
- Check if the site requires JavaScript rendering
- Verify selectors are correct
- Test with different selector patterns

#### 2. **Rate Limiting Errors**
- Increase delay between requests
- Reduce concurrent request limit
- Check if the site has anti-bot measures

#### 3. **Pagination Not Working**
- Verify pagination selectors
- Check if the site uses infinite scroll
- Test with different pagination methods

#### 4. **Timeout Errors**
- Increase timeout value
- Check network connectivity
- Verify the site is accessible

### Debug Mode
Enable debug logging to see detailed extraction process:
```typescript
// In your environment variables
DEBUG=crawler:*
```

## Adding New Sites

### 1. **Identify Site Patterns**
```typescript
// Add to siteSelectors.ts
export const SITE_PATTERNS = {
  newSite: ['newsite.com', 'newsite.co.uk']
}
```

### 2. **Create Selectors**
```typescript
// Add to SITE_SELECTORS
newSite: {
  productContainer: '.product-item',
  title: '.product-title',
  price: '.price',
  image: '.product-image img',
  link: '.product-link',
  nextPageButton: '.next-page'
}
```

### 3. **Test and Validate**
```bash
# Test the new site
curl -X POST http://localhost:5000/api/crawler/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"url": "https://newsite.com/products"}'
```

## Performance Optimization

### 1. **Use Static HTML When Possible**
The crawler automatically tries static HTML first for better performance.

### 2. **Configure Appropriate Limits**
- Set reasonable `maxProducts` based on your needs
- Use appropriate `maxPages` to avoid over-crawling
- Configure rate limits to respect target sites

### 3. **Monitor Resource Usage**
- Check memory usage with Playwright
- Monitor CPU usage during crawling
- Set appropriate timeouts

## Security Considerations

### 1. **Respect robots.txt**
The crawler should respect website robots.txt files.

### 2. **Use Appropriate User Agents**
The crawler uses realistic browser user agents.

### 3. **Rate Limiting**
Built-in rate limiting prevents overloading target sites.

### 4. **Error Handling**
Comprehensive error handling prevents crashes and provides useful feedback.

## Monitoring and Logging

### 1. **Crawler Status**
Check crawler status and configuration:
```bash
curl -X GET http://localhost:5000/api/crawler/status \
  -H "Authorization: Bearer <token>"
```

### 2. **Performance Metrics**
Monitor extraction performance:
```bash
curl -X GET http://localhost:5000/api/crawler/metrics/feed-id \
  -H "Authorization: Bearer <token>"
```

### 3. **Log Analysis**
Check logs for extraction details:
```bash
# View crawler logs
tail -f logs/crawler.log
```

## Conclusion

The enhanced feed crawler provides a robust, scalable solution for extracting products from various e-commerce websites. With automatic fallback detection, comprehensive pagination support, and site-specific optimizations, it ensures maximum extraction success while respecting website resources.

For more information or support, please refer to the API documentation or contact the development team.
