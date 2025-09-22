import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { ArrowRight, BarChart3, Globe, Target, Zap, Shield, Users, Search, Rss, CheckCircle, Star, Quote, Rocket, TrendingUp } from 'lucide-react'

export default function HomePage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm dark:bg-gray-900/95 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">GA</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Global Ads Launch</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#tools" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Free Tools
              </a>
              <a href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-sm font-medium hover:text-blue-600 transition-colors">
                Reviews
              </a>
            </nav>
            <div className="flex items-center space-x-3">
              <Link to="/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 px-4">
        <div className="container mx-auto text-center">
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 flex items-center justify-center shadow-2xl">
                <Rocket className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              SEO & AI Visibility Control Center
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">for Agencies</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Impress your customers with proactive alerts and actionable reports, generated at the intersection of 
            Search Console, GA4, AI overviews rankings and site content updates.
          </p>
          
          {/* Live Stats Counter */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2,847</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Websites Monitored</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">156K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Issues Fixed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">98.7%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Monitoring</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start 14-day Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 font-semibold">
              Book Demo with Team
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Agencies Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Global Ads Launch</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Stop losing clients to competitors. Our platform gives you the edge you need to deliver exceptional results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">40% More Revenue</h3>
              <p className="text-gray-600 dark:text-gray-400">Agencies using our platform report 40% higher client retention and revenue growth</p>
            </div>
            <div className="text-center p-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">10x Faster Reports</h3>
              <p className="text-gray-600 dark:text-gray-400">Generate professional client reports in minutes, not hours. Automate everything.</p>
            </div>
            <div className="text-center p-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Proactive Alerts</h3>
              <p className="text-gray-600 dark:text-gray-400">Never miss critical issues. Get notified before your clients do.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Tools Section */}
      <section id="tools" className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Try Our Tools Right Now</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              No signup required. Experience the power of our platform instantly and see why agencies love us.
            </p>
          </div>

          {/* Services Grid - Clean Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Website Crawler */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Website Crawler</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Crawl any website for technical issues and SEO insights with comprehensive analysis
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Detect broken links</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Check PageSpeed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>SEO issues</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Content analysis</span>
                  </div>
                </div>
                <Link to="/dashboard/feeds">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    Start Crawling
                  </Button>
                </Link>
              </div>
            </div>

            {/* SEO Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">SEO Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Comprehensive SEO audit and keyword analysis with competitor insights
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Keyword research</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Competitor analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Rank tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Content optimization</span>
                  </div>
                </div>
                <Link to="/dashboard/seo">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    Analyze SEO
                  </Button>
                </Link>
              </div>
            </div>

            {/* Ad Campaign Creator */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ad Campaign Creator</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Create and launch ad campaigns instantly with AI-powered optimization
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>AI-powered targeting</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Multi-platform support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Budget optimization</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Real-time monitoring</span>
                  </div>
                </div>
                <Link to="/dashboard/new-campaigns">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    Create Campaign
                  </Button>
                </Link>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <BarChart3 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Analytics Dashboard</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Real-time performance tracking with detailed insights and reports
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Real-time metrics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Custom reports</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>ROI tracking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Export data</span>
                  </div>
                </div>
                <Link to="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    View Analytics
                  </Button>
                </Link>
              </div>
            </div>

            {/* Feed Manager */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Rss className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Feed Manager</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Manage RSS feeds and content sources with automated crawling
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>RSS feed management</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Automated crawling</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Content filtering</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Data export</span>
                  </div>
                </div>
                <Link to="/dashboard/feeds">
                  <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    Manage Feeds
                  </Button>
                </Link>
              </div>
            </div>

            {/* Auto Optimization */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="text-center">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Auto Optimization</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  AI-powered campaign optimization for maximum ROI and performance
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>AI optimization</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Performance tuning</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>ROI maximization</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Smart bidding</span>
                  </div>
                </div>
                <Link to="/dashboard/seo">
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md hover:shadow-lg transition-all duration-300">
                    Optimize Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to launch and optimize global advertising campaigns
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Multi-Platform Support</CardTitle>
                <CardDescription>
                  Google Ads, Microsoft Ads, and YouTube Ads integration with unified dashboard
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Smart Campaign Launch</CardTitle>
                <CardDescription>
                  Automated campaign setup with AI-powered keyword generation and budget optimization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Real-time reporting with ROAS tracking, conversion analysis, and performance insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>Auto Optimization</CardTitle>
                <CardDescription>
                  Intelligent rules for pausing poor performers, scaling winners, and managing negative keywords
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  OAuth integration, role-based access, and secure API connections with audit trails
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>B2B Audience Wizard</CardTitle>
                <CardDescription>
                  Custom audience targeting with tailored campaign strategies for B2B markets
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join 1000+ Teams Monitoring Websites</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See what our customers are saying about their success with Global Ads Launch
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-blue-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "Now, we monitor all important metrics in one dashboard and prioritize the SEO fixes using only one tool which saves really a lot of time for analyzing and testing new hypotheses. One of our favorite features is email alerts."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">HK</span>
                  </div>
                  <div>
                    <div className="font-semibold">Herman Krabbendam</div>
                    <div className="text-sm text-gray-500">Owner of Vuurwerk agency</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-green-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "Our SEO workflow has changed a lot in the last few years. We've tried a lot of tools to optimize our work, but none of them help us with the technical SEO, which provides the foundation for all of the website's content to rank well."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">LG</span>
                  </div>
                  <div>
                    <div className="font-semibold">Lorenz Graf</div>
                    <div className="text-sm text-gray-500">Head of SEO at LightCyde Agency</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-purple-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "When I begin discovery for a new client, the first thing I do is run Global Ads Launch on their website and connect Google Search Console and Google Analytics accounts to get a better picture of the baseline we are starting from."
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">SW</span>
                  </div>
                  <div>
                    <div className="font-semibold">Sandra West</div>
                    <div className="text-sm text-gray-500">CEO of Bellastrega</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-8">Trusted by agencies worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">360 Agency</div>
              <div className="text-2xl font-bold text-gray-400">Mediboost</div>
              <div className="text-2xl font-bold text-gray-400">Bambuu</div>
              <div className="text-2xl font-bold text-gray-400">Beacon</div>
              <div className="text-2xl font-bold text-gray-400">Lightcyde</div>
              <div className="text-2xl font-bold text-gray-400">Strativ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
              Limited Time Offer
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">50% OFF</span> Your First 3 Months
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join 2,000+ agencies who've already transformed their business. This offer expires in 7 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  Claim 50% Discount
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 font-semibold">
                See Pricing
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              *Offer valid for new customers only. Cannot be combined with other offers.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Scalable Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Add unlimited users to every project. Request a custom plan based on the amount of websites and keywords. 
              Global Ads Launch grows with your agency, not against it.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Agency Starter</CardTitle>
                <CardDescription>Perfect for small agencies</CardDescription>
                <div className="text-3xl font-bold">$199<span className="text-lg text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>✓ Up to 10 websites</li>
                  <li>✓ Unlimited users</li>
                  <li>✓ Website crawler</li>
                  <li>✓ SEO analysis tools</li>
                  <li>✓ Basic reporting</li>
                  <li>✓ Email support</li>
                </ul>
                <Link to="/signup">
                  <Button className="w-full mt-6">Start Free Trial</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="p-6 border-2 border-blue-600 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">Most Popular</Badge>
              <CardHeader>
                <CardTitle>Agency Professional</CardTitle>
                <CardDescription>For growing agencies</CardDescription>
                <div className="text-3xl font-bold">$499<span className="text-lg text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>✓ Up to 50 websites</li>
                  <li>✓ Unlimited users</li>
                  <li>✓ All SEO tools</li>
                  <li>✓ Advanced analytics</li>
                  <li>✓ White label reports</li>
                  <li>✓ Priority support</li>
                  <li>✓ API access</li>
                </ul>
                <Link to="/signup">
                  <Button className="w-full mt-6">Start Free Trial</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardHeader>
                <CardTitle>Agency Enterprise</CardTitle>
                <CardDescription>For large agencies</CardDescription>
                <div className="text-3xl font-bold">Custom<span className="text-lg text-gray-500"> pricing</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>✓ Unlimited websites</li>
                  <li>✓ Unlimited users</li>
                  <li>✓ All features included</li>
                  <li>✓ Custom integrations</li>
                  <li>✓ Dedicated support</li>
                  <li>✓ Custom reporting</li>
                  <li>✓ SLA guarantee</li>
                </ul>
                <Button className="w-full mt-6" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Impress Your Clients?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join 1000+ agencies already using Global Ads Launch to deliver proactive alerts and actionable reports 
            that keep their clients happy and their business growing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100">
                Start 14-day Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2 border-white text-blue-300 hover:bg-white hover:text-blue-600 hover:shadow-lg hover:shadow-white/25 transition-all duration-300 font-semibold">
              Book Demo with Team
            </Button>
          </div>
          <div className="mt-8 text-blue-100">
            <p className="text-sm">No credit card required • Cancel anytime • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GA</span>
                </div>
                <span className="text-xl font-bold">Global Ads Launch</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                SEO & AI visibility control center for agencies. Impress your customers with proactive alerts 
                and actionable reports, generated at the intersection of Search Console, GA4, AI overviews 
                rankings and site content updates.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-400">4.6/5 (353 reviews)</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Core Tools</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#tools" className="hover:text-white transition-colors">Website Crawler</a></li>
                <li><a href="#tools" className="hover:text-white transition-colors">SEO Analysis</a></li>
                <li><a href="#tools" className="hover:text-white transition-colors">Rank Tracker</a></li>
                <li><a href="#tools" className="hover:text-white transition-colors">Analytics Dashboard</a></li>
                <li><a href="#tools" className="hover:text-white transition-colors">Feed Manager</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Product Updates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                <p>&copy; 2024 Global Ads Launch. All rights reserved.</p>
                <p className="mt-1">Global Ads Launch is owned and operated by Global Ads Launch Limited</p>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
                <a href="#" className="hover:text-white transition-colors">Privacy Notice</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

