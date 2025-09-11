import { SelectorConfig } from './feedCrawler'

/**
 * Pre-configured selectors for popular e-commerce sites
 */
export const SITE_SELECTORS: Record<string, SelectorConfig> = {
  // Amazon
  amazon: {
    productContainer: '[data-component-type="s-search-result"]',
    title: 'h2 a span',
    description: '.a-size-base-plus',
    price: '.a-price-whole, .a-offscreen',
    image: '.s-image',
    link: 'h2 a',
    nextPageButton: '.s-pagination-next',
    waitForSelector: '[data-component-type="s-search-result"]',
  },

  // Shopify stores (generic)
  shopify: {
    productContainer: '.product-item, .grid-product',
    title: '.product-item__title, .grid-product__title',
    description: '.product-item__description',
    price: '.price, .money',
    image: '.product-item__image img, .grid-product__image img',
    link: '.product-item__link, .grid-product__link',
    nextPageButton: '.pagination__next, .pagination-next',
    loadMoreButton: '.load-more',
    waitForSelector: '.product-item, .grid-product',
  },

  // WooCommerce stores
  woocommerce: {
    productContainer: '.product, .woocommerce-loop-product__link',
    title: '.woocommerce-loop-product__title, h2',
    description: '.woocommerce-product-details__short-description',
    price: '.price, .woocommerce-Price-amount',
    image: '.woocommerce-loop-product__link img, .attachment-woocommerce_thumbnail',
    link: '.woocommerce-loop-product__link',
    nextPageButton: '.next.page-numbers',
    waitForSelector: '.product',
  },

  // eBay
  ebay: {
    productContainer: '.s-item',
    title: '.s-item__title',
    description: '.s-item__subtitle',
    price: '.s-item__price',
    image: '.s-item__image img',
    link: '.s-item__link',
    nextPageButton: '.pagination__next',
    waitForSelector: '.s-item',
  },

  // Etsy
  etsy: {
    productContainer: '.v2-listing-card',
    title: '.v2-listing-card__title',
    description: '.v2-listing-card__shop-name',
    price: '.currency-value',
    image: '.v2-listing-card__img img',
    link: '.v2-listing-card__link',
    nextPageButton: '.pagination-next',
    waitForSelector: '.v2-listing-card',
  },

  // AliExpress
  aliexpress: {
    productContainer: '.product-item',
    title: '.product-title',
    description: '.product-desc',
    price: '.price-current',
    image: '.product-img img',
    link: '.product-title a',
    nextPageButton: '.next-page',
    waitForSelector: '.product-item',
  },

  // Generic e-commerce patterns
  generic: {
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
  },

  // JavaScript-heavy sites (SPA)
  spa: {
    productContainer: '[data-testid*="product"], .product-card, .item-card',
    title: '[data-testid*="title"], .product-title, .item-title',
    description: '[data-testid*="description"], .product-description',
    price: '[data-testid*="price"], .price, .cost',
    image: '[data-testid*="image"] img, .product-image img',
    link: '[data-testid*="link"], .product-link',
    loadMoreButton: '[data-testid*="load-more"], .load-more',
    infiniteScroll: true,
    waitForSelector: '[data-testid*="product"], .product-card',
  },
}

/**
 * Site detection patterns
 */
export const SITE_PATTERNS: Record<string, string[]> = {
  amazon: ['amazon.com', 'amazon.co.uk', 'amazon.de', 'amazon.fr', 'amazon.ca'],
  shopify: ['myshopify.com', 'shopify.com'],
  woocommerce: ['woocommerce', 'wordpress'],
  ebay: ['ebay.com', 'ebay.co.uk', 'ebay.de'],
  etsy: ['etsy.com'],
  aliexpress: ['aliexpress.com', 'aliexpress.us'],
}

/**
 * Get selector configuration for a given URL
 * @param url - Website URL
 * @returns SelectorConfig
 */
export function getSelectorsForUrl(url: string): SelectorConfig {
  const domain = new URL(url).hostname.toLowerCase()
  
  // Check for specific site patterns
  for (const [siteName, patterns] of Object.entries(SITE_PATTERNS)) {
    if (patterns.some(pattern => domain.includes(pattern))) {
      return SITE_SELECTORS[siteName] || SITE_SELECTORS.generic
    }
  }

  // Check if it's a JavaScript-heavy site (common indicators)
  const jsIndicators = ['react', 'vue', 'angular', 'spa', 'app']
  if (jsIndicators.some(indicator => domain.includes(indicator))) {
    return SITE_SELECTORS.spa
  }

  // Default to generic selectors
  return SITE_SELECTORS.generic
}

/**
 * Get enhanced selectors for a specific site
 * @param siteName - Name of the site
 * @param customSelectors - Custom selector overrides
 * @returns SelectorConfig
 */
export function getEnhancedSelectors(siteName: string, customSelectors?: Partial<SelectorConfig>): SelectorConfig {
  const baseSelectors = SITE_SELECTORS[siteName] || SITE_SELECTORS.generic
  return { ...baseSelectors, ...customSelectors }
}

/**
 * Validate selector configuration
 * @param selectors - Selector configuration to validate
 * @returns boolean
 */
export function validateSelectors(selectors: SelectorConfig): boolean {
  const required = ['productContainer', 'title', 'price', 'image', 'link']
  return required.every(field => selectors[field as keyof SelectorConfig])
}

/**
 * Get selector suggestions for a new site
 * @param url - Website URL
 * @returns string[] - Suggested selectors to try
 */
export function getSelectorSuggestions(url: string): string[] {
  return [
    'Try these common product container selectors:',
    '.product, .item, [data-product], .product-item, .product-card',
    '',
    'Common title selectors:',
    'h1, h2, h3, .title, .name, .product-title, .product-name',
    '',
    'Common price selectors:',
    '.price, .cost, .amount, [data-price], .price-current',
    '',
    'Common image selectors:',
    'img, .product-image img, .product-photo img',
    '',
    'Common link selectors:',
    'a, .product-link',
    '',
    'For pagination:',
    '.next, .pagination-next, [aria-label="Next"], .load-more'
  ]
}
