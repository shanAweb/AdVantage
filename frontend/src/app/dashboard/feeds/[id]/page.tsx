'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  RefreshCw,
  Download,
  ExternalLink,
  Search,
  Plus,
  Package,
  Megaphone,
  Calendar,
  Globe,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Copy,
  Eye,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { feedApi, adApi } from '@/lib/apiClient'

/**
 * Feed interface
 */
interface Feed {
  id: string
  name: string
  siteUrl: string
  country?: string
  currency?: string
  publicToken: string
  lastCrawlStatus: string
  lastCrawlAt?: string
  createdAt: string
  updatedAt: string
  _count: {
    products: number
    ads: number
    campaigns: number
  }
}

/**
 * Product interface
 */
interface Product {
  id: string
  title: string
  description?: string
  price?: number
  currency?: string
  imageUrl?: string
  link: string
  availability?: string
  brand?: string
  category?: string
  createdAt: string
  _count: {
    ads: number
  }
}

// Note: generateStaticParams() is not compatible with 'use client' directive
// For client-side dynamic routes in static export mode, we handle routing on the client side

/**
 * Feed detail page component
 */
export default function FeedDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [feed, setFeed] = useState<Feed | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  /**
   * Load feed details on component mount
   */
  useEffect(() => {
    loadFeed()
  }, [params.id])

  /**
   * Load products when feed is loaded
   */
  useEffect(() => {
    if (feed) {
      loadProducts()
    }
  }, [feed, page])

  /**
   * Load feed details from API
   */
  const loadFeed = async () => {
    try {
      setLoading(true)
      const response = await feedApi.getFeed(params.id)
      
      if (response.success && response.data) {
        setFeed((response.data as any).feed)
      } else {
        throw new Error(response.error?.message || 'Failed to load feed')
      }
    } catch (error) {
      console.error('Error loading feed:', error)
      toast.error('Failed to load feed')
      router.push('/dashboard/feeds')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Load products from API
   */
  const loadProducts = async () => {
    try {
      setProductsLoading(true)
      const response = await feedApi.getFeedProducts(params.id, {
        page,
        limit: 20,
        search: searchTerm || undefined,
      })
      
      if (response.success && response.data) {
        if (page === 1) {
          setProducts((response.data as any).products)
        } else {
          setProducts(prev => [...prev, ...(response.data as any).products])
        }
        setHasMore((response.data as any).pagination.page < (response.data as any).pagination.pages)
      } else {
        throw new Error(response.error?.message || 'Failed to load products')
      }
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setProductsLoading(false)
    }
  }

  /**
   * Refresh feed
   */
  const refreshFeed = async () => {
    try {
      setRefreshing(true)
      const response = await feedApi.refreshFeed(params.id)
      
      if (response.success) {
        toast.success('Feed refresh queued successfully')
        await loadFeed()
      } else {
        throw new Error(response.error?.message || 'Failed to refresh feed')
      }
    } catch (error) {
      console.error('Error refreshing feed:', error)
      toast.error('Failed to refresh feed')
    } finally {
      setRefreshing(false)
    }
  }

  /**
   * Create ad from product
   */
  const createAd = async (productId: string) => {
    try {
      const response = await adApi.createAd({
        feedId: params.id,
        productId,
      })
      
      if (response.success) {
        toast.success('Ad created successfully!')
        await loadFeed() // Refresh feed stats
      } else {
        throw new Error(response.error?.message || 'Failed to create ad')
      }
    } catch (error) {
      console.error('Error creating ad:', error)
      toast.error('Failed to create ad')
    }
  }

  /**
   * Download feed in specified format
   */
  const downloadFeed = async (format: string) => {
    try {
      const response = await feedApi.downloadFeed(params.id, format)
      
      if (response.success) {
        // Create download link
        const blob = new Blob([response.data as string], { 
          type: format === 'csv' ? 'text/csv' : 
               format === 'xml' ? 'application/xml' : 
               'application/json' 
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${feed?.name.replace(/[^a-zA-Z0-9]/g, '_')}_products.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        
        toast.success(`Feed downloaded as ${format.toUpperCase()}`)
      } else {
        throw new Error(response.error?.message || 'Failed to download feed')
      }
    } catch (error) {
      console.error('Error downloading feed:', error)
      toast.error('Failed to download feed')
    }
  }

  /**
   * Copy public feed URL
   */
  const copyPublicUrl = (format: string = 'json') => {
    const url = `${window.location.origin}/api/feeds/public/${feed?.publicToken}?format=${format}`
    navigator.clipboard.writeText(url)
    toast.success('Public feed URL copied to clipboard')
  }

  /**
   * Get status badge for crawl status
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>
      case 'running':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Running</Badge>
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>
      case 'pending':
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  /**
   * Filter products based on search term
   */
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!feed) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Feed Not Found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{feed.name}</h1>
          <p className="text-gray-600 flex items-center">
            <Globe className="w-4 h-4 mr-1" />
            {feed.siteUrl}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => refreshFeed()}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Products ({feed._count.products})
                  </CardTitle>
                  <CardDescription>
                    Products extracted from your feed
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No products found' : 'No products yet'}
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    {searchTerm 
                      ? 'Try adjusting your search terms'
                      : 'Products will appear here after crawling'
                    }
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => refreshFeed()} disabled={refreshing}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                      Start Crawling
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start space-x-4">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                          {product.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            {product.price && (
                              <span className="font-medium">
                                {product.currency || feed.currency} {product.price}
                              </span>
                            )}
                            {product.brand && (
                              <span>Brand: {product.brand}</span>
                            )}
                            {product.category && (
                              <span>Category: {product.category}</span>
                            )}
                            <span className="flex items-center">
                              <Megaphone className="w-3 h-3 mr-1" />
                              {product._count.ads} ads
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => createAd(product.id)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Create Ad
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(product.link, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {hasMore && (
                    <div className="text-center pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={productsLoading}
                      >
                        {productsLoading ? 'Loading...' : 'Load More'}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Feed Info */}
          <Card>
            <CardHeader>
              <CardTitle>Feed Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                {getStatusBadge(feed.lastCrawlStatus)}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Country:</span>
                <span className="text-sm font-medium">{feed.country || 'Not set'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Currency:</span>
                <span className="text-sm font-medium">{feed.currency}</span>
              </div>
              
              {feed.lastCrawlAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Crawl:</span>
                  <span className="text-sm font-medium flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(feed.lastCrawlAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium">Products</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{feed._count.products}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Megaphone className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm font-medium">Ads</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{feed._count.ads}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="text-sm font-medium">Campaigns</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{feed._count.campaigns}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => downloadFeed('json')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => downloadFeed('csv')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => downloadFeed('xml')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download XML
              </Button>
            </CardContent>
          </Card>

          {/* Public Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Public Feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Share your feed publicly with this URL:
              </p>
              <div className="flex items-center space-x-2">
                <Input
                  value={`/api/feeds/public/${feed.publicToken}`}
                  readOnly
                  className="text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyPublicUrl()}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyPublicUrl('json')}
                >
                  JSON
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyPublicUrl('csv')}
                >
                  CSV
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyPublicUrl('xml')}
                >
                  XML
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

