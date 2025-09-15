import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Package, 
  ExternalLink, 
  Trash2, 
  Search, 
  Filter, 
  Plus,
  Globe,
  Tag,
  DollarSign,
  Calendar,
  Eye,
  ShoppingCart
} from 'lucide-react'
import { productApi, feedApi, adApi } from '@/lib/apiClient'
import toast from 'react-hot-toast'

/**
 * Products page component
 * Displays all crawled products with details and options to create ads
 */
export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [feeds, setFeeds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFeedId, setSelectedFeedId] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [stats, setStats] = useState({
    totalProducts: 0,
    productsWithAds: 0,
    productsWithoutAds: 0,
    recentProducts: 0
  })
  const [showCreateAdModal, setShowCreateAdModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [newAd, setNewAd] = useState({
    headline: '',
    description: '',
    targetAudience: '',
    budget: 0
  })

  /**
   * Load products and feeds from API
   */
  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load products
      const productsResponse = await productApi.getProducts({
        search: searchTerm || undefined,
        feedId: selectedFeedId || undefined,
        category: selectedCategory || undefined
      })
      
      if (productsResponse.success) {
        const productsData = productsResponse.data?.products || []
        setProducts(productsData)
      } else {
        console.warn('Failed to load products:', productsResponse.error)
        setProducts([])
      }

      // Load feeds for filter
      const feedsResponse = await feedApi.getFeeds()
      if (feedsResponse.success) {
        const feedsData = feedsResponse.data?.feeds || []
        setFeeds(feedsData)
      }

      // Load stats
      const statsResponse = await productApi.getProductStats()
      if (statsResponse.success) {
        setStats(statsResponse.data)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Delete product
   */
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await productApi.deleteProduct(productId)
      
      if (response.success) {
        toast.success('Product deleted successfully!')
        loadData() // Reload data
      } else {
        toast.error(response.error?.message || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  /**
   * Create ad for product
   */
  const handleCreateAd = async () => {
    if (!selectedProduct || !newAd.headline || !newAd.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await adApi.createAd({
        feedId: selectedProduct.feedId,
        productId: selectedProduct.id,
        headline: newAd.headline,
        description: newAd.description,
        targetAudience: newAd.targetAudience,
        budget: newAd.budget
      })

      if (response.success) {
        toast.success('Ad created successfully!')
        setShowCreateAdModal(false)
        setSelectedProduct(null)
        setNewAd({ headline: '', description: '', targetAudience: '', budget: 0 })
        loadData() // Reload to update ad counts
      } else {
        toast.error(response.error?.message || 'Failed to create ad')
      }
    } catch (error) {
      console.error('Error creating ad:', error)
      toast.error('Failed to create ad')
    }
  }

  /**
   * Open create ad modal
   */
  const openCreateAdModal = (product: any) => {
    setSelectedProduct(product)
    setNewAd({
      headline: product.title.substring(0, 50) + '...',
      description: product.description?.substring(0, 100) + '...' || '',
      targetAudience: '',
      budget: 0
    })
    setShowCreateAdModal(true)
  }

  /**
   * Format price
   */
  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  /**
   * Format date
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Load data on component mount and when filters change
  useEffect(() => {
    loadData()
  }, [searchTerm, selectedFeedId, selectedCategory])

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFeed = !selectedFeedId || product.feedId === selectedFeedId
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    
    return matchesSearch && matchesFeed && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage all crawled products and create ads
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            <Package className="w-4 h-4 mr-1" />
            {stats.totalProducts} Total
          </Badge>
          <Badge variant="outline" className="text-sm">
            <ShoppingCart className="w-4 h-4 mr-1" />
            {stats.productsWithAds} With Ads
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Across all feeds
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Ads</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productsWithAds}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalProducts > 0 ? Math.round((stats.productsWithAds / stats.totalProducts) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Without Ads</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productsWithoutAds}</div>
            <p className="text-xs text-muted-foreground">
              Available for ads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentProducts}</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="feed">Filter by Feed</Label>
              <select
                id="feed"
                value={selectedFeedId}
                onChange={(e) => setSelectedFeedId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Feeds</option>
                {feeds.map(feed => (
                  <option key={feed.id} value={feed.id}>
                    {feed.name} ({feed.siteUrl})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="category">Filter by Category</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">
                    {product.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-1" />
                      {product.feed?.siteUrl}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Tag className="w-4 h-4 mr-1" />
                      Feed: {product.feed?.name}
                    </div>
                  </CardDescription>
                </div>
                {product.price && (
                  <Badge variant="secondary" className="ml-2">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {formatPrice(product.price, product.currency)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {product.imageUrl && (
                <div className="mb-4">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-32 object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
              
              {product.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {product.description}
                </p>
              )}

              <div className="space-y-2">
                {product.category && (
                  <div className="flex items-center text-sm">
                    <Tag className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">{product.category}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">
                    Crawled: {formatDate(product.createdAt)}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <ShoppingCart className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">
                    {product._count?.ads || 0} ads created
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(product.link, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Product
                </Button>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => openCreateAdModal(product)}
                    disabled={product._count?.ads > 0}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Create Ad
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedFeedId || selectedCategory
                ? 'Try adjusting your filters to see more products.'
                : 'Start crawling feeds to see products here.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create Ad Modal */}
      {showCreateAdModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Create Ad for Product</CardTitle>
              <CardDescription>
                {selectedProduct.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="headline">Headline *</Label>
                <Input
                  id="headline"
                  value={newAd.headline}
                  onChange={(e) => setNewAd({ ...newAd, headline: e.target.value })}
                  placeholder="Enter ad headline"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  value={newAd.description}
                  onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                  placeholder="Enter ad description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Input
                  id="targetAudience"
                  value={newAd.targetAudience}
                  onChange={(e) => setNewAd({ ...newAd, targetAudience: e.target.value })}
                  placeholder="e.g., Adults 25-45, Tech enthusiasts"
                />
              </div>
              
              <div>
                <Label htmlFor="budget">Daily Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={newAd.budget}
                  onChange={(e) => setNewAd({ ...newAd, budget: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </CardContent>
            <div className="flex justify-end space-x-2 p-6 pt-0">
              <Button
                variant="outline"
                onClick={() => setShowCreateAdModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateAd}>
                Create Ad
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

