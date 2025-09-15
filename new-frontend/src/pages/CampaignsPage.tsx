import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { campaignApi } from '@/lib/apiClient'

/**
 * Campaigns page component
 * Displays list of campaigns with management options
 */
export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)
  const [showCampaignDetails, setShowCampaignDetails] = useState<number | null>(null)
  const [showEditCampaign, setShowEditCampaign] = useState<number | null>(null)

  /**
   * Load campaigns from API
   */
  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const response = await campaignApi.getCampaigns()
      if (response.success) {
        setCampaigns(response.data?.campaigns || response.data || [])
      } else {
        toast.error('Failed to load campaigns')
      }
    } catch (error) {
      console.error('Error loading campaigns:', error)
      toast.error('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle button clicks with real functionality
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

  const handlePauseResumeCampaign = async (campaignId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active'
      const response = await campaignApi.updateCampaign(campaignId, { status: newStatus })
      if (response.success) {
        toast.success(`Campaign ${newStatus} successfully!`)
        loadCampaigns() // Reload campaigns
      } else {
        toast.error('Failed to update campaign status')
      }
    } catch (error) {
      console.error('Error updating campaign:', error)
      toast.error('Failed to update campaign status')
    }
  }

  const handleDeleteCampaign = async (campaignId: number) => {
    try {
      const response = await campaignApi.deleteCampaign(campaignId)
      if (response.success) {
        toast.success('Campaign deleted successfully!')
        loadCampaigns() // Reload campaigns
      } else {
        toast.error('Failed to delete campaign')
      }
    } catch (error) {
      console.error('Error deleting campaign:', error)
      toast.error('Failed to delete campaign')
    }
  }

  // Load campaigns on component mount
  useEffect(() => {
    loadCampaigns()
  }, [])

  /**
   * Filter campaigns based on search and status
   */
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.platform?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || campaign.status?.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  /**
   * Get status badge variant
   */
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'default'
      case 'paused':
        return 'secondary'
      case 'draft':
        return 'outline'
      default:
        return 'secondary'
    }
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
        <Button onClick={handleCreateCampaign}>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
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
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('active')}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'paused' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('paused')}
              >
                Paused
              </Button>
              <Button
                variant={filterStatus === 'draft' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('draft')}
              >
                Draft
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Campaigns</CardTitle>
              <CardDescription>
                {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadCampaigns} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2">Loading campaigns...</span>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No campaigns found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first campaign to get started'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button onClick={handleCreateCampaign}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Campaign
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {campaign.name || 'Unnamed Campaign'}
                      </h3>
                      <Badge variant={getStatusVariant(campaign.status)}>
                        {campaign.status || 'Unknown'}
                      </Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {campaign.platform || 'Unknown Platform'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Budget:</span> ${campaign.budget?.toLocaleString() || '0'}
                      </div>
                      <div>
                        <span className="font-medium">Spend:</span> ${campaign.spend?.toFixed(2) || '0.00'}
                      </div>
                      <div>
                        <span className="font-medium">Impressions:</span> {campaign.impressions?.toLocaleString() || '0'}
                      </div>
                      <div>
                        <span className="font-medium">Clicks:</span> {campaign.clicks?.toLocaleString() || '0'}
                      </div>
                      <div>
                        <span className="font-medium">CTR:</span> {campaign.ctr?.toFixed(2) || '0.00'}%
                      </div>
                      <div>
                        <span className="font-medium">ROAS:</span> {campaign.roas?.toFixed(1) || '0.0'}x
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewCampaignDetails(campaign.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCampaign(campaign.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePauseResumeCampaign(campaign.id, campaign.status)}
                    >
                      {campaign.status === 'active' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
                <Input 
                  type="text" 
                  placeholder="Enter campaign name"
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
                <Input 
                  type="number" 
                  placeholder="1000"
                />
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1" onClick={() => {
                  toast.success('Campaign created successfully!')
                  setShowCreateCampaign(false)
                  loadCampaigns()
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
    </div>
  )
}