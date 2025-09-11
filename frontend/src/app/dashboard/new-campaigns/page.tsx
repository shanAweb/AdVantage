'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Megaphone,
  Calendar,
  DollarSign,
  Globe,
  Filter,
  ExternalLink,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { newCampaignApi, feedApi } from '@/lib/apiClient'

/**
 * Campaign interface
 */
interface Campaign {
  id: string
  name: string
  channel: string
  budget: number
  currency: string
  country: string
  status: string
  createdAt: string
  updatedAt: string
  feed: {
    id: string
    name: string
    siteUrl: string
  }
  ads: Array<{
    ad: {
      id: string
      headline: string
      description: string
      imageUrl?: string
      product: {
        id: string
        title: string
        price?: number
        currency?: string
        imageUrl?: string
      }
    }
  }>
  _count: {
    ads: number
  }
}

/**
 * Feed interface
 */
interface Feed {
  id: string
  name: string
  siteUrl: string
  _count: {
    products: number
    ads: number
  }
}

/**
 * New Campaigns page component
 */
export default function NewCampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [feedFilter, setFeedFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [channelFilter, setChannelFilter] = useState('')

  /**
   * Load campaigns and feeds on component mount
   */
  useEffect(() => {
    loadCampaigns()
    loadFeeds()
  }, [])

  /**
   * Load campaigns from API
   */
  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const response = await newCampaignApi.getCampaigns({
        search: searchTerm || undefined,
        feedId: feedFilter || undefined,
        status: statusFilter || undefined,
        channel: channelFilter || undefined,
      })
      
      if (response.success && response.data) {
        setCampaigns((response.data as any).campaigns)
      } else {
        throw new Error(response.error?.message || 'Failed to load campaigns')
      }
    } catch (error) {
      console.error('Error loading campaigns:', error)
      toast.error('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Load feeds from API
   */
  const loadFeeds = async () => {
    try {
      const response = await feedApi.getFeeds()
      
      if (response.success && response.data) {
        setFeeds((response.data as any).feeds)
      }
    } catch (error) {
      console.error('Error loading feeds:', error)
    }
  }

  /**
   * Delete campaign
   */
  const deleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return

    try {
      const response = await newCampaignApi.deleteCampaign(campaignId)
      
      if (response.success) {
        toast.success('Campaign deleted successfully')
        await loadCampaigns()
      } else {
        throw new Error(response.error?.message || 'Failed to delete campaign')
      }
    } catch (error) {
      console.error('Error deleting campaign:', error)
      toast.error('Failed to delete campaign')
    }
  }

  /**
   * Launch campaign
   */
  const launchCampaign = async (campaignId: string) => {
    try {
      const response = await newCampaignApi.launchCampaign(campaignId)
      
      if (response.success) {
        toast.success('Campaign launched successfully')
        await loadCampaigns()
      } else {
        throw new Error(response.error?.message || 'Failed to launch campaign')
      }
    } catch (error) {
      console.error('Error launching campaign:', error)
      toast.error('Failed to launch campaign')
    }
  }

  /**
   * Pause campaign
   */
  const pauseCampaign = async (campaignId: string) => {
    try {
      const response = await newCampaignApi.pauseCampaign(campaignId)
      
      if (response.success) {
        toast.success('Campaign paused successfully')
        await loadCampaigns()
      } else {
        throw new Error(response.error?.message || 'Failed to pause campaign')
      }
    } catch (error) {
      console.error('Error pausing campaign:', error)
      toast.error('Failed to pause campaign')
    }
  }

  /**
   * Get status badge for campaign status
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>
      case 'draft':
        return <Badge variant="outline">Draft</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Completed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  /**
   * Get channel badge
   */
  const getChannelBadge = (channel: string) => {
    const colors = {
      google: 'bg-blue-100 text-blue-800',
      facebook: 'bg-indigo-100 text-indigo-800',
      linkedin: 'bg-blue-100 text-blue-800',
      microsoft: 'bg-orange-100 text-orange-800',
    }
    
    return (
      <Badge variant="default" className={colors[channel as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {channel.charAt(0).toUpperCase() + channel.slice(1)}
      </Badge>
    )
  }

  /**
   * Filter campaigns based on search term and filters
   */
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.feed.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFeed = !feedFilter || campaign.feed.id === feedFilter
    const matchesStatus = !statusFilter || campaign.status === statusFilter
    const matchesChannel = !channelFilter || campaign.channel === channelFilter
    
    return matchesSearch && matchesFeed && matchesStatus && matchesChannel
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Campaigns</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-gray-600">Manage your advertising campaigns</p>
        </div>
        <Button onClick={() => router.push('/dashboard/new-campaigns/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={feedFilter}
          onChange={(e) => setFeedFilter(e.target.value)}
        >
          <option value="">All Feeds</option>
          {feeds.map(feed => (
            <option key={feed.id} value={feed.id}>{feed.name}</option>
          ))}
        </select>
        <select
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
        <select
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
        >
          <option value="">All Channels</option>
          <option value="google">Google</option>
          <option value="facebook">Facebook</option>
          <option value="linkedin">LinkedIn</option>
          <option value="microsoft">Microsoft</option>
        </select>
      </div>

      {/* Campaigns List */}
      {filteredCampaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Megaphone className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || feedFilter || statusFilter || channelFilter ? 'No campaigns found' : 'No campaigns yet'}
            </h3>
            <p className="text-gray-600 text-center mb-4">
              {searchTerm || feedFilter || statusFilter || channelFilter 
                ? 'Try adjusting your search terms or filters'
                : 'Create your first campaign to start advertising'
              }
            </p>
            {!searchTerm && !feedFilter && !statusFilter && !channelFilter && (
              <Button onClick={() => router.push('/dashboard/new-campaigns/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Campaign
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {campaign.name}
                      </h3>
                      {getStatusBadge(campaign.status)}
                      {getChannelBadge(campaign.channel)}
                    </div>
                    
                    {/* Campaign Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="w-4 h-4 mr-2" />
                        <span>{campaign.country}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span>{campaign.currency} {campaign.budget}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Megaphone className="w-4 h-4 mr-2" />
                        <span>{campaign._count.ads} ads</span>
                      </div>
                    </div>

                    {/* Feed Info */}
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <span>Feed: {campaign.feed.name}</span>
                    </div>

                    {/* Sample Ads */}
                    {campaign.ads.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Sample Ads:</p>
                        <div className="space-y-1">
                          {campaign.ads.slice(0, 2).map((campaignAd) => (
                            <div key={campaignAd.ad.id} className="flex items-center space-x-2 text-sm text-gray-600">
                              <span className="truncate">{campaignAd.ad.headline}</span>
                              {campaignAd.ad.product.price && (
                                <span className="font-medium">
                                  ({campaignAd.ad.product.currency} {campaignAd.ad.product.price})
                                </span>
                              )}
                            </div>
                          ))}
                          {campaign.ads.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{campaign.ads.length - 2} more ads
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Created Date */}
                    <div className="flex items-center text-xs text-gray-500 mt-3">
                      <Calendar className="w-3 h-3 mr-1" />
                      Created {new Date(campaign.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/dashboard/new-campaigns/${campaign.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        toast('Edit functionality coming soon')
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {campaign.status === 'draft' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => launchCampaign(campaign.id)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    {campaign.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => pauseCampaign(campaign.id)}
                      >
                        <Pause className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCampaign(campaign.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

