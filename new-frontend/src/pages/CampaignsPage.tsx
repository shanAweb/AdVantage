import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Search, Play, Pause, Edit, Trash2, Eye, Target, X, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { campaignApi } from '@/lib/apiClient'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)
  const [showCampaignDetails, setShowCampaignDetails] = useState<number | null>(null)
  const [showEditCampaign, setShowEditCampaign] = useState<number | null>(null)

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

  const handlePauseResumeCampaign = async (campaignId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active'
      const response = await campaignApi.updateCampaign(campaignId, { status: newStatus })
      if (response.success) {
        toast.success(`Campaign ${newStatus} successfully!`)
        loadCampaigns()
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
        loadCampaigns()
      } else {
        toast.error('Failed to delete campaign')
      }
    } catch (error) {
      console.error('Error deleting campaign:', error)
      toast.error('Failed to delete campaign')
    }
  }

  useEffect(() => { loadCampaigns() }, [])

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name?.toLowerCase().includes(searchTerm.toLowerCase()) || campaign.platform?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || campaign.status?.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'paused': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'draft': return 'bg-stone-100 text-stone-600 border-stone-200'
      default: return 'bg-stone-100 text-stone-600 border-stone-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Campaigns</h1>
          <p className="text-stone-500 text-sm">Manage your advertising campaigns across all platforms</p>
        </div>
        <Button onClick={() => setShowCreateCampaign(true)} className="bg-teal-700 hover:bg-teal-800 text-white">
          <Plus className="mr-2 h-4 w-4" />Create Campaign
        </Button>
      </div>

      <Card className="border-stone-200">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input placeholder="Search campaigns..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-stone-300 focus:ring-teal-500" />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'paused', 'draft'].map((status) => (
                <Button key={status} variant={filterStatus === status ? 'default' : 'outline'} size="sm" onClick={() => setFilterStatus(status)}
                  className={filterStatus === status ? 'bg-teal-700 hover:bg-teal-800 text-white' : 'border-stone-300 text-stone-600 hover:bg-stone-100'}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-stone-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">All Campaigns</CardTitle>
              <CardDescription>{filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} found</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadCampaigns} disabled={loading} className="border-stone-300 text-stone-600 hover:bg-stone-100">
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-5 w-5 animate-spin text-teal-600" />
              <span className="ml-2 text-stone-500 text-sm">Loading campaigns...</span>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-10">
              <Target className="h-10 w-10 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-medium text-stone-900 mb-1">No campaigns found</h3>
              <p className="text-stone-500 text-sm mb-4">
                {searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filter criteria' : 'Create your first campaign to get started'}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button onClick={() => setShowCreateCampaign(true)} className="bg-teal-700 hover:bg-teal-800 text-white">
                  <Plus className="mr-2 h-4 w-4" />Create First Campaign
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors duration-200">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-stone-900">{campaign.name || 'Unnamed Campaign'}</h3>
                      <Badge className={getStatusBadge(campaign.status)}>{campaign.status || 'Unknown'}</Badge>
                      <span className="text-sm text-stone-400">{campaign.platform || 'Unknown Platform'}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-sm text-stone-500">
                      <div><span className="font-medium text-stone-600">Budget:</span> ${campaign.budget?.toLocaleString() || '0'}</div>
                      <div><span className="font-medium text-stone-600">Spend:</span> ${campaign.spend?.toFixed(2) || '0.00'}</div>
                      <div><span className="font-medium text-stone-600">Impressions:</span> {campaign.impressions?.toLocaleString() || '0'}</div>
                      <div><span className="font-medium text-stone-600">Clicks:</span> {campaign.clicks?.toLocaleString() || '0'}</div>
                      <div><span className="font-medium text-stone-600">CTR:</span> {campaign.ctr?.toFixed(2) || '0.00'}%</div>
                      <div><span className="font-medium text-stone-600">ROAS:</span> {campaign.roas?.toFixed(1) || '0.0'}x</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => setShowCampaignDetails(campaign.id)} className="text-stone-400 hover:text-stone-600 h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowEditCampaign(campaign.id)} className="text-stone-400 hover:text-stone-600 h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handlePauseResumeCampaign(campaign.id, campaign.status)} className="text-stone-400 hover:text-stone-600 h-8 w-8 p-0">
                      {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCampaign(campaign.id)} className="text-red-400 hover:text-red-600 h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showCreateCampaign && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-stone-900">Create New Campaign</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateCampaign(false)} className="text-stone-400 hover:text-stone-600"><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Campaign Name</label>
                <Input type="text" placeholder="Enter campaign name" className="border-stone-300 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Platform</label>
                <select className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm">
                  <option>Google Ads</option><option>Microsoft Ads</option><option>Facebook Ads</option><option>YouTube Ads</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Budget</label>
                <Input type="number" placeholder="1000" className="border-stone-300 focus:ring-teal-500" />
              </div>
              <div className="flex space-x-3 pt-2">
                <Button className="flex-1 bg-teal-700 hover:bg-teal-800 text-white" onClick={() => { toast.success('Campaign created successfully!'); setShowCreateCampaign(false); loadCampaigns() }}>
                  Create Campaign
                </Button>
                <Button variant="outline" className="border-stone-300" onClick={() => setShowCreateCampaign(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
