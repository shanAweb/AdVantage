import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Megaphone, Target, Calendar, DollarSign, RefreshCw, Play, Pause, Trash2, X, ArrowRight } from 'lucide-react'
import { newCampaignApi, feedApi } from '@/lib/apiClient'
import toast from 'react-hot-toast'

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

  const [newCampaign, setNewCampaign] = useState({
    name: '',
    feedId: '',
    channel: 'google',
    budget: '',
    currency: 'USD',
    country: 'US'
  })

  const loadData = async () => {
    try {
      setLoading(true)
      try {
        const campaignsResponse = await newCampaignApi.getCampaigns()
        if (campaignsResponse.success) {
          setCampaigns(campaignsResponse.data || [])
          updateStats(campaignsResponse.data || [])
        } else {
          setCampaigns([])
        }
      } catch (campaignError) {
        console.error('Error loading campaigns:', campaignError)
        setCampaigns([])
      }

      try {
        const feedsResponse = await feedApi.getFeeds()
        if (feedsResponse.success) {
          const feedsData = feedsResponse.data?.feeds || []
          setFeeds(feedsData)
        } else {
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

  const updateStats = (campaignsData: any[]) => {
    const totalDrafts = campaignsData.filter(c => c.status === 'draft').length
    const inReview = campaignsData.filter(c => c.status === 'review').length
    const totalBudget = campaignsData.reduce((sum, c) => sum + (c.budget || 0), 0)
    const thisMonth = campaignsData.filter(c => {
      const createdDate = new Date(c.createdAt)
      const now = new Date()
      return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
    }).length
    setStats({ totalDrafts, inReview, totalBudget, thisMonth })
  }

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

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'draft': return 'bg-stone-100 text-stone-600 border-stone-200'
      case 'review': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'paused': return 'bg-amber-50 text-amber-700 border-amber-200'
      default: return 'bg-stone-100 text-stone-600 border-stone-200'
    }
  }

  useEffect(() => { loadData() }, [])

  const templates = [
    { icon: Megaphone, name: 'Search Campaign', description: 'Target users actively searching for your products', color: 'bg-teal-50 text-teal-700' },
    { icon: Target, name: 'Display Campaign', description: 'Reach users across websites and apps', color: 'bg-emerald-50 text-emerald-700' },
    { icon: Calendar, name: 'Video Campaign', description: 'Engage users with video content', color: 'bg-amber-50 text-amber-700' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">New Campaigns</h1>
          <p className="text-stone-500 text-sm mt-1">Create and manage your new advertising campaigns</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadData} disabled={loading} className="border-stone-300 text-stone-600 hover:bg-stone-100">
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="bg-teal-700 hover:bg-teal-800 text-white">
            <Plus className="mr-2 h-4 w-4" />Create Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Drafts', value: stats.totalDrafts, sub: 'Draft campaigns', icon: Megaphone, color: 'bg-teal-50 text-teal-700' },
          { label: 'In Review', value: stats.inReview, sub: 'Pending approval', icon: Target, color: 'bg-amber-50 text-amber-700' },
          { label: 'Total Budget', value: `$${(stats.totalBudget / 1000).toFixed(1)}K`, sub: 'Allocated budget', icon: DollarSign, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'This Month', value: stats.thisMonth, sub: 'New campaigns', icon: Calendar, color: 'bg-stone-100 text-stone-700' },
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
          <CardTitle className="text-lg">Campaign Templates</CardTitle>
          <CardDescription>Choose from pre-built templates to get started quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template, i) => {
              const Icon = template.icon
              return (
                <div key={i} className="p-5 border border-stone-200 rounded-xl hover:bg-stone-50 transition-all duration-200 cursor-pointer group">
                  <div className={`h-10 w-10 rounded-xl ${template.color.split(' ')[0]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-5 w-5 ${template.color.split(' ')[1]}`} />
                  </div>
                  <h3 className="font-medium text-stone-900 mb-1.5">{template.name}</h3>
                  <p className="text-sm text-stone-500 mb-4">{template.description}</p>
                  <Button size="sm" className="w-full bg-teal-700 hover:bg-teal-800 text-white">
                    Use Template<ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-stone-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Campaigns</CardTitle>
              <CardDescription>{campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} found</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-5 w-5 animate-spin text-teal-600" />
              <span className="ml-2 text-stone-500 text-sm">Loading campaigns...</span>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-10">
              <Megaphone className="h-10 w-10 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-medium text-stone-900 mb-1">No campaigns yet</h3>
              <p className="text-stone-500 text-sm mb-4">Create your first campaign to start advertising</p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-teal-700 hover:bg-teal-800 text-white">
                <Plus className="mr-2 h-4 w-4" />Create First Campaign
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((campaign) => {
                const feed = feeds.find(f => f.id === campaign.feedId)
                return (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors duration-200">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                          <Megaphone className="h-4 w-4 text-teal-700" />
                        </div>
                        <h3 className="font-medium text-stone-900">{campaign.name}</h3>
                        <Badge className={getStatusBadge(campaign.status)}>{campaign.status}</Badge>
                      </div>
                      <div className="ml-11 flex items-center space-x-4 text-sm text-stone-500">
                        <span><span className="font-medium text-stone-600">Channel:</span> {campaign.channel}</span>
                        <span><span className="font-medium text-stone-600">Budget:</span> ${campaign.budget}</span>
                        <span><span className="font-medium text-stone-600">Feed:</span> {feed?.name || 'Unknown'}</span>
                        <span><span className="font-medium text-stone-600">Created:</span> {new Date(campaign.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-4">
                      {campaign.status === 'draft' && (
                        <Button size="sm" onClick={() => handleLaunchCampaign(campaign.id)} className="bg-teal-700 hover:bg-teal-800 text-white">
                          <Play className="mr-1 h-3.5 w-3.5" />Launch
                        </Button>
                      )}
                      {campaign.status === 'active' && (
                        <Button variant="outline" size="sm" onClick={() => handlePauseCampaign(campaign.id)} className="border-stone-300 text-stone-600 hover:bg-stone-100">
                          <Pause className="mr-1 h-3.5 w-3.5" />Pause
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCampaign(campaign.id)} className="text-red-400 hover:text-red-600 h-8 w-8 p-0">
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

      {showCreateModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-stone-900">Create New Campaign</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Campaign Name *</label>
                <input type="text" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" placeholder="Enter campaign name" value={newCampaign.name} onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Select Feed *</label>
                <select className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" value={newCampaign.feedId} onChange={(e) => setNewCampaign({...newCampaign, feedId: e.target.value})}>
                  <option value="">Choose a feed...</option>
                  {feeds.map(feed => <option key={feed.id} value={feed.id}>{feed.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Channel</label>
                <select className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" value={newCampaign.channel} onChange={(e) => setNewCampaign({...newCampaign, channel: e.target.value})}>
                  <option value="google">Google Ads</option>
                  <option value="microsoft">Microsoft Ads</option>
                  <option value="youtube">YouTube Ads</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Budget *</label>
                  <input type="number" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" placeholder="1000" value={newCampaign.budget} onChange={(e) => setNewCampaign({...newCampaign, budget: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Currency</label>
                  <select className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" value={newCampaign.currency} onChange={(e) => setNewCampaign({...newCampaign, currency: e.target.value})}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Country</label>
                <input type="text" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" placeholder="US" value={newCampaign.country} onChange={(e) => setNewCampaign({...newCampaign, country: e.target.value})} />
              </div>
              <div className="flex space-x-3 pt-2">
                <Button className="flex-1 bg-teal-700 hover:bg-teal-800 text-white" onClick={handleCreateCampaign}>Create Campaign</Button>
                <Button variant="outline" className="border-stone-300" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
