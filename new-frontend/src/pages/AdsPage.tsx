import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Megaphone, Eye, MousePointer, DollarSign, TrendingUp, RefreshCw, Trash2, Edit, Pause, X, Zap } from 'lucide-react'
import { adApi, feedApi } from '@/lib/apiClient'
import toast from 'react-hot-toast'

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

  const [newAd, setNewAd] = useState({
    feedId: '',
    productId: '',
    headline: '',
    description: ''
  })

  const loadData = async () => {
    try {
      setLoading(true)
      try {
        const adsResponse = await adApi.getAds()
        if (adsResponse.success) {
          setAds(adsResponse.data || [])
          updateStats(adsResponse.data || [])
        } else {
          setAds([])
        }
      } catch (adsError) {
        console.error('Error loading ads:', adsError)
        setAds([])
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
      toast.error('Failed to load ads')
      setAds([])
      setFeeds([])
    } finally {
      setLoading(false)
    }
  }

  const updateStats = (adsData: any[]) => {
    const totalImpressions = adsData.reduce((sum, ad) => sum + (ad.impressions || 0), 0)
    const totalClicks = adsData.reduce((sum, ad) => sum + (ad.clicks || 0), 0)
    const totalSpend = adsData.reduce((sum, ad) => sum + (ad.spend || 0), 0)
    const conversions = adsData.reduce((sum, ad) => sum + (ad.conversions || 0), 0)
    setStats({ totalImpressions, totalClicks, totalSpend, conversions })
  }

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

  const handleBulkCreateAds = async (feedId: string) => {
    try {
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

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'paused': return 'bg-amber-50 text-amber-700 border-amber-200'
      default: return 'bg-stone-100 text-stone-600 border-stone-200'
    }
  }

  useEffect(() => { loadData() }, [])

  if (loading && ads.length === 0 && feeds.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone-200 border-t-teal-600 mx-auto mb-4"></div>
          <p className="text-stone-500 text-sm">Loading ads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Ads Management</h1>
          <p className="text-stone-500 text-sm mt-1">Manage and optimize your individual ads</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadData} disabled={loading} className="border-stone-300 text-stone-600 hover:bg-stone-100">
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="bg-teal-700 hover:bg-teal-800 text-white">
            <Plus className="mr-2 h-4 w-4" />Create Ad
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Impressions', value: stats.totalImpressions.toLocaleString(), sub: 'All time', icon: Eye, color: 'bg-teal-50 text-teal-700' },
          { label: 'Total Clicks', value: stats.totalClicks.toLocaleString(), sub: 'All time', icon: MousePointer, color: 'bg-amber-50 text-amber-700' },
          { label: 'Total Spend', value: `$${stats.totalSpend.toLocaleString()}`, sub: 'All time', icon: DollarSign, color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Conversions', value: stats.conversions.toLocaleString(), sub: 'All time', icon: TrendingUp, color: 'bg-stone-100 text-stone-700' },
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Your Ads</CardTitle>
              <CardDescription>Manage and monitor your individual ad performance</CardDescription>
            </div>
            <Badge variant="outline" className="text-sm border-stone-300 text-stone-600">
              <Megaphone className="w-3.5 h-3.5 mr-1" />{ads.length} Total
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {ads.length === 0 ? (
            <div className="text-center py-10">
              <Megaphone className="h-10 w-10 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-medium text-stone-900 mb-1">No ads yet</h3>
              <p className="text-stone-500 text-sm mb-4">Create your first ad to start advertising</p>
              <Button onClick={() => setShowCreateModal(true)} className="bg-teal-700 hover:bg-teal-800 text-white">
                <Plus className="mr-2 h-4 w-4" />Create First Ad
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {ads.map((ad) => {
                const feed = feeds.find(f => f.id === ad.feedId)
                const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0.00'
                return (
                  <div key={ad.id} className="flex items-center justify-between p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors duration-200">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                          <Megaphone className="h-4 w-4 text-teal-700" />
                        </div>
                        <h3 className="font-medium text-stone-900">{ad.headline || 'Untitled Ad'}</h3>
                        <Badge className={getStatusBadge(ad.status)}>{ad.status || 'Unknown'}</Badge>
                      </div>
                      <div className="ml-11">
                        <p className="text-sm text-stone-500 mb-2">Feed: {feed?.name || 'Unknown'}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-stone-500">
                          <div><span className="font-medium text-stone-600">Impressions:</span> {ad.impressions?.toLocaleString() || 0}</div>
                          <div><span className="font-medium text-stone-600">Clicks:</span> {ad.clicks?.toLocaleString() || 0}</div>
                          <div><span className="font-medium text-stone-600">CTR:</span> {ctr}%</div>
                          <div><span className="font-medium text-stone-600">Spend:</span> ${ad.spend?.toFixed(2) || '0.00'}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 ml-4">
                      <Button variant="ghost" size="sm" className="text-stone-400 hover:text-stone-600 h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-stone-400 hover:text-stone-600 h-8 w-8 p-0">
                        <Pause className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAd(ad.id)} className="text-red-400 hover:text-red-600 h-8 w-8 p-0">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-stone-200">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <Zap className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <CardTitle className="text-base">Bulk Create Ads</CardTitle>
                <CardDescription>Create multiple ads from your feeds</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {feeds.map(feed => (
                <Button key={feed.id} variant="outline" className="w-full justify-start border-stone-300 text-stone-600 hover:bg-stone-100" onClick={() => handleBulkCreateAds(feed.id)}>
                  <Megaphone className="mr-2 h-4 w-4 text-teal-700" />Create Ads from {feed.name}
                </Button>
              ))}
              {feeds.length === 0 && (
                <p className="text-sm text-stone-400">No feeds available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-stone-200">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <CardTitle className="text-base">Top Performing Ads</CardTitle>
                <CardDescription>Your best performing ads</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {ads.length > 0 ? (
              <div className="space-y-3">
                {ads
                  .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
                  .slice(0, 3)
                  .map((ad, index) => (
                    <div key={ad.id} className="flex items-center justify-between p-3 border border-stone-200 rounded-lg">
                      <span className="text-sm font-medium text-stone-700">{ad.headline || 'Untitled Ad'}</span>
                      <Badge className={index === 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-stone-100 text-stone-600 border-stone-200'}>
                        {index === 0 ? 'Best CTR' : `${ad.clicks || 0} clicks`}
                      </Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-stone-400">No ads to display</p>
            )}
          </CardContent>
        </Card>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-stone-900">Create New Ad</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Select Feed *</label>
                <select className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" value={newAd.feedId} onChange={(e) => setNewAd({...newAd, feedId: e.target.value})}>
                  <option value="">Choose a feed...</option>
                  {feeds.map(feed => <option key={feed.id} value={feed.id}>{feed.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Product ID *</label>
                <input type="text" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" placeholder="Enter product ID" value={newAd.productId} onChange={(e) => setNewAd({...newAd, productId: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Headline</label>
                <input type="text" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" placeholder="Enter ad headline" value={newAd.headline} onChange={(e) => setNewAd({...newAd, headline: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
                <textarea className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm" placeholder="Enter ad description" rows={3} value={newAd.description} onChange={(e) => setNewAd({...newAd, description: e.target.value})} />
              </div>
              <div className="flex space-x-3 pt-2">
                <Button className="flex-1 bg-teal-700 hover:bg-teal-800 text-white" onClick={handleCreateAd}>Create Ad</Button>
                <Button variant="outline" className="border-stone-300" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
