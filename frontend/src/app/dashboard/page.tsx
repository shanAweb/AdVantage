'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Megaphone,
  Eye,
  MousePointer,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  FileText,
  Search,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Dashboard page component
 * Main dashboard with overview cards and statistics
 */
export default function DashboardPage() {
  const { user } = useAuth()
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showAudienceInsights, setShowAudienceInsights] = useState(false)
  const [showCampaignDetails, setShowCampaignDetails] = useState<number | null>(null)

  /**
   * Handle button clicks with dummy functionality
   */
  const handleCreateCampaign = () => {
    setShowCreateCampaign(true)
    toast.success('Opening campaign creation wizard...')
  }

  const handleViewAnalytics = () => {
    setShowAnalytics(true)
    toast.success('Loading analytics dashboard...')
  }

  const handleAudienceInsights = () => {
    setShowAudienceInsights(true)
    toast.success('Analyzing audience data...')
  }

  const handleViewCampaignDetails = (campaignId: number) => {
    setShowCampaignDetails(campaignId)
    toast.success('Loading campaign details...')
  }

  const handleViewAllCampaigns = () => {
    toast.success('Redirecting to campaigns page...')
    // In a real app, this would navigate to /dashboard/campaigns
  }

  /**
   * Mock data for dashboard cards
   * In a real app, this would come from API calls
   */
  const stats = [
    {
      title: 'Total Campaigns',
      value: '12',
      change: '+2',
      changeType: 'positive' as const,
      icon: Megaphone,
      description: 'Active campaigns',
    },
    {
      title: 'Total Spend',
      value: '$24,567',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'This month',
    },
    {
      title: 'Impressions',
      value: '2.4M',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: Eye,
      description: 'Total impressions',
    },
    {
      title: 'Click Rate',
      value: '3.2%',
      change: '-0.5%',
      changeType: 'negative' as const,
      icon: MousePointer,
      description: 'Average CTR',
    },
    {
      title: 'Conversions',
      value: '1,234',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Target,
      description: 'Total conversions',
    },
    {
      title: 'ROAS',
      value: '4.2x',
      change: '+0.8x',
      changeType: 'positive' as const,
      icon: TrendingUp,
      description: 'Return on ad spend',
    },
  ]

  const recentCampaigns = [
    {
      id: 1,
      name: 'Summer Sale Campaign',
      platform: 'Google Ads',
      status: 'Active',
      budget: '$5,000',
      spend: '$3,240',
      impressions: '245K',
      clicks: '7,840',
      ctr: '3.2%',
    },
    {
      id: 2,
      name: 'B2B Lead Generation',
      platform: 'Microsoft Ads',
      status: 'Active',
      budget: '$3,000',
      spend: '$1,890',
      impressions: '180K',
      clicks: '4,320',
      ctr: '2.4%',
    },
    {
      id: 3,
      name: 'YouTube Brand Awareness',
      platform: 'YouTube',
      status: 'Paused',
      budget: '$2,000',
      spend: '$1,200',
      impressions: '320K',
      clicks: '8,960',
      ctr: '2.8%',
    },
  ]

  return (
    <div className="space-y-4">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3 text-white">
        <h1 className="text-xl font-bold mb-1">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-blue-100 text-sm">
          Here's what's happening with your campaigns today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm ${
                      stat.changeType === 'positive'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>
                Overview of your latest advertising campaigns
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleViewAllCampaigns}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {campaign.name}
                    </h3>
                    <Badge
                      variant={campaign.status === 'Active' ? 'default' : 'secondary'}
                    >
                      {campaign.status}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {campaign.platform}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Budget:</span> {campaign.budget}
                    </div>
                    <div>
                      <span className="font-medium">Spend:</span> {campaign.spend}
                    </div>
                    <div>
                      <span className="font-medium">Impressions:</span> {campaign.impressions}
                    </div>
                    <div>
                      <span className="font-medium">CTR:</span> {campaign.ctr}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleViewCampaignDetails(campaign.id)}>
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Megaphone className="mr-2 h-5 w-5" />
              Create Campaign
            </CardTitle>
            <CardDescription>
              Launch a new advertising campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleCreateCampaign}>
              <Plus className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              View Analytics
            </CardTitle>
            <CardDescription>
              Analyze campaign performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={handleViewAnalytics}>
              <FileText className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Audience Insights
            </CardTitle>
            <CardDescription>
              Discover your target audience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={handleAudienceInsights}>
              <Search className="mr-2 h-4 w-4" />
              Explore
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Modals and Data Displays */}
      
      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Campaign</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateCampaign(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Campaign Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter campaign name"
                  defaultValue="My New Campaign"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Platform</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Google Ads</option>
                  <option>Microsoft Ads</option>
                  <option>Facebook Ads</option>
                  <option>YouTube Ads</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Budget</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-md"
                  placeholder="1000"
                />
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1" onClick={() => {
                  toast.success('Campaign created successfully!')
                  setShowCreateCampaign(false)
                }}>
                  Create Campaign
                </Button>
                <Button variant="outline" onClick={() => setShowCreateCampaign(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Campaign Analytics</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAnalytics(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">2.4M</div>
                  <div className="text-sm text-gray-600">Total Impressions</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">8,960</div>
                  <div className="text-sm text-gray-600">Total Clicks</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">3.2%</div>
                  <div className="text-sm text-gray-600">Click Rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">$24,567</div>
                  <div className="text-sm text-gray-600">Total Spend</div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Performance by Platform</h4>
              <div className="space-y-2">
                {['Google Ads', 'Microsoft Ads', 'YouTube Ads'].map((platform, index) => (
                  <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium">{platform}</span>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>Impressions: {(Math.random() * 1000000).toFixed(0)}</span>
                      <span>Clicks: {(Math.random() * 10000).toFixed(0)}</span>
                      <span>CTR: {(Math.random() * 5).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audience Insights Modal */}
      {showAudienceInsights && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Audience Insights</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAudienceInsights(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Age 25-34</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Age 35-44</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Age 45-54</span>
                      <span className="font-medium">22%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Age 55+</span>
                      <span className="font-medium">15%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Technology</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Business</span>
                      <span className="font-medium">38%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marketing</span>
                      <span className="font-medium">31%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Finance</span>
                      <span className="font-medium">25%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <h4 className="font-medium mb-3">Top Performing Keywords</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {['digital marketing', 'advertising tools', 'campaign management', 'analytics dashboard', 'lead generation', 'conversion optimization'].map((keyword) => (
                  <div key={keyword} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span>{keyword}</span>
                    <Badge variant="secondary">{(Math.random() * 100).toFixed(0)}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Details Modal */}
      {showCampaignDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Campaign Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCampaignDetails(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {(() => {
              const campaign = recentCampaigns.find(c => c.id === showCampaignDetails)
              if (!campaign) return null
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-medium">{campaign.name}</h4>
                    <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Platform</label>
                      <p className="text-lg">{campaign.platform}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Budget</label>
                      <p className="text-lg">{campaign.budget}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Spend</label>
                      <p className="text-lg">{campaign.spend}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">CTR</label>
                      <p className="text-lg">{campaign.ctr}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h5 className="font-medium mb-2">Recent Performance</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Impressions increased by 12%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Clicks improved by 8%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                          CTR decreased by 0.5%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
