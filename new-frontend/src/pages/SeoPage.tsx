import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, TrendingUp, Globe, Target, Zap, BarChart3, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SeoPage() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ keywordsTracked: 0, avgPosition: 0, organicTraffic: 0, seoScore: 0 })

  const loadSeoStats = async () => {
    try {
      setLoading(true)
      setStats({ keywordsTracked: 0, avgPosition: 0, organicTraffic: 0, seoScore: 0 })
    } catch (error) {
      console.error('Error loading SEO stats:', error)
      toast.error('Failed to load SEO stats')
    } finally {
      setLoading(false)
    }
  }

  const handleStartAnalysis = () => { toast.success('Starting SEO analysis...') }
  const handleUseTool = (toolName: string) => { toast.success(`Opening ${toolName}...`) }

  useEffect(() => { loadSeoStats() }, [])

  const seoTools = [
    { id: 1, name: 'Keyword Research', description: 'Find high-value keywords for your campaigns', status: 'Available', icon: Search, color: 'bg-teal-50 text-teal-700' },
    { id: 2, name: 'Competitor Analysis', description: 'Analyze competitor ad strategies and keywords', status: 'Available', icon: Target, color: 'bg-emerald-50 text-emerald-700' },
    { id: 3, name: 'Landing Page Optimizer', description: 'Optimize your landing pages for better conversions', status: 'Beta', icon: Zap, color: 'bg-amber-50 text-amber-700' },
    { id: 4, name: 'Rank Tracker', description: 'Track your keyword rankings across search engines', status: 'Available', icon: TrendingUp, color: 'bg-orange-50 text-orange-700' },
    { id: 5, name: 'Backlink Analyzer', description: 'Analyze your backlink profile and opportunities', status: 'Coming Soon', icon: Globe, color: 'bg-stone-100 text-stone-500' },
    { id: 6, name: 'Content Optimizer', description: 'Optimize your content for better SEO performance', status: 'Available', icon: BarChart3, color: 'bg-teal-50 text-teal-700' },
  ]

  const statCards = [
    { label: 'Keywords Tracked', value: stats.keywordsTracked, icon: Search, color: 'bg-teal-50 text-teal-700' },
    { label: 'Avg. Position', value: stats.avgPosition || 'N/A', icon: TrendingUp, color: 'bg-amber-50 text-amber-700' },
    { label: 'Organic Traffic', value: stats.organicTraffic.toLocaleString(), icon: Globe, color: 'bg-emerald-50 text-emerald-700' },
    { label: 'SEO Score', value: stats.seoScore, icon: BarChart3, color: 'bg-stone-100 text-stone-700' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">SEO Tools</h1>
          <p className="text-stone-500 text-sm">Optimize your campaigns with powerful SEO tools</p>
        </div>
        <Button onClick={handleStartAnalysis} disabled={loading} className="bg-teal-700 hover:bg-teal-800 text-white">
          <Search className="mr-2 h-4 w-4" />{loading ? 'Loading...' : 'Start Analysis'}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-stone-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-stone-500">{stat.label}</CardTitle>
              <div className={`h-8 w-8 rounded-lg ${stat.color.split(' ')[0]} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color.split(' ')[1]}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {seoTools.map((tool) => {
          const Icon = tool.icon
          return (
            <Card key={tool.id} className="border-stone-200 card-hover group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`h-10 w-10 rounded-xl ${tool.color.split(' ')[0]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-5 w-5 ${tool.color.split(' ')[1]}`} />
                  </div>
                  <Badge className={
                    tool.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    tool.status === 'Beta' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-stone-100 text-stone-500 border-stone-200'
                  }>{tool.status}</Badge>
                </div>
                <CardTitle className="text-base mt-3">{tool.name}</CardTitle>
                <CardDescription className="text-sm">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className={`w-full ${tool.status === 'Coming Soon' ? 'border-stone-300 text-stone-400' : 'bg-teal-700 hover:bg-teal-800 text-white'}`}
                  variant={tool.status === 'Coming Soon' ? 'outline' : 'default'} disabled={tool.status === 'Coming Soon'}
                  onClick={() => handleUseTool(tool.name)}>
                  {tool.status === 'Coming Soon' ? 'Coming Soon' : 'Use Tool'}
                  {tool.status !== 'Coming Soon' && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-lg">Recent Analysis</CardTitle>
          <CardDescription>Your latest SEO analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { icon: Search, title: 'Keyword Research - "digital marketing"', desc: 'Found 45 high-value keywords -- 2 hours ago', color: 'bg-teal-50 text-teal-700' },
              { icon: Target, title: 'Competitor Analysis - CompetitorX', desc: 'Analyzed 12 campaigns -- 1 day ago', color: 'bg-emerald-50 text-emerald-700' },
              { icon: BarChart3, title: 'Content Optimization - Landing Page A', desc: 'Improved SEO score by 15 points -- 2 days ago', color: 'bg-amber-50 text-amber-700' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className={`h-9 w-9 rounded-lg ${item.color.split(' ')[0]} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`h-4 w-4 ${item.color.split(' ')[1]}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-stone-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-stone-500">{item.desc}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-stone-300 text-stone-600 hover:bg-stone-100">View Results</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
