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
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Target,
  Globe,
  Eye,
  MousePointer,
  X,
  Plus,
  FileText,
  Download,
  Settings,
} from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * SEO Tools page component
 * Provides SEO analysis and keyword tracking
 */
export default function SEOPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddKeywords, setShowAddKeywords] = useState(false)
  const [showKeywordDetails, setShowKeywordDetails] = useState<number | null>(null)
  const [showSiteAnalysis, setShowSiteAnalysis] = useState(false)
  const [showKeywordReport, setShowKeywordReport] = useState(false)

  /**
   * Handle button clicks with dummy functionality
   */
  const handleAddKeywords = () => {
    setShowAddKeywords(true)
    toast.success('Opening keyword addition wizard...')
  }

  const handleViewKeywordDetails = (keywordId: number) => {
    setShowKeywordDetails(keywordId)
    toast.success('Loading keyword details...')
  }

  const handleAnalyzeKeyword = (keywordId: number) => {
    toast.success('Starting keyword analysis...')
  }

  const handleTrackCompetitors = (keywordId: number) => {
    toast.success('Setting up competitor tracking...')
  }

  const handleOptimizePage = (keywordId: number) => {
    toast.success('Opening page optimization tools...')
  }

  const handleViewReport = () => {
    setShowKeywordReport(true)
    toast.success('Generating keyword report...')
  }

  const handleExportKeywords = () => {
    toast.success('Exporting keyword data...')
  }

  const handleViewSiteAnalysis = () => {
    setShowSiteAnalysis(true)
    toast.success('Running site analysis...')
  }

  /**
   * Mock SEO data
   * In a real app, this would come from API calls
   */
  const keywords = [
    {
      id: 1,
      keyword: 'digital marketing agency',
      position: 3,
      previousPosition: 5,
      searchVolume: 12000,
      difficulty: 65,
      cpc: 2.45,
      status: 'tracking',
      url: 'https://example.com/services/digital-marketing',
      lastChecked: '2024-09-06T10:30:00Z',
    },
    {
      id: 2,
      keyword: 'google ads management',
      position: 1,
      previousPosition: 2,
      searchVolume: 8500,
      difficulty: 45,
      cpc: 3.20,
      status: 'tracking',
      url: 'https://example.com/services/google-ads',
      lastChecked: '2024-09-06T10:30:00Z',
    },
    {
      id: 3,
      keyword: 'seo optimization services',
      position: 8,
      previousPosition: 12,
      searchVolume: 6200,
      difficulty: 70,
      cpc: 1.85,
      status: 'tracking',
      url: 'https://example.com/services/seo',
      lastChecked: '2024-09-06T10:30:00Z',
    },
    {
      id: 4,
      keyword: 'ppc advertising company',
      position: 15,
      previousPosition: 18,
      searchVolume: 4200,
      difficulty: 55,
      cpc: 2.10,
      status: 'tracking',
      url: 'https://example.com/services/ppc',
      lastChecked: '2024-09-06T10:30:00Z',
    },
    {
      id: 5,
      keyword: 'social media marketing',
      position: 0,
      previousPosition: 0,
      searchVolume: 15000,
      difficulty: 80,
      cpc: 1.95,
      status: 'not_ranking',
      url: null,
      lastChecked: '2024-09-06T10:30:00Z',
    },
  ]

  /**
   * Mock site analysis data
   */
  const siteAnalysis = {
    overallScore: 78,
    issues: [
      { type: 'error', count: 3, description: 'Critical issues' },
      { type: 'warning', count: 12, description: 'Warnings' },
      { type: 'info', count: 8, description: 'Suggestions' },
    ],
    metrics: {
      pageSpeed: 85,
      mobileFriendly: 92,
      coreWebVitals: 78,
      crawlability: 95,
    }
  }

  /**
   * Filter keywords based on search and status
   */
  const filteredKeywords = keywords.filter(keyword => {
    const matchesSearch = keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || keyword.status === filterStatus
    return matchesSearch && matchesStatus
  })

  /**
   * Get position change icon and color
   */
  const getPositionChange = (current: number, previous: number) => {
    if (current === 0) return { icon: Minus, color: 'text-gray-500', text: 'Not ranking' }
    if (previous === 0) return { icon: TrendingUp, color: 'text-green-500', text: 'New' }
    
    const change = previous - current
    if (change > 0) return { icon: TrendingUp, color: 'text-green-500', text: `+${change}` }
    if (change < 0) return { icon: TrendingDown, color: 'text-red-500', text: `${change}` }
    return { icon: Minus, color: 'text-gray-500', text: 'No change' }
  }

  /**
   * Get difficulty color
   */
  const getDifficultyColor = (difficulty: number) => {
    if (difficulty >= 70) return 'text-red-600'
    if (difficulty >= 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  /**
   * Format date
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SEO Tools</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track keywords and analyze your website's SEO performance
          </p>
        </div>
        <Button onClick={handleAddKeywords}>
          <Plus className="h-4 w-4 mr-2" />
          Add Keywords
        </Button>
      </div>

      {/* Site Analysis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteAnalysis.overallScore}/100</div>
            <p className="text-xs text-muted-foreground">
              {siteAnalysis.overallScore >= 80 ? 'Excellent' : 
               siteAnalysis.overallScore >= 60 ? 'Good' : 'Needs improvement'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Speed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteAnalysis.metrics.pageSpeed}/100</div>
            <p className="text-xs text-muted-foreground">
              {siteAnalysis.metrics.pageSpeed >= 90 ? 'Fast' : 
               siteAnalysis.metrics.pageSpeed >= 50 ? 'Average' : 'Slow'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile Friendly</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteAnalysis.metrics.mobileFriendly}/100</div>
            <p className="text-xs text-muted-foreground">
              {siteAnalysis.metrics.mobileFriendly >= 90 ? 'Excellent' : 'Good'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Core Web Vitals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteAnalysis.metrics.coreWebVitals}/100</div>
            <p className="text-xs text-muted-foreground">
              {siteAnalysis.metrics.coreWebVitals >= 80 ? 'Good' : 'Needs work'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Issues Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Site Issues</CardTitle>
              <CardDescription>
                Issues found during the last SEO analysis
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleViewSiteAnalysis}>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analysis
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {siteAnalysis.issues.map((issue, index) => (
              <div key={index} className="flex items-center space-x-3">
                {issue.type === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                {issue.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                {issue.type === 'info' && <CheckCircle className="h-5 w-5 text-blue-500" />}
                <div>
                  <div className="font-medium">{issue.count} {issue.description}</div>
                  <div className="text-sm text-gray-500 capitalize">{issue.type}s</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Keywords Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Keyword Tracking</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleViewReport}>
              <BarChart3 className="h-4 w-4 mr-1" />
              View Report
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportKeywords}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search keywords..."
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
                    All Keywords
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('tracking')}>
                    Tracking
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('not_ranking')}>
                    Not Ranking
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Keywords List */}
        <div className="space-y-4">
          {filteredKeywords.map((keyword) => {
            const positionChange = getPositionChange(keyword.position, keyword.previousPosition)
            const PositionIcon = positionChange.icon

            return (
              <Card key={keyword.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {keyword.keyword}
                        </h3>
                        <Badge variant={keyword.status === 'tracking' ? 'default' : 'secondary'}>
                          {keyword.status === 'tracking' ? 'Tracking' : 'Not Ranking'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Position:</span>
                          <div className="font-medium flex items-center space-x-1">
                            <span>{keyword.position || 'N/A'}</span>
                            {keyword.position > 0 && (
                              <span className={`flex items-center ${positionChange.color}`}>
                                <PositionIcon className="h-3 w-3 mr-1" />
                                {positionChange.text}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Search Volume:</span>
                          <div className="font-medium">{keyword.searchVolume.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Difficulty:</span>
                          <div className={`font-medium ${getDifficultyColor(keyword.difficulty)}`}>
                            {keyword.difficulty}/100
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">CPC:</span>
                          <div className="font-medium">${keyword.cpc}</div>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Last Checked:</span>
                          <div className="font-medium">{formatDate(keyword.lastChecked)}</div>
                        </div>
                      </div>

                      {keyword.url && (
                        <div className="mt-2">
                          <a
                            href={keyword.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center space-x-1 text-sm"
                          >
                            <span className="truncate max-w-xs">{keyword.url}</span>
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleAnalyzeKeyword(keyword.id)}>
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analyze
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewKeywordDetails(keyword.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTrackCompetitors(keyword.id)}>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Track Competitors
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOptimizePage(keyword.id)}>
                            <Target className="h-4 w-4 mr-2" />
                            Optimize Page
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredKeywords.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No keywords found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Start tracking keywords to monitor your SEO performance.'}
                </p>
                <Button onClick={handleAddKeywords}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Keywords
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Interactive Modals */}
      
      {/* Add Keywords Modal */}
      {showAddKeywords && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Keywords to Track</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddKeywords(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Keywords</label>
                <textarea 
                  className="w-full p-2 border rounded-md h-24"
                  placeholder="Enter keywords separated by commas or new lines"
                  defaultValue="digital marketing, seo services, ppc management"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter multiple keywords separated by commas or new lines
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Target URL (Optional)</label>
                  <input 
                    type="url" 
                    className="w-full p-2 border rounded-md"
                    placeholder="https://example.com/page"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1" onClick={() => {
                  toast.success('Keywords added successfully!')
                  setShowAddKeywords(false)
                }}>
                  Add Keywords
                </Button>
                <Button variant="outline" onClick={() => setShowAddKeywords(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyword Details Modal */}
      {showKeywordDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Keyword Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowKeywordDetails(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {(() => {
              const keyword = keywords.find(k => k.id === showKeywordDetails)
              if (!keyword) return null
              const positionChange = getPositionChange(keyword.position, keyword.previousPosition)
              const PositionIcon = positionChange.icon
              return (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-medium">{keyword.keyword}</h4>
                    <Badge variant={keyword.status === 'tracking' ? 'default' : 'secondary'}>
                      {keyword.status === 'tracking' ? 'Tracking' : 'Not Ranking'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Ranking Position</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{keyword.position || 'N/A'}</div>
                        {keyword.position > 0 && (
                          <div className={`flex items-center text-sm ${positionChange.color}`}>
                            <PositionIcon className="h-4 w-4 mr-1" />
                            {positionChange.text}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Search Volume</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{keyword.searchVolume.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">monthly searches</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Difficulty</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-2xl font-bold ${getDifficultyColor(keyword.difficulty)}`}>
                          {keyword.difficulty}/100
                        </div>
                        <div className="text-sm text-gray-500">
                          {keyword.difficulty >= 70 ? 'Hard' : keyword.difficulty >= 40 ? 'Medium' : 'Easy'}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">CPC</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">${keyword.cpc}</div>
                        <div className="text-sm text-gray-500">cost per click</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h5 className="font-medium mb-3">Keyword Analysis</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                          Search volume trend: +12% this month
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Competition level: Moderate
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <span className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                          Difficulty increased by 5 points
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

      {/* Site Analysis Modal */}
      {showSiteAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Site Analysis Report</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSiteAnalysis(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">{siteAnalysis.overallScore}/100</div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">{siteAnalysis.metrics.pageSpeed}/100</div>
                    <div className="text-sm text-gray-600">Page Speed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">{siteAnalysis.metrics.mobileFriendly}/100</div>
                    <div className="text-sm text-gray-600">Mobile Friendly</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">{siteAnalysis.metrics.coreWebVitals}/100</div>
                    <div className="text-sm text-gray-600">Core Web Vitals</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Detailed Issues</h4>
                <div className="space-y-3">
                  {siteAnalysis.issues.map((issue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {issue.type === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                        {issue.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                        {issue.type === 'info' && <CheckCircle className="h-5 w-5 text-blue-500" />}
                        <span className="font-medium">{issue.count} {issue.description}</span>
                      </div>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyword Report Modal */}
      {showKeywordReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Keyword Performance Report</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowKeywordReport(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">{keywords.length}</div>
                    <div className="text-sm text-gray-600">Total Keywords</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {keywords.filter(k => k.position > 0 && k.position <= 10).length}
                    </div>
                    <div className="text-sm text-gray-600">Top 10 Rankings</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {keywords.reduce((sum, k) => sum + k.searchVolume, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Search Volume</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Keyword Performance Summary</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Keyword</th>
                        <th className="text-left p-2">Position</th>
                        <th className="text-left p-2">Search Volume</th>
                        <th className="text-left p-2">Difficulty</th>
                        <th className="text-left p-2">CPC</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywords.map((keyword) => (
                        <tr key={keyword.id} className="border-b">
                          <td className="p-2 font-medium">{keyword.keyword}</td>
                          <td className="p-2">{keyword.position || 'N/A'}</td>
                          <td className="p-2">{keyword.searchVolume.toLocaleString()}</td>
                          <td className="p-2">{keyword.difficulty}/100</td>
                          <td className="p-2">${keyword.cpc}</td>
                          <td className="p-2">
                            <Badge variant={keyword.status === 'tracking' ? 'default' : 'secondary'}>
                              {keyword.status === 'tracking' ? 'Tracking' : 'Not Ranking'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
