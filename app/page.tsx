import Link from "next/link"
import { BarChart3, Phone, ShoppingCart, TrendingUp, Clock, DollarSign, Users, Shield, Check, X, Star, Heart, ArrowRight, Zap, Target, LineChart, PlayCircle, Award, MessageSquare } from "lucide-react"
import { WaveBackground } from "@/components/wave-background"

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50/50">
      {/* Modern geometric background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-indigo-100/30 to-purple-100/30"></div>
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(99 102 241) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
      {/* Visible gradient orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200/40 to-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-200/40 to-pink-200/30 rounded-full blur-3xl"></div>
      {/* Wave background for hero section */}
      <div className="absolute inset-0 h-screen">
        <WaveBackground />
      </div>
      <div className="relative z-10">
        
        {/* HERO SECTION - Modern, attention-grabbing with clear value prop */}
        <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-8 shadow-lg shadow-indigo-500/20 border border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300 cursor-pointer animate-pulse">
                <Zap className="h-4 w-4" />
                <span>AI-Powered Restaurant Analytics</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-8 leading-[1.1]">
                Transform Call Data
                <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Into Revenue Growth</span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Automatically track every call, order, and interaction. Make data-driven decisions that <span className="font-semibold text-slate-900">increase sales by 35%</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link 
                  href="/login"
                  className="group px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/50 hover:scale-110 flex items-center justify-center gap-2 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#demo"
                  className="group px-10 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 font-semibold text-lg shadow-sm hover:scale-105 flex items-center justify-center gap-2"
                >
                  <PlayCircle className="h-5 w-5" />
                  Watch Demo
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium">Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium">No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium">5-min setup</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF - Compact, impactful metrics */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 hover:border-indigo-300 transition-all duration-300 cursor-pointer">
                <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">35%</div>
                <div className="text-sm text-slate-600 font-medium">Revenue Increase</div>
              </div>
              <div className="group bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 hover:border-indigo-300 transition-all duration-300 cursor-pointer">
                <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
                <div className="text-sm text-slate-600 font-medium">Call Capture</div>
              </div>
              <div className="group bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 hover:border-indigo-300 transition-all duration-300 cursor-pointer">
                <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">2.5x</div>
                <div className="text-sm text-slate-600 font-medium">Faster Decisions</div>
              </div>
              <div className="group bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 hover:border-indigo-300 transition-all duration-300 cursor-pointer">
                <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">$50K+</div>
                <div className="text-sm text-slate-600 font-medium">Annual Savings</div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM/SOLUTION - Clear pain points with visual contrast */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                Stop Flying Blind
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Most restaurants lose thousands monthly because they lack visibility into their call data
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2 hover:border-red-300 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-200 transition-all duration-300">
                  <Target className="h-6 w-6 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Missing Conversions</h3>
                <p className="text-slate-600 leading-relaxed">Can't identify which calls convert to orders or why customers hang up</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2 hover:border-red-300 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-200 transition-all duration-300">
                  <MessageSquare className="h-6 w-6 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Lost Insights</h3>
                <p className="text-slate-600 leading-relaxed">No transcripts means missing customer pain points and opportunities</p>
              </div>
              
              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2 hover:border-red-300 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-red-200 transition-all duration-300">
                  <LineChart className="h-6 w-6 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Scattered Data</h3>
                <p className="text-slate-600 leading-relaxed">Performance tracking impossible across multiple systems and locations</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-10 shadow-lg border border-green-200 hover:shadow-2xl hover:shadow-green-500/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0">
                  <Check className="h-8 w-8 text-white" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-3">Our Solution: Complete Visibility</h3>
                  <p className="text-lg text-slate-700 leading-relaxed">One unified dashboard. Every call tracked. Every order captured. Every insight automated. Make decisions based on real data, not guesswork.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES - Modern grid with hover effects */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                Powerful Features
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Everything you need to transform your restaurant operations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-indigo-500/25 hover:-translate-y-2 hover:border-indigo-300 transition-all duration-300 cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Real-Time Dashboard
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Live KPIs, charts, and trends. Track sales, orders, calls, and conversion rates instantly.
                </p>
              </div>

              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-green-500/25 hover:-translate-y-2 hover:border-green-300 transition-all duration-300 cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all duration-300">
                  <ShoppingCart className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Order Intelligence
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Complete order details with items, payments, and linked calls for full visibility.
                </p>
              </div>

              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-2 hover:border-purple-300 transition-all duration-300 cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                  <Phone className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Call Analytics
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Full transcripts, audio playback, and outcome tracking for every interaction.
                </p>
              </div>

              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-orange-500/25 hover:-translate-y-2 hover:border-orange-300 transition-all duration-300 cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-all duration-300">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Multi-Location Insights
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Compare performance across locations. Identify winners and replicate success.
                </p>
              </div>

              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-2 hover:border-blue-300 transition-all duration-300 cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Peak Hour Analysis
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Optimize staffing and operations based on call patterns and busy periods.
                </p>
              </div>

              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-2 hover:border-emerald-300 transition-all duration-300 cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300">
                  <DollarSign className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Revenue Tracking
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Monitor sales, ticket sizes, and revenue trends across all your locations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DEMO PREVIEW - Visual showcase */}
        <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-10 sm:p-16 border border-slate-200 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                  See It In Action
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  Experience the power of real-time analytics
                </p>
              </div>
              <div className="aspect-video bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl flex items-center justify-center border border-slate-200 relative overflow-hidden group hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 cursor-pointer">
                <div className="text-center relative z-10">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <PlayCircle className="h-32 w-32 text-indigo-600 relative cursor-pointer group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mb-3">Interactive Dashboard Demo</p>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">Watch how restaurants transform their operations with real-time insights</p>
                  <Link href="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg shadow-indigo-500/25 hover:scale-105">
                    Try Live Demo
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS - Social proof with impact */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6 shadow-sm border border-indigo-200">
                <Award className="h-4 w-4" />
                <span>Trusted by Industry Leaders</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                Real Results, Real Impact
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                See how restaurants transformed their operations with data
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 hover:border-indigo-300 transition-all duration-300 cursor-pointer">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 text-lg leading-relaxed">
                  "Increased orders by <span className="font-bold text-indigo-600">$12K monthly</span> after fixing our phone scripts based on call analytics."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Sarah Martinez</p>
                    <p className="text-sm text-slate-600">Owner, Pizza Palace Chain</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-2 hover:border-green-300 transition-all duration-300 cursor-pointer">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 text-lg leading-relaxed">
                  "Replicated top location strategies across 8 stores. <span className="font-bold text-indigo-600">Revenue up 28%</span> in 3 months."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">James Kim</p>
                    <p className="text-sm text-slate-600">Operations Director, Burger Co.</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 hover:border-purple-300 transition-all duration-300 cursor-pointer">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 text-lg leading-relaxed">
                  "Cut wasted ad spend by <span className="font-bold text-indigo-600">$3K/month</span> by tracking which campaigns drive actual orders."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Maria Rodriguez</p>
                    <p className="text-sm text-slate-600">Marketing Manager, Taco Express</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA - Strong, clear call to action */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-12 sm:p-16 border border-slate-200 text-center hover:shadow-2xl hover:shadow-indigo-500/20 hover:scale-[1.01] transition-all duration-300">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
                Ready to Grow Your Revenue?
              </h2>
              <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto">
                Join hundreds of restaurants making smarter decisions with real-time call analytics
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Link 
                  href="/login"
                  className="group px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-bold text-lg shadow-lg shadow-indigo-500/25 hover:scale-105 flex items-center justify-center gap-3"
                >
                  Start Free Trial
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="font-medium">14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="font-medium">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="font-medium">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* FOOTER - Clean, modern footer */}
      <footer className="border-t border-slate-200 bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900">Restaurant Analytics</span>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6 max-w-md">
                Transform your restaurant operations with AI-powered call analytics and real-time insights.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Powered by RestoHost.ai</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-slate-600 hover:text-indigo-600 transition-colors">Features</a></li>
                <li><a href="#demo" className="text-slate-600 hover:text-indigo-600 transition-colors">Demo</a></li>
                <li><Link href="/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors">Dashboard</Link></li>
                <li><Link href="/login" className="text-slate-600 hover:text-indigo-600 transition-colors">Sign In</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Technology</h4>
              <ul className="space-y-3 text-slate-600">
                <li>Next.js 16</li>
                <li>MySQL + Prisma</li>
                <li>TailwindCSS</li>
                <li>NextAuth</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-slate-600">
                <span>&copy; 2026 Restaurant Analytics. Built with</span>
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                <span>for restaurants.</span>
              </p>
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </main>
  )
}
