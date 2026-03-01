import { useState, useEffect } from 'react'
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
  Plus,
  FileText,
  Search,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { analyticsApi, campaignApi } from '@/lib/apiClient'

export default function DashboardPage() {
  const { user } = useAuth()
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showAudienceInsights, setShowAudienceInsights] = useState(false)
  const [showCampaignDetails, setShowCampaignDetails] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalSpend: 0,
    impressions: 0,
    clickRate: 0,
    conversions: 0,
    roas: 0
  })
  const [recentCampaigns, setRecentCampaigns] = useState<any[]>([])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      if (!user) return

      const analyticsResponse = await analyticsApi.getDashboardStats()
      if (analyticsResponse.success) {
        const data = analyticsResponse.data?.stats || analyticsResponse.data
        setStats({
          totalCampaigns: data.totalCampaigns || 0,
          totalSpend: data.totalSpend || 0,
          impressions: data.totalImpressions || 0,
          clickRate: data.avgCtr || 0,
          conversions: data.totalConversions || 0,
          roas: data.avgRoas || 0
        })
      }

      const campaignsResponse = await campaignApi.getCampaigns({ limit: 3 })
      if (campaignsResponse.success) {
        setRecentCampaigns(campaignsResponse.data?.campaigns || campaignsResponse.data || [])
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
      setStats({ totalCampaigns: 0, totalSpend: 0, impressions: 0, clickRate: 0, conversions: 0, roas: 0 })
      setRecentCampaigns([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCampaign = () => {
    setShowCreateCampaign(true)
  }

  const handleViewAnalytics = () => {
    setShowAnalytics(true)
  }

  const handleAudienceInsights = () => {
    setShowAudienceInsights(true)
  }

  const handleViewCampaignDetails = (campaignId: number) => {
    setShowCampaignDetails(campaignId)
  }

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const statCards = [
    { label: 'Total Campaigns', value: stats.totalCampaigns, icon: Megaphone, sub: 'Active campaigns', color: 'bg-teal-50 text-teal-700' },
    { label: 'Total Spend', value: `$${stats.totalSpend.toLocaleString()}`, icon: DollarSign, sub: 'This month', color: 'bg-amber-50 text-amber-700' },
    { label: 'Impressions', value: `${(stats.impressions / 1000000).toFixed(1)}M`, icon: Eye, sub: 'Total impressions', color: 'bg-emerald-50 text-emerald-700' },
    { label: 'Click Rate', value: `${stats.clickRate.toFixed(1)}%`, icon: MousePointer, sub: 'Average CTR', color: 'bg-stone-100 text-stone-700' },
    { label: 'Conversions', value: stats.conversions.toLocaleString(), icon: Target, sub: 'Total conversions', color: 'bg-teal-50 text-teal-700' },
    { label: 'ROAS', value: `${stats.roas.toFixed(1)}x`, icon: TrendingUp, sub: 'Return on ad spend', color: 'bg-amber-50 text-amber-700' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-800 rounded-xl p-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-600/30 rounded-full blur-2xl" />
        <div className="relative z-10">
          <h1 className="text-xl font-bold mb-1">
            Welcome back, {user?.firstName}
          </h1>
          <p className="text-teal-100 text-sm">
            Here's what's happening with your campaigns today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-stone-200 hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-stone-500">
                {stat.label}
              </CardTitle>
              <div className={`h-8 w-8 rounded-lg ${stat.color.split(' ')[0]} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color.split(' ')[1]}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-900">
                {loading ? <RefreshCw className="h-5 w-5 animate-spin text-stone-400" /> : stat.value}
              </div>
              <p className="text-xs text-stone-400 mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Campaigns */}
      <Card className="border-stone-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Campaigns</CardTitle>
              <CardDescription>
                Overview of your latest advertising campaigns
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-stone-300 text-stone-600 hover:bg-stone-100">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-5 w-5 animate-spin text-teal-600" />
              <span className="ml-2 text-stone-500 text-sm">Loading campaigns...</span>
            </div>
          ) : recentCampaigns.length === 0 ? (
            <div className="text-center py-10">
              <Megaphone className="h-10 w-10 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-medium text-stone-900 mb-1">
                No campaigns yet
              </h3>
              <p className="text-stone-500 text-sm mb-4">
                Create your first campaign to start advertising
              </p>
              <Button onClick={handleCreateCampaign} className="bg-teal-700 hover:bg-teal-800 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create First Campaign
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleViewCampaignDetails(campaign.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-stone-900">{campaign.name}</h3>
                      <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'} className={campaign.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}>
                        {campaign.status}
                      </Badge>
                      <span className="text-sm text-stone-400">{campaign.platform}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-stone-500">
                      <div><span className="font-medium text-stone-600">Budget:</span> ${campaign.budget?.toLocaleString() || '0'}</div>
                      <div><span className="font-medium text-stone-600">Spend:</span> ${campaign.spend?.toFixed(2) || '0.00'}</div>
                      <div><span className="font-medium text-stone-600">Impressions:</span> {campaign.impressions?.toLocaleString() || '0'}</div>
                      <div><span className="font-medium text-stone-600">CTR:</span> {campaign.ctr?.toFixed(2) || '0.00'}%</div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-stone-400 ml-4 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-stone-200 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <div className="h-8 w-8 rounded-lg bg-teal-50 flex items-center justify-center mr-3">
                <Megaphone className="h-4 w-4 text-teal-700" />
              </div>
              Create Campaign
            </CardTitle>
            <CardDescription>Launch a new advertising campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white" onClick={handleCreateCampaign}>
              <Plus className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </CardContent>
        </Card>

        <Card className="border-stone-200 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center mr-3">
                <BarChart3 className="h-4 w-4 text-amber-700" />
              </div>
              View Analytics
            </CardTitle>
            <CardDescription>Analyze campaign performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-stone-300 text-stone-700 hover:bg-stone-100" onClick={handleViewAnalytics}>
              <FileText className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </CardContent>
        </Card>

        <Card className="border-stone-200 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center mr-3">
                <Users className="h-4 w-4 text-emerald-700" />
              </div>
              Audience Insights
            </CardTitle>
            <CardDescription>Discover your target audience</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-stone-300 text-stone-700 hover:bg-stone-100" onClick={handleAudienceInsights}>
              <Search className="mr-2 h-4 w-4" />
              Explore
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-stone-900">Create New Campaign</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateCampaign(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Campaign Name</label>
                <input type="text" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all duration-200" placeholder="Enter campaign name" defaultValue="My New Campaign" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Platform</label>
                <select className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all duration-200">
                  <option>Google Ads</option>
                  <option>Microsoft Ads</option>
                  <option>Facebook Ads</option>
                  <option>YouTube Ads</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Budget</label>
                <input type="number" className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all duration-200" placeholder="1000" />
              </div>
              <div className="flex space-x-3 pt-2">
                <Button className="flex-1 bg-teal-700 hover:bg-teal-800 text-white" onClick={() => {
                  toast.success('Campaign created successfully!')
                  setShowCreateCampaign(false)
                }}>
                  Create Campaign
                </Button>
                <Button variant="outline" className="border-stone-300" onClick={() => setShowCreateCampaign(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-stone-900">Campaign Analytics</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAnalytics(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Impressions', value: '2.4M', color: 'text-teal-700' },
                { label: 'Total Clicks', value: '8,960', color: 'text-emerald-700' },
                { label: 'Click Rate', value: '3.2%', color: 'text-amber-700' },
                { label: 'Total Spend', value: '$24,567', color: 'text-stone-900' },
              ].map((item, i) => (
                <Card key={i} className="border-stone-200">
                  <CardContent className="p-4">
                    <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
                    <div className="text-xs text-stone-500 mt-1">{item.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-stone-900">Performance by Platform</h4>
              <div className="space-y-2">
                {['Google Ads', 'Microsoft Ads', 'YouTube Ads'].map((platform) => (
                  <div key={platform} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                    <span className="font-medium text-stone-700 text-sm">{platform}</span>
                    <div className="flex items-center space-x-4 text-sm text-stone-500">
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
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-stone-900">Audience Insights</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAudienceInsights(false)} className="text-stone-400 hover:text-stone-600">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-stone-200">
                <CardHeader><CardTitle className="text-base">Demographics</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[{ label: 'Age 25-34', pct: '35%' }, { label: 'Age 35-44', pct: '28%' }, { label: 'Age 45-54', pct: '22%' }, { label: 'Age 55+', pct: '15%' }].map((d, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-stone-600">{d.label}</span>
                        <span className="font-medium text-stone-900">{d.pct}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-stone-200">
                <CardHeader><CardTitle className="text-base">Interests</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[{ label: 'Technology', pct: '42%' }, { label: 'Business', pct: '38%' }, { label: 'Marketing', pct: '31%' }, { label: 'Finance', pct: '25%' }].map((d, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-stone-600">{d.label}</span>
                        <span className="font-medium text-stone-900">{d.pct}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6">
              <h4 className="font-medium text-stone-900 mb-3">Top Performing Keywords</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {['digital marketing', 'advertising tools', 'campaign management', 'analytics dashboard', 'lead generation', 'conversion optimization'].map((keyword) => (
                  <div key={keyword} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg">
                    <span className="text-sm text-stone-700">{keyword}</span>
                    <Badge variant="secondary" className="bg-stone-200 text-stone-600 text-xs">{(Math.random() * 100).toFixed(0)}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Details Modal */}
      {showCampaignDetails && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-stone-900">Campaign Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCampaignDetails(null)} className="text-stone-400 hover:text-stone-600">
                <X className="h-4 w-4" />
              </Button>
            </div>
            {(() => {
              const campaign = recentCampaigns.find(c => c.id === showCampaignDetails)
              if (!campaign) return null
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-medium text-stone-900">{campaign.name}</h4>
                    <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'} className={campaign.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Platform', value: campaign.platform },
                      { label: 'Budget', value: campaign.budget },
                      { label: 'Spend', value: campaign.spend },
                      { label: 'CTR', value: campaign.ctr },
                    ].map((item, i) => (
                      <div key={i}>
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">{item.label}</label>
                        <p className="text-lg font-medium text-stone-900 mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-stone-200">
                    <h5 className="font-medium text-stone-900 mb-3 text-sm">Recent Performance</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-stone-600">Impressions increased by 12%</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-stone-600">Clicks improved by 8%</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <span className="text-stone-600">CTR decreased by 0.5%</span>
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
