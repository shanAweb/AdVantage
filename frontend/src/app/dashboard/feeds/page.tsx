'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Plus,
  RefreshCw,
  Download,
  ExternalLink,
  Search,
  MoreHorizontal,
  Globe,
  Package,
  Megaphone,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { feedApi } from '@/lib/apiClient'

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
 * Feeds page component
 */
export default function FeedsPage() {
  const router = useRouter()
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [refreshingFeeds, setRefreshingFeeds] = useState<Set<string>>(new Set())

  /**
   * Load feeds on component mount
   */
  useEffect(() => {
    loadFeeds()
  }, [])

  /**
   * Load feeds from API
   */
  const loadFeeds = async () => {
    try {
      setLoading(true)
      const response = await feedApi.getFeeds()
      
      if (response.success && response.data) {
        setFeeds((response.data as any).feeds)
      } else {
        throw new Error(response.error?.message || 'Failed to load feeds')
      }
    } catch (error) {
      console.error('Error loading feeds:', error)
      toast.error('Failed to load feeds')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Refresh a specific feed
   */
  const refreshFeed = async (feedId: string) => {
    try {
      setRefreshingFeeds(prev => new Set(prev).add(feedId))
      
      const response = await feedApi.refreshFeed(feedId)
      
      if (response.success) {
        toast.success('Feed refresh queued successfully')
        // Reload feeds to get updated status
        await loadFeeds()
      } else {
        throw new Error(response.error?.message || 'Failed to refresh feed')
      }
    } catch (error) {
      console.error('Error refreshing feed:', error)
      toast.error('Failed to refresh feed')
    } finally {
      setRefreshingFeeds(prev => {
        const newSet = new Set(prev)
        newSet.delete(feedId)
        return newSet
      })
    }
  }

  /**
   * Download feed in specified format
   */
  const downloadFeed = async (feedId: string, format: string) => {
    try {
      const response = await feedApi.downloadFeed(feedId, format)
      
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
        a.download = `feed_${feedId}.${format}`
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
   * Filter feeds based on search term
   */
  const filteredFeeds = feeds.filter(feed =>
    feed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feed.siteUrl.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Feeds</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl font-bold">Feeds</h1>
          <p className="text-gray-600">Manage your product feeds and crawling</p>
        </div>
        <Button onClick={() => router.push('/dashboard/feeds/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Feed
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search feeds..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Feeds Grid */}
      {filteredFeeds.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No feeds found' : 'No feeds yet'}
            </h3>
            <p className="text-gray-600 text-center mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first feed to start crawling products'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => router.push('/dashboard/feeds/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Feed
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFeeds.map((feed) => (
            <Card key={feed.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{feed.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Globe className="w-3 h-3 mr-1" />
                      <span className="truncate">{feed.siteUrl}</span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => refreshFeed(feed.id)}
                      disabled={refreshingFeeds.has(feed.id)}
                    >
                      <RefreshCw className={`w-4 h-4 ${refreshingFeeds.has(feed.id) ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/dashboard/feeds/${feed.id}`)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    {getStatusBadge(feed.lastCrawlStatus)}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-lg font-semibold text-gray-900">{feed._count.products}</div>
                      <div className="text-xs text-gray-600">Products</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-lg font-semibold text-gray-900">{feed._count.ads}</div>
                      <div className="text-xs text-gray-600">Ads</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="text-lg font-semibold text-gray-900">{feed._count.campaigns}</div>
                      <div className="text-xs text-gray-600">Campaigns</div>
                    </div>
                  </div>

                  {/* Last Crawl */}
                  {feed.lastCrawlAt && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-3 h-3 mr-1" />
                      Last crawl: {new Date(feed.lastCrawlAt).toLocaleDateString()}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/dashboard/feeds/${feed.id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadFeed(feed.id, 'json')}
                    >
                      <Download className="w-3 h-3" />
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