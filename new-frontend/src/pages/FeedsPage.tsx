import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Rss, ExternalLink, Settings, Trash2, RefreshCw, Download, Search, Globe, Square } from 'lucide-react'
import { feedApi, apiClient } from '@/lib/apiClient'
import toast from 'react-hot-toast'

/**
 * Feeds page component
 * Manages RSS feeds and content sources with real API integration
 */
export default function FeedsPage() {
  const [feeds, setFeeds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [refreshing, setRefreshing] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    totalFeeds: 0,
    totalItems: 0,
    lastUpdate: 'Never'
  })

  // New feed form state
  const [newFeed, setNewFeed] = useState({
    name: '',
    siteUrl: '',
    country: '',
    currency: 'USD'
  })

  /**
   * Load feeds from API
   */
  const loadFeeds = async () => {
    try {
      setLoading(true)
      const response = await feedApi.getFeeds()
      if (response.success) {
        // Backend returns {feeds: [...], pagination: {...}}, so we need response.data.feeds
        const feedsData = response.data?.feeds || []
        setFeeds(feedsData)
        updateStats(feedsData)
      } else {
        console.warn('Failed to load feeds:', response.error)
        setFeeds([])
        toast.error('Failed to load feeds')
      }
    } catch (error) {
      console.error('Error loading feeds:', error)
      toast.error('Failed to load feeds')
      setFeeds([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update statistics based on feeds data
   */
  const updateStats = (feedsData: any[]) => {
    const totalItems = feedsData.reduce((sum, feed) => sum + (feed.productCount || 0), 0)
    const lastUpdate = feedsData.length > 0 
      ? feedsData.reduce((latest, feed) => {
          const feedDate = new Date(feed.lastCrawledAt || feed.createdAt)
          return feedDate > latest ? feedDate : latest
        }, new Date(0))
      : null

    setStats({
      totalFeeds: feedsData.length,
      totalItems,
      lastUpdate: lastUpdate ? formatTimeAgo(lastUpdate) : 'Never'
    })
  }

  /**
   * Format time ago
   */
  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  /**
   * Create new feed
   */
  const handleCreateFeed = async () => {
    if (!newFeed.name || !newFeed.siteUrl) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await feedApi.createFeed({
        name: newFeed.name,
        siteUrl: newFeed.siteUrl,
        country: newFeed.country,
        currency: newFeed.currency
      })

      if (response.success) {
        toast.success('Feed created successfully!')
        setShowCreateModal(false)
        setNewFeed({ name: '', siteUrl: '', country: '', currency: 'USD' })
        
        // Add the new feed to the existing feeds instead of reloading all feeds
        const newFeedData = response.data?.feed
        if (newFeedData) {
          setFeeds(prevFeeds => [newFeedData, ...prevFeeds])
          updateStats([newFeedData, ...feeds])
        } else {
          // Fallback: reload feeds if we don't have the new feed data
          loadFeeds()
        }
      } else {
        toast.error(response.error?.message || 'Failed to create feed')
      }
    } catch (error) {
      console.error('Error creating feed:', error)
      toast.error('Failed to create feed')
    }
  }

  /**
   * Stop feed crawling
   */
  const handleStopFeed = async (feedId: string) => {
    if (!confirm('Are you sure you want to stop this feed crawl?')) {
      return
    }

    try {
      const response = await feedApi.stopFeed(feedId)
      
      if (response.success) {
        toast.success('Feed crawl stopped successfully!')
        loadFeeds() // Reload feeds to update status
      } else {
        toast.error(response.error?.message || 'Failed to stop feed crawl')
      }
    } catch (error) {
      console.error('Error stopping feed crawl:', error)
      toast.error('Failed to stop feed crawl')
    }
  }

  /**
   * Refresh feed (trigger new crawl)
   */
  const handleRefreshFeed = async (feedId: string) => {
    try {
      setRefreshing(feedId)
      const response = await feedApi.refreshFeed(feedId)
      
      if (response.success) {
        toast.success('Feed refresh started!')
        // Reload feeds after a short delay
        setTimeout(() => {
          loadFeeds()
        }, 2000)
      } else {
        toast.error(response.error?.message || 'Failed to refresh feed')
      }
    } catch (error) {
      console.error('Error refreshing feed:', error)
      toast.error('Failed to refresh feed')
    } finally {
      setRefreshing(null)
    }
  }

  /**
   * Delete feed
   */
  const handleDeleteFeed = async (feedId: string) => {
    if (!confirm('Are you sure you want to delete this feed?')) return

    try {
      const response = await feedApi.deleteFeed(feedId)
      
      if (response.success) {
        toast.success('Feed deleted successfully!')
        loadFeeds()
      } else {
        toast.error(response.error?.message || 'Failed to delete feed')
      }
    } catch (error) {
      console.error('Error deleting feed:', error)
      toast.error('Failed to delete feed')
    }
  }

  /**
   * Download feed
   */
  const handleDownloadFeed = async (feedId: string, format: string = 'json') => {
    try {
      const response = await feedApi.downloadFeed(feedId, format)
      
      if (response.success) {
        // Create download link
        const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `feed-${feedId}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast.success('Feed downloaded successfully!')
      } else {
        toast.error(response.error?.message || 'Failed to download feed')
      }
    } catch (error) {
      console.error('Error downloading feed:', error)
      toast.error('Failed to download feed')
    }
  }

  /**
   * Test crawler on URL
   */
  const handleTestCrawler = async (url: string) => {
    try {
      const response = await apiClient.post('/crawler/test', { url })
      
      if (response.success) {
        toast.success('Crawler test completed! Check the results.')
        // You could show results in a modal or redirect to results page
      } else {
        toast.error(response.error?.message || 'Crawler test failed')
      }
    } catch (error) {
      console.error('Error testing crawler:', error)
      toast.error('Failed to test crawler')
    }
  }

  // Load feeds on component mount
  useEffect(() => {
    loadFeeds()
  }, [])

  // Filter feeds based on search term
  const filteredFeeds = feeds.filter(feed =>
    feed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feed.siteUrl.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Feeds Management</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage your RSS feeds and content sources for automated campaigns
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add New Feed
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search feeds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <Button variant="outline" onClick={loadFeeds} className="w-full sm:w-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh All
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feeds</CardTitle>
            <Rss className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeeds}</div>
            <p className="text-xs text-muted-foreground">Active feeds</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">Content items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Update</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lastUpdate}</div>
            <p className="text-xs text-muted-foreground">Most recent</p>
          </CardContent>
        </Card>
      </div>

      {/* Feeds List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Feeds</CardTitle>
          <CardDescription>
            Manage and monitor your RSS feeds and content sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading feeds...</span>
            </div>
          ) : filteredFeeds.length === 0 ? (
            <div className="text-center py-8">
              <Rss className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'No feeds found' : 'No feeds yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Create your first feed to start crawling content'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Feed
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeeds.map((feed) => (
                <div
                  key={feed.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Rss className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {feed.name}
                      </h3>
                      <Badge
                        variant={
                          feed.lastCrawlStatus === 'completed' ? 'default' : 
                          feed.lastCrawlStatus === 'running' ? 'secondary' :
                          feed.lastCrawlStatus === 'failed' ? 'destructive' :
                          feed.lastCrawlStatus === 'stopped' ? 'outline' :
                          'secondary'
                        }
                      >
                        {feed.lastCrawlStatus || 'pending'}
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium">URL: {feed.siteUrl}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-1 space-y-1 sm:space-y-0">
                        <span>Items: {feed._count?.products || feed.productCount || 0}</span>
                        <span>Last update: {formatTimeAgo(new Date(feed.lastCrawledAt || feed.createdAt))}</span>
                        {feed.country && <span>Country: {feed.country}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleTestCrawler(feed.siteUrl)}
                      title="Test crawler"
                      className="h-8 w-8 p-0"
                    >
                      <Globe className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRefreshFeed(feed.id)}
                      disabled={refreshing === feed.id}
                      title="Refresh feed"
                      className="h-8 w-8 p-0"
                    >
                      <RefreshCw className={`h-4 w-4 ${refreshing === feed.id ? 'animate-spin' : ''}`} />
                    </Button>
                    {(feed.lastCrawlStatus === 'running' || feed.lastCrawlStatus === 'pending') && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleStopFeed(feed.id)}
                        title="Stop crawling"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadFeed(feed.id)}
                      title="Download feed"
                      className="h-8 w-8 p-0"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteFeed(feed.id)}
                      className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                      title="Delete feed"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Feed Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Feed</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Feed Name *</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter feed name"
                  value={newFeed.name}
                  onChange={(e) => setNewFeed({...newFeed, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Website URL *</label>
                <input 
                  type="url" 
                  className="w-full p-2 border rounded-md"
                  placeholder="https://example.com"
                  value={newFeed.siteUrl}
                  onChange={(e) => setNewFeed({...newFeed, siteUrl: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-md"
                    placeholder="US"
                    value={newFeed.country}
                    onChange={(e) => setNewFeed({...newFeed, country: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={newFeed.currency}
                    onChange={(e) => setNewFeed({...newFeed, currency: e.target.value})}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="flex-1" onClick={handleCreateFeed}>
                  Create Feed
                </Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1 sm:flex-none">
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
