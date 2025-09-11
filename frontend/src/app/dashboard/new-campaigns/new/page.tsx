'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Megaphone,
  Globe,
  DollarSign,
  Users,
  CheckCircle,
  AlertCircle,
  Package,
  ExternalLink,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { newCampaignApi, feedApi, adApi } from '@/lib/apiClient'

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
 * Ad interface
 */
interface Ad {
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

/**
 * New campaign page component
 */
export default function NewCampaignPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [selectedFeedId, setSelectedFeedId] = useState('')
  const [selectedAdIds, setSelectedAdIds] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    channel: 'google',
    budget: '',
    currency: 'USD',
    country: '',
  })

  /**
   * Load feeds on component mount
   */
  useEffect(() => {
    loadFeeds()
  }, [])

  /**
   * Load ads when feed is selected
   */
  useEffect(() => {
    if (selectedFeedId) {
      loadAds()
    } else {
      setAds([])
      setSelectedAdIds([])
    }
  }, [selectedFeedId])

  /**
   * Load feeds from API
   */
  const loadFeeds = async () => {
    try {
      const response = await feedApi.getFeeds()
      
      if (response.success && response.data) {
        setFeeds((response.data as any).feeds)
      } else {
        throw new Error(response.error?.message || 'Failed to load feeds')
      }
    } catch (error) {
      console.error('Error loading feeds:', error)
      toast.error('Failed to load feeds')
    }
  }

  /**
   * Load ads for selected feed
   */
  const loadAds = async () => {
    try {
      const response = await adApi.getAds({ feedId: selectedFeedId })
      
      if (response.success && response.data) {
        setAds((response.data as any).ads)
      } else {
        throw new Error(response.error?.message || 'Failed to load ads')
      }
    } catch (error) {
      console.error('Error loading ads:', error)
      toast.error('Failed to load ads')
    }
  }

  /**
   * Handle form input changes
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * Handle ad selection
   */
  const handleAdSelection = (adId: string) => {
    setSelectedAdIds(prev => 
      prev.includes(adId) 
        ? prev.filter(id => id !== adId)
        : [...prev, adId]
    )
  }

  /**
   * Select all ads
   */
  const selectAllAds = () => {
    setSelectedAdIds(ads.map(ad => ad.id))
  }

  /**
   * Deselect all ads
   */
  const deselectAllAds = () => {
    setSelectedAdIds([])
  }

  /**
   * Validate form data
   */
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Campaign name is required')
      return false
    }
    
    if (!selectedFeedId) {
      toast.error('Please select a feed')
      return false
    }
    
    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      toast.error('Please enter a valid budget')
      return false
    }
    
    if (!formData.country.trim()) {
      toast.error('Country is required')
      return false
    }
    
    if (selectedAdIds.length === 0) {
      toast.error('Please select at least one ad')
      return false
    }

    return true
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      
      const payload = {
        feedId: selectedFeedId,
        name: formData.name.trim(),
        channel: formData.channel,
        budget: parseFloat(formData.budget),
        currency: formData.currency,
        country: formData.country.trim(),
        adIds: selectedAdIds,
      }

      const response = await newCampaignApi.createCampaign(payload)
      
      if (response.success && response.data) {
        toast.success('Campaign created successfully!')
        router.push(`/dashboard/new-campaigns/${(response.data as any).campaign.id}`)
      } else {
        throw new Error(response.error?.message || 'Failed to create campaign')
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
      toast.error('Failed to create campaign')
    } finally {
      setLoading(false)
    }
  }

  const selectedFeed = feeds.find(feed => feed.id === selectedFeedId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Campaign</h1>
          <p className="text-gray-600">Set up a new advertising campaign</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Megaphone className="w-5 h-5 mr-2" />
                Campaign Configuration
              </CardTitle>
              <CardDescription>
                Configure your advertising campaign settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campaign Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="My Advertising Campaign"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                {/* Feed Selection */}
                <div className="space-y-2">
                  <Label>Select Feed *</Label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedFeedId}
                    onChange={(e) => setSelectedFeedId(e.target.value)}
                    required
                  >
                    <option value="">Choose a feed...</option>
                    {feeds.map(feed => (
                      <option key={feed.id} value={feed.id}>
                        {feed.name} ({feed._count.ads} ads)
                      </option>
                    ))}
                  </select>
                  {selectedFeed && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      {selectedFeed.siteUrl}
                    </div>
                  )}
                </div>

                {/* Channel */}
                <div className="space-y-2">
                  <Label>Advertising Channel *</Label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.channel}
                    onChange={(e) => handleInputChange('channel', e.target.value)}
                    required
                  >
                    <option value="google">Google Ads</option>
                    <option value="facebook">Facebook Ads</option>
                    <option value="linkedin">LinkedIn Ads</option>
                    <option value="microsoft">Microsoft Ads</option>
                  </select>
                </div>

                {/* Budget and Currency */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget *</Label>
                    <Input
                      id="budget"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="1000"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                    </select>
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">Target Country *</Label>
                  <Input
                    id="country"
                    type="text"
                    placeholder="United States"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    required
                  />
                </div>

                {/* Ad Selection */}
                {selectedFeedId && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Select Ads *</Label>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={selectAllAds}
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={deselectAllAds}
                        >
                          Deselect All
                        </Button>
                      </div>
                    </div>
                    
                    {ads.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-8 h-8 mx-auto mb-2" />
                        <p>No ads available for this feed</p>
                        <p className="text-sm">Create ads from your feed products first</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                        {ads.map((ad) => (
                          <div
                            key={ad.id}
                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedAdIds.includes(ad.id)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleAdSelection(ad.id)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedAdIds.includes(ad.id)}
                              onChange={() => handleAdSelection(ad.id)}
                              className="rounded"
                            />
                            {ad.imageUrl && (
                              <img
                                src={ad.imageUrl}
                                alt={ad.headline}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{ad.headline}</p>
                              <p className="text-xs text-gray-600 truncate">{ad.description}</p>
                              <p className="text-xs text-gray-500">
                                {ad.product.title}
                                {ad.product.price && ` • ${ad.product.currency} ${ad.product.price}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600">
                      Selected {selectedAdIds.length} of {ads.length} ads
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading || !selectedFeedId || selectedAdIds.length === 0}
                    className="flex-1"
                  >
                    {loading ? 'Creating Campaign...' : 'Create Campaign'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          {/* Campaign Summary */}
          {selectedFeedId && (
            <Card>
              <CardHeader>
                <CardTitle>Campaign Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Feed:</span>
                  <span className="text-sm font-medium">{selectedFeed?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Channel:</span>
                  <Badge variant="default">
                    {formData.channel.charAt(0).toUpperCase() + formData.channel.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Budget:</span>
                  <span className="text-sm font-medium">
                    {formData.currency} {formData.budget || '0'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Country:</span>
                  <span className="text-sm font-medium">{formData.country || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ads:</span>
                  <span className="text-sm font-medium">
                    {selectedAdIds.length} selected
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Choose ads that best represent your products</li>
                <li>• Set a realistic budget for your campaign</li>
                <li>• Select the right target country for your audience</li>
                <li>• Review your campaign before launching</li>
              </ul>
            </CardContent>
          </Card>

          {/* Channel Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Supported Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Google Ads - Search & Display
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Facebook Ads - Social Media
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  LinkedIn Ads - B2B Marketing
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Microsoft Ads - Search Network
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

