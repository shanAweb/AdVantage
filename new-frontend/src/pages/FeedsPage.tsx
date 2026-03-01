import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Rss, ExternalLink, Settings, Trash2, RefreshCw, Download, Search, Globe, Square, X } from 'lucide-react'
import { feedApi, apiClient } from '@/lib/apiClient'
import toast from 'react-hot-toast'

export default function FeedsPage() {
  const [feeds, setFeeds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [refreshing, setRefreshing] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({ totalFeeds: 0, totalItems: 0, lastUpdate: 'Never' })
  const [newFeed, setNewFeed] = useState({ name: '', siteUrl: '', country: '', currency: 'USD' })

  const loadFeeds = async () => {
    try {
      setLoading(true)
      const response = await feedApi.getFeeds()
      if (response.success) {
        const feedsData = response.data?.feeds || []
        setFeeds(feedsData)
        updateStats(feedsData)
      } else {
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

  const updateStats = (feedsData: any[]) => {
    const totalItems = feedsData.reduce((sum: number, feed: any) => sum + (feed.productCount || 0), 0)
    const lastUpdate = feedsData.length > 0
      ? feedsData.reduce((latest: Date, feed: any) => {
          const feedDate = new Date(feed.lastCrawledAt || feed.createdAt)
          return feedDate > latest ? feedDate : latest
        }, new Date(0))
      : null
    setStats({ totalFeeds: feedsData.length, totalItems, lastUpdate: lastUpdate ? formatTimeAgo(lastUpdate) : 'Never' })
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const handleCreateFeed = async () => {
    if (!newFeed.name || !newFeed.siteUrl) { toast.error('Please fill in all required fields'); return }
    try {
      const response = await feedApi.createFeed({ name: newFeed.name, siteUrl: newFeed.siteUrl, country: newFeed.country, currency: newFeed.currency })
      if (response.success) {
        toast.success('Feed created successfully!')
        setShowCreateModal(false)
        setNewFeed({ name: '', siteUrl: '', country: '', currency: 'USD' })
        const newFeedData = response.data?.feed
        if (newFeedData) { setFeeds(prev => [newFeedData, ...prev]); updateStats([newFeedData, ...feeds]) }
        else { loadFeeds() }
      } else { toast.error(response.error?.message || 'Failed to create feed') }
    } catch (error) { console.error('Error creating feed:', error); toast.error('Failed to create feed') }
  }

  const handleStopFeed = async (feedId: string) => {
    if (!confirm('Are you sure you want to stop this feed crawl?')) return
    try {
      const response = await feedApi.stopFeed(feedId)
      if (response.success) { toast.success('Feed crawl stopped successfully!'); loadFeeds() }
      else { toast.error(response.error?.message || 'Failed to stop feed crawl') }
    } catch (error) { console.error('Error stopping feed crawl:', error); toast.error('Failed to stop feed crawl') }
  }

  const handleRefreshFeed = async (feedId: string) => {
    try {
      setRefreshing(feedId)
      const response = await feedApi.refreshFeed(feedId)
      if (response.success) { toast.success('Feed refresh started!'); setTimeout(() => { loadFeeds() }, 2000) }
      else { toast.error(response.error?.message || 'Failed to refresh feed') }
    } catch (error) { console.error('Error refreshing feed:', error); toast.error('Failed to refresh feed') }
    finally { setRefreshing(null) }
  }

  const handleDeleteFeed = async (feedId: string) => {
    if (!confirm('Are you sure you want to delete this feed?')) return
    try {
      const response = await feedApi.deleteFeed(feedId)
      if (response.success) { toast.success('Feed deleted successfully!'); loadFeeds() }
      else { toast.error(response.error?.message || 'Failed to delete feed') }
    } catch (error) { console.error('Error deleting feed:', error); toast.error('Failed to delete feed') }
  }

  const handleDownloadFeed = async (feedId: string, format: string = 'json') => {
    try {
      const response = await feedApi.downloadFeed(feedId, format)
      if (response.success) {
        const blob = new Blob([JSON.stringify(response.data)], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = `feed-${feedId}.${format}`
        document.body.appendChild(a); a.click(); window.URL.revokeObjectURL(url); document.body.removeChild(a)
        toast.success('Feed downloaded successfully!')
      } else { toast.error(response.error?.message || 'Failed to download feed') }
    } catch (error) { console.error('Error downloading feed:', error); toast.error('Failed to download feed') }
  }

  const handleTestCrawler = async (url: string) => {
    try {
      const response = await apiClient.post('/crawler/test', { url })
      if (response.success) { toast.success('Crawler test completed!') }
      else { toast.error(response.error?.message || 'Crawler test failed') }
    } catch (error) { console.error('Error testing crawler:', error); toast.error('Failed to test crawler') }
  }

  useEffect(() => { loadFeeds() }, [])

  const filteredFeeds = feeds.filter(feed =>
    feed.name.toLowerCase().includes(searchTerm.toLowerCase()) || feed.siteUrl.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'running': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'failed': return 'bg-red-50 text-red-700 border-red-200'
      case 'stopped': return 'bg-stone-100 text-stone-600 border-stone-200'
      default: return 'bg-stone-100 text-stone-600 border-stone-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Feeds Management</h1>
          <p className="text-sm text-stone-500">Manage your RSS feeds and content sources for automated campaigns</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto bg-teal-700 hover:bg-teal-800 text-white">
          <Plus className="mr-2 h-4 w-4" />Add New Feed
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input type="text" placeholder="Search feeds..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all duration-200" />
        </div>
        <Button variant="outline" onClick={loadFeeds} className="w-full sm:w-auto border-stone-300 text-stone-600 hover:bg-stone-100">
          <RefreshCw className="mr-2 h-4 w-4" />Refresh All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Feeds', value: stats.totalFeeds, sub: 'Active feeds', icon: Rss, color: 'bg-teal-50 text-teal-700' },
          { label: 'Total Items', value: stats.totalItems, sub: 'Content items', icon: ExternalLink, color: 'bg-amber-50 text-amber-700' },
          { label: 'Last Update', value: stats.lastUpdate, sub: 'Most recent', icon: Settings, color: 'bg-stone-100 text-stone-700' },
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
        <CardHeader>
          <CardTitle className="text-lg">Your Feeds</CardTitle>
          <CardDescription>Manage and monitor your RSS feeds and content sources</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-5 w-5 animate-spin text-teal-600" /><span className="ml-2 text-stone-500 text-sm">Loading feeds...</span>
            </div>
          ) : filteredFeeds.length === 0 ? (
            <div className="text-center py-10">
              <Rss className="h-10 w-10 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-medium text-stone-900 mb-1">{searchTerm ? 'No feeds found' : 'No feeds yet'}</h3>
              <p className="text-stone-500 text-sm mb-4">{searchTerm ? 'Try adjusting your search terms' : 'Create your first feed to start crawling content'}</p>
              {!searchTerm && <Button onClick={() => setShowCreateModal(true)} className="bg-teal-700 hover:bg-teal-800 text-white"><Plus className="mr-2 h-4 w-4" />Create First Feed</Button>}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFeeds.map((feed) => (
                <div key={feed.id} className="flex items-center justify-between p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors duration-200">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0"><Rss className="h-4 w-4 text-teal-700" /></div>
                      <h3 className="font-medium text-stone-900">{feed.name}</h3>
                      <Badge className={getStatusBadge(feed.lastCrawlStatus)}>{feed.lastCrawlStatus || 'pending'}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-stone-500 ml-11">
                      <p className="font-medium text-stone-600">{feed.siteUrl}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span>Items: {feed._count?.products || feed.productCount || 0}</span>
                        <span>Updated: {formatTimeAgo(new Date(feed.lastCrawledAt || feed.createdAt))}</span>
                        {feed.country && <span>Country: {feed.country}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleTestCrawler(feed.siteUrl)} title="Test crawler" className="h-8 w-8 p-0 text-stone-400 hover:text-stone-600"><Globe className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRefreshFeed(feed.id)} disabled={refreshing === feed.id} title="Refresh" className="h-8 w-8 p-0 text-stone-400 hover:text-stone-600">
                      <RefreshCw className={`h-4 w-4 ${refreshing === feed.id ? 'animate-spin' : ''}`} />
                    </Button>
                    {(feed.lastCrawlStatus === 'running' || feed.lastCrawlStatus === 'pending') && (
                      <Button variant="ghost" size="sm" onClick={() => handleStopFeed(feed.id)} title="Stop" className="h-8 w-8 p-0 text-red-400 hover:text-red-600"><Square className="h-4 w-4" /></Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleDownloadFeed(feed.id)} title="Download" className="h-8 w-8 p-0 text-stone-400 hover:text-stone-600"><Download className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteFeed(feed.id)} title="Delete" className="h-8 w-8 p-0 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showCreateModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-stone-900">Create New Feed</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-600"><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Feed Name *</label>
                <input type="text" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" placeholder="Enter feed name" value={newFeed.name} onChange={(e) => setNewFeed({...newFeed, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Website URL *</label>
                <input type="url" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" placeholder="https://example.com" value={newFeed.siteUrl} onChange={(e) => setNewFeed({...newFeed, siteUrl: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Country</label>
                  <input type="text" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" placeholder="US" value={newFeed.country} onChange={(e) => setNewFeed({...newFeed, country: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Currency</label>
                  <select className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" value={newFeed.currency} onChange={(e) => setNewFeed({...newFeed, currency: e.target.value})}>
                    <option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="CAD">CAD</option><option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button className="flex-1 bg-teal-700 hover:bg-teal-800 text-white" onClick={handleCreateFeed}>Create Feed</Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)} className="border-stone-300">Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
