import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Package, ExternalLink, Trash2, Search, Filter, Plus, Globe, Tag, DollarSign, Calendar, Eye, ShoppingCart, X } from 'lucide-react'
import { productApi, feedApi, adApi } from '@/lib/apiClient'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [feeds, setFeeds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFeedId, setSelectedFeedId] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [stats, setStats] = useState({ totalProducts: 0, productsWithAds: 0, productsWithoutAds: 0, recentProducts: 0 })
  const [showCreateAdModal, setShowCreateAdModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [newAd, setNewAd] = useState({ headline: '', description: '', targetAudience: '', budget: 0 })

  const loadData = async () => {
    try {
      setLoading(true)
      const productsResponse = await productApi.getProducts({ search: searchTerm || undefined, feedId: selectedFeedId || undefined, category: selectedCategory || undefined })
      if (productsResponse.success) { setProducts(productsResponse.data?.products || []) }
      else { setProducts([]) }
      const feedsResponse = await feedApi.getFeeds()
      if (feedsResponse.success) { setFeeds(feedsResponse.data?.feeds || []) }
      const statsResponse = await productApi.getProductStats()
      if (statsResponse.success) { setStats(statsResponse.data) }
    } catch (error) { console.error('Error loading data:', error); toast.error('Failed to load products'); setProducts([]) }
    finally { setLoading(false) }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const response = await productApi.deleteProduct(productId)
      if (response.success) { toast.success('Product deleted successfully!'); loadData() }
      else { toast.error(response.error?.message || 'Failed to delete product') }
    } catch (error) { console.error('Error deleting product:', error); toast.error('Failed to delete product') }
  }

  const handleCreateAd = async () => {
    if (!selectedProduct || !newAd.headline || !newAd.description) { toast.error('Please fill in all required fields'); return }
    try {
      const response = await adApi.createAd({ feedId: selectedProduct.feedId, productId: selectedProduct.id, headline: newAd.headline, description: newAd.description, targetAudience: newAd.targetAudience, budget: newAd.budget })
      if (response.success) { toast.success('Ad created successfully!'); setShowCreateAdModal(false); setSelectedProduct(null); setNewAd({ headline: '', description: '', targetAudience: '', budget: 0 }); loadData() }
      else { toast.error(response.error?.message || 'Failed to create ad') }
    } catch (error) { console.error('Error creating ad:', error); toast.error('Failed to create ad') }
  }

  const openCreateAdModal = (product: any) => {
    setSelectedProduct(product)
    setNewAd({ headline: product.title.substring(0, 50) + '...', description: product.description?.substring(0, 100) + '...' || '', targetAudience: '', budget: 0 })
    setShowCreateAdModal(true)
  }

  const formatPrice = (price: number, currency: string = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  useEffect(() => { loadData() }, [searchTerm, selectedFeedId, selectedCategory])

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || product.title.toLowerCase().includes(searchTerm.toLowerCase()) || product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFeed = !selectedFeedId || product.feedId === selectedFeedId
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesFeed && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone-200 border-t-teal-600 mx-auto mb-4"></div>
          <p className="text-stone-500 text-sm">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Products</h1>
          <p className="text-stone-500 text-sm mt-1">Manage all crawled products and create ads</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm border-stone-300 text-stone-600"><Package className="w-3.5 h-3.5 mr-1" />{stats.totalProducts} Total</Badge>
          <Badge variant="outline" className="text-sm border-stone-300 text-stone-600"><ShoppingCart className="w-3.5 h-3.5 mr-1" />{stats.productsWithAds} With Ads</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: stats.totalProducts, sub: 'Across all feeds', icon: Package, color: 'bg-teal-50 text-teal-700' },
          { label: 'With Ads', value: stats.productsWithAds, sub: `${stats.totalProducts > 0 ? Math.round((stats.productsWithAds / stats.totalProducts) * 100) : 0}% of total`, icon: ShoppingCart, color: 'bg-amber-50 text-amber-700' },
          { label: 'Without Ads', value: stats.productsWithoutAds, sub: 'Available for ads', icon: Eye, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Recent', value: stats.recentProducts, sub: 'Last 7 days', icon: Calendar, color: 'bg-stone-100 text-stone-700' },
        ].map((stat, i) => (
          <Card key={i} className="border-stone-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-stone-500">{stat.label}</CardTitle>
              <div className={`h-8 w-8 rounded-lg ${stat.color.split(' ')[0]} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color.split(' ')[1]}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-900">{stat.value}</div>
              <p className="text-xs text-stone-400">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-stone-200">
        <CardHeader><CardTitle className="flex items-center text-base"><Filter className="w-4 h-4 mr-2 text-stone-400" />Filters</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search" className="text-stone-700 text-sm">Search Products</Label>
              <div className="relative mt-1.5">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <Input id="search" placeholder="Search by title or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-stone-300 focus:ring-teal-500" />
              </div>
            </div>
            <div>
              <Label htmlFor="feed" className="text-stone-700 text-sm">Filter by Feed</Label>
              <select id="feed" value={selectedFeedId} onChange={(e) => setSelectedFeedId(e.target.value)} className="w-full mt-1.5 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm">
                <option value="">All Feeds</option>
                {feeds.map(feed => <option key={feed.id} value={feed.id}>{feed.name} ({feed.siteUrl})</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="category" className="text-stone-700 text-sm">Filter by Category</Label>
              <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full mt-1.5 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm">
                <option value="">All Categories</option>
                {Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(category => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="border-stone-200 card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base line-clamp-2">{product.title}</CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex items-center text-sm text-stone-500"><Globe className="w-3.5 h-3.5 mr-1.5" />{product.feed?.siteUrl}</div>
                    <div className="flex items-center text-sm text-stone-500 mt-1"><Tag className="w-3.5 h-3.5 mr-1.5" />Feed: {product.feed?.name}</div>
                  </CardDescription>
                </div>
                {product.price && <Badge className="ml-2 bg-amber-50 text-amber-700 border-amber-200"><DollarSign className="w-3 h-3 mr-0.5" />{formatPrice(product.price, product.currency)}</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              {product.imageUrl && (
                <div className="mb-4"><img src={product.imageUrl} alt={product.title} className="w-full h-32 object-cover rounded-lg" onError={(e) => { e.currentTarget.style.display = 'none' }} /></div>
              )}
              {product.description && <p className="text-sm text-stone-500 mb-4 line-clamp-3">{product.description}</p>}
              <div className="space-y-1.5">
                {product.category && <div className="flex items-center text-sm"><Tag className="w-3.5 h-3.5 mr-2 text-stone-400" /><span className="text-stone-500">{product.category}</span></div>}
                <div className="flex items-center text-sm"><Calendar className="w-3.5 h-3.5 mr-2 text-stone-400" /><span className="text-stone-500">Crawled: {formatDate(product.createdAt)}</span></div>
                <div className="flex items-center text-sm"><ShoppingCart className="w-3.5 h-3.5 mr-2 text-stone-400" /><span className="text-stone-500">{product._count?.ads || 0} ads created</span></div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
                <Button variant="outline" size="sm" onClick={() => window.open(product.link, '_blank')} className="border-stone-300 text-stone-600 hover:bg-stone-100">
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />View
                </Button>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={() => openCreateAdModal(product)} disabled={product._count?.ads > 0} className="bg-teal-700 hover:bg-teal-800 text-white">
                    <Plus className="w-3.5 h-3.5 mr-1" />Create Ad
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <Card className="border-stone-200">
          <CardContent className="text-center py-12">
            <Package className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-stone-900 mb-1">No products found</h3>
            <p className="text-stone-500 text-sm">{searchTerm || selectedFeedId || selectedCategory ? 'Try adjusting your filters to see more products.' : 'Start crawling feeds to see products here.'}</p>
          </CardContent>
        </Card>
      )}

      {showCreateAdModal && selectedProduct && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
          <Card className="w-full max-w-md mx-4 shadow-2xl border-stone-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Create Ad for Product</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateAdModal(false)} className="text-stone-400 hover:text-stone-600"><X className="h-4 w-4" /></Button>
              </div>
              <CardDescription>{selectedProduct.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="headline" className="text-stone-700 text-sm">Headline *</Label><Input id="headline" value={newAd.headline} onChange={(e) => setNewAd({ ...newAd, headline: e.target.value })} placeholder="Enter ad headline" className="mt-1.5 border-stone-300 focus:ring-teal-500" /></div>
              <div><Label htmlFor="description" className="text-stone-700 text-sm">Description *</Label><textarea id="description" value={newAd.description} onChange={(e) => setNewAd({ ...newAd, description: e.target.value })} placeholder="Enter ad description" className="w-full mt-1.5 px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" rows={3} /></div>
              <div><Label htmlFor="targetAudience" className="text-stone-700 text-sm">Target Audience</Label><Input id="targetAudience" value={newAd.targetAudience} onChange={(e) => setNewAd({ ...newAd, targetAudience: e.target.value })} placeholder="e.g., Adults 25-45" className="mt-1.5 border-stone-300 focus:ring-teal-500" /></div>
              <div><Label htmlFor="budget" className="text-stone-700 text-sm">Daily Budget ($)</Label><Input id="budget" type="number" value={newAd.budget} onChange={(e) => setNewAd({ ...newAd, budget: Number(e.target.value) })} placeholder="0" className="mt-1.5 border-stone-300 focus:ring-teal-500" /></div>
            </CardContent>
            <div className="flex justify-end gap-3 p-6 pt-0">
              <Button variant="outline" onClick={() => setShowCreateAdModal(false)} className="border-stone-300">Cancel</Button>
              <Button onClick={handleCreateAd} className="bg-teal-700 hover:bg-teal-800 text-white">Create Ad</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
