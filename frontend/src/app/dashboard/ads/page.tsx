'use client'

import { useState, useEffect } from 'react'
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
  Megaphone,
  Package,
  ExternalLink,
  Calendar,
  Filter,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { adApi } from '@/lib/apiClient'

/**
 * Ad interface
 */
interface Ad {
  id: string
  headline: string
  description: string
  finalUrl: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
  product: {
    id: string
    title: string
    price?: number
    currency?: string
    imageUrl?: string
  }
  feed: {
    id: string
    name: string
  }
  campaigns: Array<{
    campaign: {
      id: string
      name: string
      status: string
      channel: string
    }
  }>
  _count: {
    campaigns: number
  }
}

/**
 * Ads page component
 */
export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [feedFilter, setFeedFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  /**
   * Load ads on component mount
   */
  useEffect(() => {
    loadAds()
  }, [])

  /**
   * Load ads from API
   */
  const loadAds = async () => {
    try {
      setLoading(true)
      const response = await adApi.getAds({
        search: searchTerm || undefined,
        feedId: feedFilter || undefined,
      })
      
      if (response.success && response.data) {
        setAds((response.data as any).ads || [])
      } else {
        throw new Error(response.error?.message || 'Failed to load ads')
      }
    } catch (error) {
      console.error('Error loading ads:', error)
      toast.error('Failed to load ads')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Delete ad
   */
  const deleteAd = async (adId: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return

    try {
      const response = await adApi.deleteAd(adId)
      
      if (response.success) {
        toast.success('Ad deleted successfully')
        await loadAds()
      } else {
        throw new Error(response.error?.message || 'Failed to delete ad')
      }
    } catch (error) {
      console.error('Error deleting ad:', error)
      toast.error('Failed to delete ad')
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
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  /**
   * Filter ads based on search term and filters
   */
  const filteredAds = ads.filter(ad => {
    const matchesSearch = 
      ad.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.product.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFeed = !feedFilter || ad.feed.id === feedFilter
    const matchesStatus = !statusFilter || ad.campaigns.some(c => c.campaign.status === statusFilter)
    
    return matchesSearch && matchesFeed && matchesStatus
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Ads</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
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
          <h1 className="text-2xl font-bold">Ads</h1>
          <p className="text-gray-600">Manage your advertising creatives</p>
        </div>
        <Button onClick={() => window.location.href = '/dashboard/feeds'}>
          <Plus className="w-4 h-4 mr-2" />
          Create from Feed
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search ads..."
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
          {/* Add feed options here */}
        </select>
        <select
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Ads List */}
      {filteredAds.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Megaphone className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || feedFilter || statusFilter ? 'No ads found' : 'No ads yet'}
            </h3>
            <p className="text-gray-600 text-center mb-4">
              {searchTerm || feedFilter || statusFilter 
                ? 'Try adjusting your search terms or filters'
                : 'Create ads from your product feeds to get started'
              }
            </p>
            {!searchTerm && !feedFilter && !statusFilter && (
              <Button onClick={() => window.location.href = '/dashboard/feeds'}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Ad
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAds.map((ad) => (
            <Card key={ad.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Ad Image */}
                  <div className="flex-shrink-0">
                    {ad.imageUrl ? (
                      <img
                        src={ad.imageUrl}
                        alt={ad.headline}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Ad Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {ad.headline}
                        </h3>
                        <p className="text-gray-600 mb-2 line-clamp-2">
                          {ad.description}
                        </p>
                        
                        {/* Product Info */}
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <Package className="w-3 h-3 mr-1" />
                            {ad.product.title}
                          </span>
                          {ad.product.price && (
                            <span className="font-medium">
                              {ad.product.currency} {ad.product.price}
                            </span>
                          )}
                          <span className="flex items-center">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {ad.feed.name}
                          </span>
                        </div>

                        {/* Campaign Status */}
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Campaigns:</span>
                          {ad.campaigns.length > 0 ? (
                            <div className="flex items-center space-x-2">
                              {ad.campaigns.map((campaignAd, index) => (
                                <div key={index} className="flex items-center space-x-1">
                                  {getStatusBadge(campaignAd.campaign.status)}
                                  <span className="text-xs text-gray-500">
                                    {campaignAd.campaign.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <Badge variant="outline">No Campaigns</Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(ad.finalUrl, '_blank')}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAd(ad.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center text-xs text-gray-500 mt-3">
                      <Calendar className="w-3 h-3 mr-1" />
                      Created {new Date(ad.createdAt).toLocaleDateString()}
                    </div>
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

