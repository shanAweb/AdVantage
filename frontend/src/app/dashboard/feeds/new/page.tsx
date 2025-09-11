'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ArrowLeft,
  Globe,
  Settings,
  Info,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { feedApi } from '@/lib/apiClient'

/**
 * New feed page component
 */
export default function NewFeedPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    siteUrl: '',
    country: '',
    currency: 'USD',
    selectorConfig: '',
  })

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
   * Validate form data
   */
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Feed name is required')
      return false
    }
    
    if (!formData.siteUrl.trim()) {
      toast.error('Site URL is required')
      return false
    }

    try {
      new URL(formData.siteUrl)
    } catch {
      toast.error('Please enter a valid URL')
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
        name: formData.name.trim(),
        siteUrl: formData.siteUrl.trim(),
        country: formData.country.trim() || undefined,
        currency: formData.currency,
        selectorConfig: formData.selectorConfig.trim() ? JSON.parse(formData.selectorConfig) : undefined,
      }

      const response = await feedApi.createFeed(payload)
      
      if (response.success && response.data) {
        toast.success('Feed created successfully!')
        router.push(`/dashboard/feeds/${(response.data as any).feed.id}`)
      } else {
        throw new Error(response.error?.message || 'Failed to create feed')
      }
    } catch (error) {
      console.error('Error creating feed:', error)
      toast.error('Failed to create feed')
    } finally {
      setLoading(false)
    }
  }

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
          <h1 className="text-2xl font-bold">Create New Feed</h1>
          <p className="text-gray-600">Set up a new product feed for crawling</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Feed Configuration
              </CardTitle>
              <CardDescription>
                Configure your product feed settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Feed Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Feed Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="My Product Feed"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-600">
                    A descriptive name for your feed
                  </p>
                </div>

                {/* Site URL */}
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Website URL *</Label>
                  <Input
                    id="siteUrl"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.siteUrl}
                    onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                    required
                  />
                  <p className="text-sm text-gray-600">
                    The website URL to crawl for products
                  </p>
                </div>

                {/* Country */}
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    type="text"
                    placeholder="United States"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                  />
                  <p className="text-sm text-gray-600">
                    Target country for your products (optional)
                  </p>
                </div>

                {/* Currency */}
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
                    <option value="JPY">JPY - Japanese Yen</option>
                  </select>
                  <p className="text-sm text-gray-600">
                    Currency for product prices
                  </p>
                </div>

                {/* Advanced Selectors */}
                <div className="space-y-2">
                  <Label htmlFor="selectorConfig">Advanced Selectors (JSON)</Label>
                  <textarea
                    id="selectorConfig"
                    className="w-full p-2 border border-gray-300 rounded-md h-32 font-mono text-sm"
                    placeholder='{"productContainer": ".product", "title": "h2", "price": ".price", "image": "img", "link": "a"}'
                    value={formData.selectorConfig}
                    onChange={(e) => handleInputChange('selectorConfig', e.target.value)}
                  />
                  <p className="text-sm text-gray-600">
                    Custom CSS selectors for product extraction (optional)
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Creating Feed...' : 'Create Feed'}
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
          {/* How it works */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <p className="font-medium">Crawl Website</p>
                  <p className="text-sm text-gray-600">We'll scan your website for products</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <p className="font-medium">Extract Products</p>
                  <p className="text-sm text-gray-600">Products are automatically extracted and normalized</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
                <div>
                  <p className="font-medium">Create Ads</p>
                  <p className="text-sm text-gray-600">Generate ads from your products</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supported Sites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Supported Sites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  E-commerce platforms (Shopify, WooCommerce, etc.)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Sites with JSON-LD structured data
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Custom sites with CSS selectors
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Product listing pages
                </li>
              </ul>
            </CardContent>
          </Card>

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
                <li>• Use a product listing page URL for best results</li>
                <li>• Ensure your site is publicly accessible</li>
                <li>• Test with a small site first</li>
                <li>• Use custom selectors for complex layouts</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

