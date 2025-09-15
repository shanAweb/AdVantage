import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Megaphone, Eye, MousePointer, DollarSign, TrendingUp, RefreshCw, Trash2, Edit, Pause } from 'lucide-react'
import { adApi, feedApi } from '@/lib/apiClient'
import toast from 'react-hot-toast'

/**
 * Ads page component
 * Manage individual ads and their performance with real API integration
 */
export default function AdsPage() {
  const [ads, setAds] = useState<any[]>([])
  const [feeds, setFeeds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [stats, setStats] = useState({
    totalImpressions: 0,
    totalClicks: 0,
    totalSpend: 0,
    conversions: 0
  })

  // New ad form state
  const [newAd, setNewAd] = useState({
    feedId: '',
    productId: '',
    headline: '',
    description: ''
  })

  /**
   * Load ads and feeds from API
   */
  const loadData = async () => {
    try {
      setLoading(true)
      console.log('Loading ads data...')
      
      // Load ads
      try {
        console.log('Calling adApi.getAds()...')
        const adsResponse = await adApi.getAds()
        console.log('Ads response:', adsResponse)
        if (adsResponse.success) {
          setAds(adsResponse.data || [])
          updateStats(adsResponse.data || [])
          console.log('Ads loaded successfully:', adsResponse.data?.length || 0)
        } else {
          console.warn('Failed to load ads:', adsResponse.error)
          setAds([])
        }
      } catch (adsError) {
        console.error('Error loading ads:', adsError)
        setAds([])
      }

      // Load feeds
      try {
        console.log('Calling feedApi.getFeeds()...')
        const feedsResponse = await feedApi.getFeeds()
        console.log('Feeds response:', feedsResponse)
        if (feedsResponse.success) {
          // Backend returns {feeds: [...], pagination: {...}}, so we need response.data.feeds
          const feedsData = feedsResponse.data?.feeds || []
          setFeeds(feedsData)
          console.log('Feeds loaded successfully:', feedsData.length)
        } else {
          console.warn('Failed to load feeds:', feedsResponse.error)
          setFeeds([])
        }
      } catch (feedError) {
        console.error('Error loading feeds:', feedError)
        setFeeds([])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load ads')
      setAds([])
      setFeeds([])
    } finally {
      setLoading(false)
      console.log('Loading completed')
    }
  }

  /**
   * Update statistics based on ads data
   */
  const updateStats = (adsData: any[]) => {
    const totalImpressions = adsData.reduce((sum, ad) => sum + (ad.impressions || 0), 0)
    const totalClicks = adsData.reduce((sum, ad) => sum + (ad.clicks || 0), 0)
    const totalSpend = adsData.reduce((sum, ad) => sum + (ad.spend || 0), 0)
    const conversions = adsData.reduce((sum, ad) => sum + (ad.conversions || 0), 0)

    setStats({
      totalImpressions,
      totalClicks,
      totalSpend,
      conversions
    })
  }

  /**
   * Create new ad
   */
  const handleCreateAd = async () => {
    if (!newAd.feedId || !newAd.productId) {
      toast.error('Please select a feed and product')
      return
    }

    try {
      const response = await adApi.createAd({
        feedId: newAd.feedId,
        productId: newAd.productId,
        headline: newAd.headline,
        description: newAd.description
      })

      if (response.success) {
        toast.success('Ad created successfully!')
        setShowCreateModal(false)
        setNewAd({ feedId: '', productId: '', headline: '', description: '' })
        loadData()
      } else {
        toast.error(response.error?.message || 'Failed to create ad')
      }
    } catch (error) {
      console.error('Error creating ad:', error)
      toast.error('Failed to create ad')
    }
  }

  /**
   * Bulk create ads from feed
   */
  const handleBulkCreateAds = async (feedId: string) => {
    try {
      // First get products from the feed
      const feedResponse = await feedApi.getFeedProducts(feedId, { limit: 10 })
      
      if (feedResponse.success && feedResponse.data?.length > 0) {
        const productIds = feedResponse.data.map((product: any) => product.id)
        
        const response = await adApi.bulkCreateAds({
          feedId,
          productIds,
          headlineTemplate: 'Check out this amazing product!',
          descriptionTemplate: 'Limited time offer - Don\'t miss out!'
        })

        if (response.success) {
          toast.success(`Created ${productIds.length} ads successfully!`)
          loadData()
        } else {
          toast.error(response.error?.message || 'Failed to create ads')
        }
      } else {
        toast.error('No products found in this feed')
      }
    } catch (error) {
      console.error('Error bulk creating ads:', error)
      toast.error('Failed to create ads')
    }
  }

  /**
   * Delete ad
   */
  const handleDeleteAd = async (adId: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return

    try {
      const response = await adApi.deleteAd(adId)
      
      if (response.success) {
        toast.success('Ad deleted successfully!')
        loadData()
      } else {
        toast.error(response.error?.message || 'Failed to delete ad')
      }
    } catch (error) {
      console.error('Error deleting ad:', error)
      toast.error('Failed to delete ad')
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Add error boundary
  if (loading && ads.length === 0 && feeds.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ads</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your individual ads and track their performance
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2">Loading ads...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Ads Management</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage and optimize your individual ads
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button variant="outline" onClick={loadData} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Ad
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSpend.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Ads List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Ads</CardTitle>
          <CardDescription>
            Manage and monitor your individual ad performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading ads...</span>
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No ads yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first ad to start advertising
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Ad
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => {
                const feed = feeds.find(f => f.id === ad.feedId)
                const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0.00'
                
                return (
                  <div
                    key={ad.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Megaphone className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {ad.headline || 'Untitled Ad'}
                        </h3>
                        <Badge
                          variant={ad.status === 'active' ? 'default' : 'secondary'}
                        >
                          {ad.status || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-medium">Feed: {feed?.name || 'Unknown'}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                          <div>
                            <span className="font-medium">Impressions:</span> {ad.impressions?.toLocaleString() || 0}
                          </div>
                          <div>
                            <span className="font-medium">Clicks:</span> {ad.clicks?.toLocaleString() || 0}
                          </div>
                          <div>
                            <span className="font-medium">CTR:</span> {ctr}%
                          </div>
                          <div>
                            <span className="font-medium">Spend:</span> ${ad.spend?.toFixed(2) || '0.00'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Pause className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteAd(ad.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Bulk Create Ads</CardTitle>
            <CardDescription>
              Create multiple ads from your feeds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {feeds.map(feed => (
                <Button 
                  key={feed.id}
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleBulkCreateAds(feed.id)}
                >
                  <Megaphone className="mr-2 h-4 w-4" />
                  Create Ads from {feed.name}
                </Button>
              ))}
              {feeds.length === 0 && (
                <p className="text-sm text-gray-500">No feeds available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Ads</CardTitle>
            <CardDescription>
              Your best performing ads
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ads.length > 0 ? (
              <div className="space-y-3">
                {ads
                  .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
                  .slice(0, 3)
                  .map((ad, index) => {
                    const feed = feeds.find(f => f.id === ad.feedId)
                    return (
                      <div key={ad.id} className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {ad.headline || 'Untitled Ad'}
                        </span>
                        <Badge variant={index === 0 ? 'default' : 'secondary'}>
                          {index === 0 ? 'Best CTR' : `${ad.clicks || 0} clicks`}
                        </Badge>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No ads to display</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Ad Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Ad</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Feed *</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newAd.feedId}
                  onChange={(e) => setNewAd({...newAd, feedId: e.target.value})}
                >
                  <option value="">Choose a feed...</option>
                  {feeds.map(feed => (
                    <option key={feed.id} value={feed.id}>{feed.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Product ID *</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter product ID"
                  value={newAd.productId}
                  onChange={(e) => setNewAd({...newAd, productId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Headline</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter ad headline"
                  value={newAd.headline}
                  onChange={(e) => setNewAd({...newAd, headline: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea 
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter ad description"
                  rows={3}
                  value={newAd.description}
                  onChange={(e) => setNewAd({...newAd, description: e.target.value})}
                />
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1" onClick={handleCreateAd}>
                  Create Ad
                </Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
