import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { ArrowRight, BarChart3, Globe, Target, Zap, Shield, Users, Search, Rss, CheckCircle, Star, TrendingUp, MousePointer, Eye, Layers, Activity } from 'lucide-react'

export default function HomePage() {

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Header ── */}
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-9 w-9 rounded-lg bg-teal-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm tracking-tight">Av</span>
              </div>
              <span className="text-xl font-bold text-stone-900 tracking-tight">AdVantage</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#tools" className="text-sm font-medium text-stone-600 hover:text-teal-700 transition-colors duration-200">
                Tools
              </a>
              <a href="#features" className="text-sm font-medium text-stone-600 hover:text-teal-700 transition-colors duration-200">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium text-stone-600 hover:text-teal-700 transition-colors duration-200">
                Pricing
              </a>
              <a href="#testimonials" className="text-sm font-medium text-stone-600 hover:text-teal-700 transition-colors duration-200">
                Reviews
              </a>
            </nav>
            <div className="flex items-center space-x-3">
              <Link to="/signin">
                <Button variant="ghost" size="sm" className="text-stone-700 hover:text-teal-700">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-white transition-all duration-200">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero Section (Asymmetric Split) ── */}
      <section className="relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-teal-50 rounded-full blur-3xl opacity-60 -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-50 rounded-full blur-3xl opacity-60 -z-10" />

        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left: Text Content (7 cols) */}
            <div className="lg:col-span-7 animate-fade-in-up">
              <Badge className="mb-6 bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 px-4 py-1.5 text-sm font-medium">
                Trusted by 2,000+ agencies worldwide
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
                <span className="text-stone-900">The SEO & Ad Visibility</span>
                <br />
                <span className="text-gradient-primary">Control Center</span>
                <br />
                <span className="text-stone-900">for Agencies</span>
              </h1>

              <p className="text-lg lg:text-xl text-stone-500 mb-8 max-w-xl leading-relaxed">
                Proactive alerts and actionable reports at the intersection of
                Search Console, GA4, AI overview rankings, and site content updates.
                Impress your clients before they even ask.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/signup">
                  <Button size="lg" className="text-base px-7 py-5 bg-teal-700 hover:bg-teal-800 text-white shadow-lg shadow-teal-700/20 transition-all duration-300 hover:shadow-xl hover:shadow-teal-700/30">
                    Start 14-Day Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="text-base px-7 py-5 border-stone-300 text-stone-700 hover:bg-stone-100 hover:border-stone-400 transition-all duration-300">
                  Book a Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-stone-500 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-600" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-600" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-teal-600" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Right: Dashboard Preview (5 cols) */}
            <div className="lg:col-span-5 animate-fade-in-right delay-300">
              <div className="relative">
                {/* Floating accent card - top */}
                <div className="absolute -top-4 -left-4 z-10 bg-white rounded-xl shadow-xl p-4 animate-float border border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-teal-50 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-teal-700" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Organic Traffic</p>
                      <p className="text-lg font-bold text-stone-900">+47.2%</p>
                    </div>
                  </div>
                </div>

                {/* Main dashboard mockup */}
                <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-5">
                  {/* Mini header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-stone-900 text-sm">Campaign Performance</h3>
                      <p className="text-xs text-stone-400">Last 30 days</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">Live</Badge>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-stone-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-stone-900">2.4M</p>
                      <p className="text-[10px] text-stone-500 uppercase tracking-wider">Impressions</p>
                    </div>
                    <div className="bg-stone-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-teal-700">4.8%</p>
                      <p className="text-[10px] text-stone-500 uppercase tracking-wider">CTR</p>
                    </div>
                    <div className="bg-stone-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-amber-600">6.2x</p>
                      <p className="text-[10px] text-stone-500 uppercase tracking-wider">ROAS</p>
                    </div>
                  </div>

                  {/* Mini chart bars */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-400 w-16">Google</span>
                      <div className="flex-1 bg-stone-100 rounded-full h-2.5">
                        <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: '78%' }} />
                      </div>
                      <span className="text-xs font-medium text-stone-600 w-10 text-right">78%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-400 w-16">Microsoft</span>
                      <div className="flex-1 bg-stone-100 rounded-full h-2.5">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '54%' }} />
                      </div>
                      <span className="text-xs font-medium text-stone-600 w-10 text-right">54%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-400 w-16">YouTube</span>
                      <div className="flex-1 bg-stone-100 rounded-full h-2.5">
                        <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '41%' }} />
                      </div>
                      <span className="text-xs font-medium text-stone-600 w-10 text-right">41%</span>
                    </div>
                  </div>

                  {/* Alert row */}
                  <div className="flex items-center gap-3 bg-amber-50 rounded-lg p-3 border border-amber-100">
                    <Activity className="h-4 w-4 text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-amber-800">3 campaigns need attention -- CTR below threshold</p>
                  </div>
                </div>

                {/* Floating accent card - bottom right */}
                <div className="absolute -bottom-4 -right-4 z-10 bg-white rounded-xl shadow-xl p-4 animate-float delay-500 border border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Target className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Conversions</p>
                      <p className="text-lg font-bold text-stone-900">1,284</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof Bar ── */}
      <section className="py-10 border-y border-stone-200 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-stone-400 mb-6 uppercase tracking-wider font-medium">Trusted by leading agencies</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
            {['360 Agency', 'Mediboost', 'Bambuu', 'Beacon Digital', 'LightCyde', 'Strativ Group'].map((name, i) => (
              <span key={i} className="text-lg font-semibold text-stone-300 hover:text-stone-500 transition-colors duration-300 cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value Proposition Stats ── */}
      <section className="py-16 px-4 bg-stone-900 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-900/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-900/20 rounded-full blur-3xl" />

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in-up">
              <p className="text-4xl lg:text-5xl font-bold text-white mb-2">40%</p>
              <p className="text-stone-400 text-sm">Higher client retention for agencies using our platform</p>
            </div>
            <div className="animate-fade-in-up delay-200">
              <p className="text-4xl lg:text-5xl font-bold text-teal-400 mb-2">10x</p>
              <p className="text-stone-400 text-sm">Faster report generation compared to manual workflows</p>
            </div>
            <div className="animate-fade-in-up delay-400">
              <p className="text-4xl lg:text-5xl font-bold text-amber-400 mb-2">156K+</p>
              <p className="text-stone-400 text-sm">SEO issues identified and fixed across client sites</p>
            </div>
            <div className="animate-fade-in-up delay-600">
              <p className="text-4xl lg:text-5xl font-bold text-white mb-2">24/7</p>
              <p className="text-stone-400 text-sm">Continuous monitoring with proactive alert system</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tools Section (Bento Grid) ── */}
      <section id="tools" className="py-20 px-4 bg-stone-50">
        <div className="container mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-3">Platform Tools</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 tracking-tight">
              Everything you need. Nothing you don't.
            </h2>
            <p className="text-lg text-stone-500">
              No signup required for a quick test. See why agencies love working with these tools.
            </p>
          </div>

          {/* Bento Grid - mixed sizes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Large Card - Website Crawler */}
            <div className="md:col-span-2 bg-white rounded-2xl p-8 border border-stone-200 card-hover group">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="h-12 w-12 rounded-xl bg-teal-50 flex items-center justify-center mb-5 group-hover:bg-teal-100 transition-colors duration-300">
                    <Globe className="h-6 w-6 text-teal-700" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">Website Crawler</h3>
                  <p className="text-stone-500 mb-5 leading-relaxed">
                    Deep-crawl any website for technical issues, broken links, PageSpeed bottlenecks, and SEO gaps. Get a full health report in minutes.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {['Broken link detection', 'PageSpeed analysis', 'SEO audit', 'Content analysis'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-stone-600">
                        <CheckCircle className="h-4 w-4 text-teal-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/dashboard/feeds">
                    <Button className="bg-teal-700 hover:bg-teal-800 text-white transition-all duration-200">
                      Start Crawling
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="lg:w-64 bg-stone-50 rounded-xl p-5 space-y-3">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Sample Output</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-stone-600">Pages Scanned</span><span className="font-semibold text-stone-900">1,247</span></div>
                    <div className="flex justify-between text-sm"><span className="text-stone-600">Issues Found</span><span className="font-semibold text-amber-600">23</span></div>
                    <div className="flex justify-between text-sm"><span className="text-stone-600">SEO Score</span><span className="font-semibold text-teal-700">87/100</span></div>
                    <div className="flex justify-between text-sm"><span className="text-stone-600">Load Time</span><span className="font-semibold text-stone-900">1.2s</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Analysis */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200 card-hover group">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors duration-300">
                <Search className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">SEO Analysis</h3>
              <p className="text-stone-500 mb-5 leading-relaxed">
                Keyword research, competitor analysis, rank tracking, and content optimization in one view.
              </p>
              <Link to="/dashboard/seo">
                <Button variant="outline" className="border-stone-300 text-stone-700 hover:bg-stone-100 transition-all duration-200">
                  Analyze SEO
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Ad Campaign Creator */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200 card-hover group">
              <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center mb-5 group-hover:bg-amber-100 transition-colors duration-300">
                <Target className="h-6 w-6 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Campaign Creator</h3>
              <p className="text-stone-500 mb-5 leading-relaxed">
                Build and launch multi-platform ad campaigns with AI-powered targeting and budget optimization.
              </p>
              <Link to="/dashboard/new-campaigns">
                <Button variant="outline" className="border-stone-300 text-stone-700 hover:bg-stone-100 transition-all duration-200">
                  Create Campaign
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Analytics Dashboard */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200 card-hover group">
              <div className="h-12 w-12 rounded-xl bg-stone-100 flex items-center justify-center mb-5 group-hover:bg-stone-200 transition-colors duration-300">
                <BarChart3 className="h-6 w-6 text-stone-700" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Analytics</h3>
              <p className="text-stone-500 mb-5 leading-relaxed">
                Real-time performance tracking with custom reports, ROI metrics, and exportable data.
              </p>
              <Link to="/dashboard">
                <Button variant="outline" className="border-stone-300 text-stone-700 hover:bg-stone-100 transition-all duration-200">
                  View Analytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Large Card - Feed Manager + Auto Optimization */}
            <div className="md:col-span-2 bg-gradient-to-br from-teal-700 to-teal-900 rounded-2xl p-8 card-hover group text-white relative overflow-hidden">
              {/* Decorative circle */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-600/30 rounded-full blur-2xl" />
              <div className="relative z-10 flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <Rss className="h-6 w-6 text-white" />
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-amber-300" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Feed Manager + Auto Optimization</h3>
                  <p className="text-teal-100 mb-5 leading-relaxed">
                    Automated product feed crawling paired with AI-driven campaign optimization. Set it up once,
                    let the system maximize your ROAS continuously.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {['Automated crawling', 'Smart bidding', 'Feed exports', 'ROI maximization'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-teal-100">
                        <CheckCircle className="h-4 w-4 text-amber-300 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/dashboard/feeds">
                    <Button className="bg-white text-teal-800 hover:bg-stone-100 transition-all duration-200">
                      Manage Feeds
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section (Alternating Panels) ── */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 tracking-tight">
              Built for agencies that refuse to settle
            </h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              Every feature designed to help you retain clients, scale operations, and outperform competitors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: 'Multi-Platform Support', desc: 'Google Ads, Microsoft Ads, and YouTube Ads integration with a unified dashboard', color: 'bg-teal-50 text-teal-700' },
              { icon: Target, title: 'Smart Campaign Launch', desc: 'Automated campaign setup with AI-powered keyword generation and budget optimization', color: 'bg-amber-50 text-amber-700' },
              { icon: BarChart3, title: 'Advanced Analytics', desc: 'Real-time reporting with ROAS tracking, conversion analysis, and performance insights', color: 'bg-emerald-50 text-emerald-700' },
              { icon: Zap, title: 'Auto Optimization', desc: 'Intelligent rules for pausing poor performers, scaling winners, and managing negative keywords', color: 'bg-orange-50 text-orange-700' },
              { icon: Shield, title: 'Enterprise Security', desc: 'OAuth integration, role-based access, and secure API connections with audit trails', color: 'bg-stone-100 text-stone-700' },
              { icon: Users, title: 'B2B Audience Wizard', desc: 'Custom audience targeting with tailored campaign strategies for B2B markets', color: 'bg-teal-50 text-teal-700' },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl border border-stone-200 card-hover group bg-white">
                <div className={`h-12 w-12 rounded-xl ${feature.color.split(' ')[0]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.color.split(' ')[1]}`} />
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">{feature.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section id="testimonials" className="py-20 px-4 bg-stone-50">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-3">What Agencies Say</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 tracking-tight">
              Join 1,000+ teams monitoring websites
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                quote: "We monitor all important metrics in one dashboard and prioritize SEO fixes using only one tool. It saves a lot of time for analyzing and testing new hypotheses. The email alerts feature is invaluable.",
                name: 'Herman Krabbendam',
                role: 'Owner, Vuurwerk Agency',
                initials: 'HK',
                accent: 'bg-teal-50 text-teal-700',
              },
              {
                quote: "Our SEO workflow has changed a lot. We tried many tools but none helped with technical SEO, which provides the foundation for all content to rank well. This platform changed that completely.",
                name: 'Lorenz Graf',
                role: 'Head of SEO, LightCyde Agency',
                initials: 'LG',
                accent: 'bg-amber-50 text-amber-700',
              },
              {
                quote: "When I begin discovery for a new client, the first thing I do is run AdVantage on their site and connect Search Console and Analytics to get a baseline picture.",
                name: 'Sandra West',
                role: 'CEO, Bellastrega',
                initials: 'SW',
                accent: 'bg-emerald-50 text-emerald-700',
              },
            ].map((testimonial, i) => (
              <Card key={i} className="p-6 border-stone-200 card-hover bg-white">
                <CardContent className="p-0">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-stone-600 mb-6 leading-relaxed text-sm">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full ${testimonial.accent.split(' ')[0]} flex items-center justify-center`}>
                      <span className={`font-bold text-sm ${testimonial.accent.split(' ')[1]}`}>{testimonial.initials}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-stone-900 text-sm">{testimonial.name}</div>
                      <div className="text-xs text-stone-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Rating summary */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2.5 border border-stone-200 shadow-sm">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-stone-700">4.6/5 from 353 reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4 tracking-tight">
              Simple, scalable pricing
            </h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              Unlimited users on every plan. Request a custom plan based on your website and keyword count.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {/* Starter */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200 card-hover">
              <h3 className="text-lg font-semibold text-stone-900 mb-1">Agency Starter</h3>
              <p className="text-sm text-stone-500 mb-6">Perfect for small agencies</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-stone-900">$199</span>
                <span className="text-stone-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-stone-600">
                {['Up to 10 websites', 'Unlimited users', 'Website crawler', 'SEO analysis tools', 'Basic reporting', 'Email support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-teal-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button variant="outline" className="w-full border-stone-300 text-stone-700 hover:bg-stone-100 transition-all duration-200">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Professional - Featured */}
            <div className="bg-teal-700 rounded-2xl p-8 text-white card-hover relative -mt-2 shadow-xl shadow-teal-700/20">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white border-0 px-4 py-1">
                Most Popular
              </Badge>
              <h3 className="text-lg font-semibold mb-1">Agency Professional</h3>
              <p className="text-teal-200 text-sm mb-6">For growing agencies</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$499</span>
                <span className="text-teal-200">/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-teal-100">
                {['Up to 50 websites', 'Unlimited users', 'All SEO tools', 'Advanced analytics', 'White label reports', 'Priority support', 'API access'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-amber-300 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/signup">
                <Button className="w-full bg-white text-teal-800 hover:bg-stone-100 transition-all duration-200">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl p-8 border border-stone-200 card-hover">
              <h3 className="text-lg font-semibold text-stone-900 mb-1">Agency Enterprise</h3>
              <p className="text-sm text-stone-500 mb-6">For large agencies</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-stone-900">Custom</span>
                <span className="text-stone-500"> pricing</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-stone-600">
                {['Unlimited websites', 'Unlimited users', 'All features included', 'Custom integrations', 'Dedicated support', 'Custom reporting', 'SLA guarantee'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-teal-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full border-stone-300 text-stone-700 hover:bg-stone-100 transition-all duration-200">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 px-4 bg-stone-900 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-teal-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-800/10 rounded-full blur-3xl" />

        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight">Ready to impress your clients?</h2>
          <p className="text-lg text-stone-400 mb-10 max-w-2xl mx-auto">
            Join 1,000+ agencies already using AdVantage to deliver proactive alerts
            and actionable reports that keep clients engaged and revenue growing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-base px-8 py-5 bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/25 transition-all duration-300">
                Start 14-Day Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-base px-8 py-5 border-stone-600 text-stone-300 hover:bg-stone-800 hover:text-white transition-all duration-300">
              Book a Demo
            </Button>
          </div>
          <p className="text-sm text-stone-500 mt-6">
            No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-stone-900 text-white pt-16 pb-8 px-4 border-t border-stone-800">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-teal-700 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Av</span>
                </div>
                <span className="text-lg font-bold">AdVantage</span>
              </div>
              <p className="text-stone-400 mb-6 max-w-sm text-sm leading-relaxed">
                SEO & AI visibility control center for agencies. Proactive alerts and actionable
                reports at the intersection of Search Console, GA4, and AI overview rankings.
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-sm text-stone-400">4.6/5 (353 reviews)</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-stone-300">Core Tools</h3>
              <ul className="space-y-2.5 text-stone-400 text-sm">
                <li><a href="#tools" className="hover:text-white transition-colors duration-200">Website Crawler</a></li>
                <li><a href="#tools" className="hover:text-white transition-colors duration-200">SEO Analysis</a></li>
                <li><a href="#tools" className="hover:text-white transition-colors duration-200">Rank Tracker</a></li>
                <li><a href="#tools" className="hover:text-white transition-colors duration-200">Analytics Dashboard</a></li>
                <li><a href="#tools" className="hover:text-white transition-colors duration-200">Feed Manager</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-stone-300">Company</h3>
              <ul className="space-y-2.5 text-stone-400 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors duration-200">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors duration-200">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-stone-300">Resources</h3>
              <ul className="space-y-2.5 text-stone-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Status Page</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-stone-500 text-sm">
                &copy; 2024 AdVantage. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-stone-500">
                <a href="#" className="hover:text-white transition-colors duration-200">Terms</a>
                <a href="#" className="hover:text-white transition-colors duration-200">Privacy</a>
                <a href="#" className="hover:text-white transition-colors duration-200">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
