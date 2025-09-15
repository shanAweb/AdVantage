import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Megaphone, Target, Calendar, DollarSign, RefreshCw, Play, Pause, Trash2 } from 'lucide-react'
import { newCampaignApi, feedApi } from '@/lib/apiClient'
import toast from 'react-hot-toast'

/**
 * New Campaigns page component
 * Create and manage new advertising campaigns with real API integration
 */
export default function NewCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [feeds, setFeeds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [stats, setStats] = useState({
    totalDrafts: 0,
    inReview: 0,
    totalBudget: 0,
    thisMonth: 0
  })

  // New campaign form state
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    feedId: '',
    channel: 'google',
    budget: '',
    currency: 'USD',
    country: 'US'
  })

  /**
   * Load campaigns and feeds from API
   */
  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load campaigns
      try {
        const campaignsResponse = await newCampaignApi.getCampaigns()
        if (campaignsResponse.success) {
          setCampaigns(campaignsResponse.data || [])
          updateStats(campaignsResponse.data || [])
        } else {
          console.warn('Failed to load campaigns:', campaignsResponse.error)
          setCampaigns([])
        }
      } catch (campaignError) {
        console.error('Error loading campaigns:', campaignError)
        setCampaigns([])
      }

      // Load feeds
      try {
        const feedsResponse = await feedApi.getFeeds()
        if (feedsResponse.success) {
          // Backend returns {feeds: [...], pagination: {...}}, so we need response.data.feeds
          const feedsData = feedsResponse.data?.feeds || []
          setFeeds(feedsData)
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
      toast.error('Failed to load data')
      setCampaigns([])
      setFeeds([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update statistics based on campaigns data
   */
  const updateStats = (campaignsData: any[]) => {
    const totalDrafts = campaignsData.filter(c => c.status === 'draft').length
    const inReview = campaignsData.filter(c => c.status === 'review').length
    const totalBudget = campaignsData.reduce((sum, c) => sum + (c.budget || 0), 0)
    const thisMonth = campaignsData.filter(c => {
      const createdDate = new Date(c.createdAt)
      const now = new Date()
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
    }).length

    setStats({
      totalDrafts,
      inReview,
      totalBudget,
      thisMonth
    })
  }

  /**
   * Create new campaign
   */
  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.feedId || !newCampaign.budget) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const response = await newCampaignApi.createCampaign({
        name: newCampaign.name,
        feedId: newCampaign.feedId,
        channel: newCampaign.channel,
        budget: parseFloat(newCampaign.budget),
        currency: newCampaign.currency,
        country: newCampaign.country
      })

      if (response.success) {
        toast.success('Campaign created successfully!')
        setShowCreateModal(false)
        setNewCampaign({ name: '', feedId: '', channel: 'google', budget: '', currency: 'USD', country: 'US' })
        loadData()
      } else {
        toast.error(response.error?.message || 'Failed to create campaign')
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
      toast.error('Failed to create campaign')
    }
  }

  /**
   * Launch campaign
   */
  const handleLaunchCampaign = async (campaignId: string) => {
    try {
      const response = await newCampaignApi.launchCampaign(campaignId)
      
      if (response.success) {
        toast.success('Campaign launched successfully!')
        loadData()
      } else {
        toast.error(response.error?.message || 'Failed to launch campaign')
      }
    } catch (error) {
      console.error('Error launching campaign:', error)
      toast.error('Failed to launch campaign')
    }
  }

  /**
   * Pause campaign
   */
  const handlePauseCampaign = async (campaignId: string) => {
    try {
      const response = await newCampaignApi.pauseCampaign(campaignId)
      
      if (response.success) {
        toast.success('Campaign paused successfully!')
        loadData()
      } else {
        toast.error(response.error?.message || 'Failed to pause campaign')
      }
    } catch (error) {
      console.error('Error pausing campaign:', error)
      toast.error('Failed to pause campaign')
    }
  }

  /**
   * Delete campaign
   */
  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return

    try {
      const response = await newCampaignApi.deleteCampaign(campaignId)
      
      if (response.success) {
        toast.success('Campaign deleted successfully!')
        loadData()
      } else {
        toast.error(response.error?.message || 'Failed to delete campaign')
      }
    } catch (error) {
      console.error('Error deleting campaign:', error)
      toast.error('Failed to delete campaign')
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">New Campaigns</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Create and manage your new advertising campaigns
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button variant="outline" onClick={loadData} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drafts</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDrafts}</div>
            <p className="text-xs text-muted-foreground">Draft campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inReview}</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(stats.totalBudget / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">Allocated budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground">New campaigns</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Templates</CardTitle>
          <CardDescription>
            Choose from pre-built templates to get started quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <Megaphone className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-medium mb-2">Search Campaign</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Target users actively searching for your products
              </p>
              <Button size="sm" className="w-full">Use Template</Button>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <Target className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-medium mb-2">Display Campaign</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Reach users across websites and apps
              </p>
              <Button size="sm" className="w-full">Use Template</Button>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <Calendar className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-medium mb-2">Video Campaign</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Engage users with video content
              </p>
              <Button size="sm" className="w-full">Use Template</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>
            Your recently created campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading campaigns...</span>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No campaigns yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first campaign to start advertising
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Campaign
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => {
                const feed = feeds.find(f => f.id === campaign.feedId)
                return (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Megaphone className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {campaign.name}
                        </h3>
                        <Badge
                          variant={campaign.status === 'draft' ? 'secondary' : campaign.status === 'active' ? 'default' : 'outline'}
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span>Channel: {campaign.channel}</span>
                          <span>Budget: ${campaign.budget}</span>
                          <span>Feed: {feed?.name || 'Unknown'}</span>
                          <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {campaign.status === 'draft' && (
                        <Button 
                          size="sm"
                          onClick={() => handleLaunchCampaign(campaign.id)}
                        >
                          <Play className="mr-1 h-4 w-4" />
                          Launch
                        </Button>
                      )}
                      {campaign.status === 'active' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePauseCampaign(campaign.id)}
                        >
                          <Pause className="mr-1 h-4 w-4" />
                          Pause
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteCampaign(campaign.id)}
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

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Campaign</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Campaign Name *</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter campaign name"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Select Feed *</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newCampaign.feedId}
                  onChange={(e) => setNewCampaign({...newCampaign, feedId: e.target.value})}
                >
                  <option value="">Choose a feed...</option>
                  {feeds.map(feed => (
                    <option key={feed.id} value={feed.id}>{feed.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Channel</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newCampaign.channel}
                  onChange={(e) => setNewCampaign({...newCampaign, channel: e.target.value})}
                >
                  <option value="google">Google Ads</option>
                  <option value="microsoft">Microsoft Ads</option>
                  <option value="youtube">YouTube Ads</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Budget *</label>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded-md"
                    placeholder="1000"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({...newCampaign, budget: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={newCampaign.currency}
                    onChange={(e) => setNewCampaign({...newCampaign, currency: e.target.value})}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="US"
                  value={newCampaign.country}
                  onChange={(e) => setNewCampaign({...newCampaign, country: e.target.value})}
                />
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1" onClick={handleCreateCampaign}>
                  Create Campaign
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
