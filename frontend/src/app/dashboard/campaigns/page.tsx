'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Play,
  Pause,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  MousePointer,
  Target,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Campaigns page component
 * Displays list of campaigns with management options
 */
export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)
  const [showCampaignDetails, setShowCampaignDetails] = useState<number | null>(null)
  const [showEditCampaign, setShowEditCampaign] = useState<number | null>(null)

  /**
   * Handle button clicks with dummy functionality
   */
  const handleCreateCampaign = () => {
    setShowCreateCampaign(true)
    toast.success('Opening campaign creation wizard...')
  }

  const handleViewCampaignDetails = (campaignId: number) => {
    setShowCampaignDetails(campaignId)
    toast.success('Loading campaign details...')
  }

  const handleEditCampaign = (campaignId: number) => {
    setShowEditCampaign(campaignId)
    toast.success('Opening campaign editor...')
  }

  const handlePauseResumeCampaign = (campaignId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active'
    toast.success(`Campaign ${newStatus.toLowerCase()} successfully!`)
  }

  const handleLaunchCampaign = (campaignId: number) => {
    toast.success('Campaign launched successfully!')
  }

  const handleDeleteCampaign = (campaignId: number) => {
    toast.success('Campaign deleted successfully!')
  }

  /**
   * Mock campaign data
   * In a real app, this would come from API calls
   */
  const campaigns = [
    {
      id: 1,
      name: 'Summer Sale Campaign',
      platform: 'Google Ads',
      status: 'Active',
      budget: 5000,
      spend: 3240,
      impressions: 245000,
      clicks: 7840,
      ctr: 3.2,
      conversions: 156,
      roas: 4.2,
      startDate: '2024-08-01',
      endDate: '2024-09-30',
    },
    {
      id: 2,
      name: 'B2B Lead Generation',
      platform: 'Microsoft Ads',
      status: 'Active',
      budget: 3000,
      spend: 1890,
      impressions: 180000,
      clicks: 4320,
      ctr: 2.4,
      conversions: 89,
      roas: 3.8,
      startDate: '2024-08-15',
      endDate: '2024-10-15',
    },
    {
      id: 3,
      name: 'YouTube Brand Awareness',
      platform: 'YouTube',
      status: 'Paused',
      budget: 2000,
      spend: 1200,
      impressions: 320000,
      clicks: 8960,
      ctr: 2.8,
      conversions: 45,
      roas: 2.1,
      startDate: '2024-07-01',
      endDate: '2024-08-31',
    },
    {
      id: 4,
      name: 'Holiday Shopping',
      platform: 'Google Ads',
      status: 'Draft',
      budget: 8000,
      spend: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      roas: 0,
      startDate: '2024-11-01',
      endDate: '2024-12-31',
    },
  ]

  /**
   * Filter campaigns based on search and status
   */
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.platform.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || campaign.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  /**
   * Get status badge variant
   */
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default'
      case 'paused':
        return 'secondary'
      case 'draft':
        return 'outline'
      default:
        return 'outline'
    }
  }

  /**
   * Format currency
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  /**
   * Format number with commas
   */
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your advertising campaigns across all platforms
          </p>
        </div>
        <Button className="flex items-center space-x-2" onClick={handleCreateCampaign}>
          <Plus className="h-4 w-4" />
          <span>Create Campaign</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">
              {campaigns.filter(c => c.status === 'Active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(campaigns.reduce((sum, c) => sum + c.spend, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              of {formatCurrency(campaigns.reduce((sum, c) => sum + c.budget, 0))} budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(campaigns.reduce((sum, c) => sum + c.impressions, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. ROAS</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.roas > 0).length > 0
                ? (campaigns.filter(c => c.roas > 0).reduce((sum, c) => sum + c.roas, 0) / 
                   campaigns.filter(c => c.roas > 0).length).toFixed(1)
                : '0.0'
              }x
            </div>
            <p className="text-xs text-muted-foreground">
              return on ad spend
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Status: {filterStatus === 'all' ? 'All' : filterStatus}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  All Campaigns
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('paused')}>
                  Paused
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('draft')}>
                  Draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {campaign.name}
                    </h3>
                    <Badge variant={getStatusVariant(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {campaign.platform}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Budget:</span>
                      <div className="font-medium">{formatCurrency(campaign.budget)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Spend:</span>
                      <div className="font-medium">{formatCurrency(campaign.spend)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Impressions:</span>
                      <div className="font-medium">{formatNumber(campaign.impressions)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">CTR:</span>
                      <div className="font-medium">{campaign.ctr}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Clicks:</span>
                      <div className="font-medium">{formatNumber(campaign.clicks)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Conversions:</span>
                      <div className="font-medium">{campaign.conversions}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">ROAS:</span>
                      <div className="font-medium">{campaign.roas}x</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Period:</span>
                      <div className="font-medium">{campaign.startDate} - {campaign.endDate}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {campaign.status === 'Active' ? (
                    <Button variant="outline" size="sm" onClick={() => handlePauseResumeCampaign(campaign.id, campaign.status)}>
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  ) : campaign.status === 'Paused' ? (
                    <Button variant="outline" size="sm" onClick={() => handlePauseResumeCampaign(campaign.id, campaign.status)}>
                      <Play className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleLaunchCampaign(campaign.id)}>
                      <Play className="h-4 w-4 mr-1" />
                      Launch
                    </Button>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditCampaign(campaign.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewCampaignDetails(campaign.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCampaign(campaign.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No campaigns found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating your first campaign.'}
              </p>
              <Button onClick={handleCreateCampaign}>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interactive Modals */}
      
      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create New Campaign</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateCampaign(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target Audience</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>All Users</option>
                    <option>Age 25-34</option>
                    <option>Age 35-44</option>
                    <option>Business Professionals</option>
                  </select>
                </div>
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

      {/* Campaign Details Modal */}
      {showCampaignDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Campaign Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCampaignDetails(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {(() => {
              const campaign = campaigns.find(c => c.id === showCampaignDetails)
              if (!campaign) return null
              return (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-medium">{campaign.name}</h4>
                    <Badge variant={getStatusVariant(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>Impressions:</span>
                          <span className="font-medium">{formatNumber(campaign.impressions)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Clicks:</span>
                          <span className="font-medium">{formatNumber(campaign.clicks)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CTR:</span>
                          <span className="font-medium">{campaign.ctr}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conversions:</span>
                          <span className="font-medium">{campaign.conversions}</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Financial Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>Budget:</span>
                          <span className="font-medium">{formatCurrency(campaign.budget)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spend:</span>
                          <span className="font-medium">{formatCurrency(campaign.spend)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ROAS:</span>
                          <span className="font-medium">{campaign.roas}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remaining:</span>
                          <span className="font-medium">{formatCurrency(campaign.budget - campaign.spend)}</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Campaign Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>Platform:</span>
                          <span className="font-medium">{campaign.platform}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Start Date:</span>
                          <span className="font-medium">{campaign.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>End Date:</span>
                          <span className="font-medium">{campaign.endDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <Badge variant={getStatusVariant(campaign.status)} className="text-xs">
                            {campaign.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h5 className="font-medium mb-3">Recent Performance Insights</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Impressions increased by 12% this week
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Clicks improved by 8% compared to last week
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <span className="flex items-center">
                          <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                          CTR decreased by 0.5% - consider A/B testing
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

      {/* Edit Campaign Modal */}
      {showEditCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Campaign</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowEditCampaign(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {(() => {
              const campaign = campaigns.find(c => c.id === showEditCampaign)
              if (!campaign) return null
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Campaign Name</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md"
                        defaultValue={campaign.name}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Platform</label>
                      <select className="w-full p-2 border rounded-md" defaultValue={campaign.platform}>
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
                        defaultValue={campaign.budget}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select className="w-full p-2 border rounded-md" defaultValue={campaign.status}>
                        <option>Draft</option>
                        <option>Active</option>
                        <option>Paused</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1" onClick={() => {
                      toast.success('Campaign updated successfully!')
                      setShowEditCampaign(null)
                    }}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setShowEditCampaign(null)}>
                      Cancel
                    </Button>
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
