"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Brain, TrendingUp, Users, Award, ArrowRight, CheckCircle, Star, Zap, Target, BarChart3, MessageSquare, FileText, Wand2, Download, Sparkles, Lightbulb, Rocket } from "lucide-react"
import { ErrorBoundary } from "@/components/error-boundary"

// Features for the animated showcase
const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced resume analysis using cutting-edge AI technology",
    color: "from-blue-500 to-purple-600"
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description: "Track your progress and identify growth opportunities",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Get personalized advice from career development experts",
    color: "from-orange-500 to-red-600"
  },
  {
    icon: Award,
    title: "Skill Recognition",
    description: "Identify and showcase your unique skills and talents",
    color: "from-purple-500 to-pink-600"
  }
]

// Stats for the landing page
const stats = [
  { icon: Users, value: "10K+", label: "Active Users", color: "text-blue-600" },
  { icon: Award, value: "95%", label: "Success Rate", color: "text-green-600" },
  { icon: TrendingUp, value: "2.5x", label: "Career Growth", color: "text-orange-600" },
  { icon: Star, value: "4.9/5", label: "User Rating", color: "text-yellow-600" }
]

// Main content component
function MainContent() {
  const { user, logout } = useAuth()
  const [currentFeature, setCurrentFeature] = useState(0)

  // Animate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-card/50">
        {/* Subtle animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-40 left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

                 {/* Landing page content starts here - no duplicate header */}

        {/* Hero Section */}
        <main className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            {/* AI-Powered Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-8 fade-in">
              <Brain className="w-5 h-5 mr-2" />
              AI-Powered Career Development
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 slide-up">
              Transform Your Career with
              <span className="block text-gradient mt-2">
                Intelligent Guidance
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto slide-up stagger-1">
              Leverage AI-powered tools to analyze resumes, discover opportunities, and accelerate your professional growth with data-driven insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 slide-up stagger-2">
              <Link href="/register">
                <button className="btn-primary text-lg px-8 py-4">
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Free Trial
                </button>
              </Link>
              <Link href="/courses">
                <button className="btn-secondary text-lg px-8 py-4">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Explore Courses
                </button>
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 slide-up stagger-3">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className={`p-3 rounded-xl bg-card border border-border/50 ${stat.color}`}>
                      <stat.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features Section */}
            <div className="mb-20 slide-up stagger-4">
              <h2 className="text-3xl font-bold text-foreground mb-10">Why Choose ProPath?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="professional-card p-6 text-center hover:scale-105 transition-transform duration-300">
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white`}>
                        <feature.icon className="w-8 h-8" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Animated Feature Showcase */}
            <div className="premium-card p-10 mb-20 slide-up">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Featured Capability</h2>
              <div className="flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    {(() => {
                      try {
                        const IconComponent = features[currentFeature]?.icon;
                        if (IconComponent && typeof IconComponent === 'function') {
                          return (
                            <div className={`p-6 rounded-2xl bg-gradient-to-r ${features[currentFeature].color} text-white shadow-2xl scale-in`}>
                              <IconComponent className="h-16 w-16" />
                            </div>
                          );
                        }
                        return <FileText className="h-16 w-16 text-muted-foreground" />;
                      } catch (error) {
                        console.warn('Icon rendering error:', error);
                        return <FileText className="h-16 w-16 text-muted-foreground" />;
                      }
                    })()}
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">
                    {features[currentFeature].title}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {features[currentFeature].description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

     // Logged in user dashboard
   return (
     <div className="min-h-screen bg-gradient-to-br from-background via-card to-card/50">
       {/* Dashboard content starts here - no duplicate header */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple Welcome Header */}
        <div className="mb-8 fade-in text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name || user.email}! 👋
          </h1>
          <p className="text-muted-foreground">Ready to continue your career development journey?</p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 slide-up stagger-1">
          <Link href="/resume" className="unified-card-interactive p-6 text-center group">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 mx-auto mb-4 w-fit group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Resume Tools</h3>
            <p className="text-sm text-muted-foreground">Analyze & create resumes</p>
          </Link>

          <Link href="/assessments" className="unified-card-interactive p-6 text-center group">
            <div className="p-3 rounded-xl bg-green-500/10 text-green-600 mx-auto mb-4 w-fit group-hover:scale-110 transition-transform">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Skill Assessment</h3>
            <p className="text-sm text-muted-foreground">Test your skills</p>
          </Link>

          <Link href="/courses" className="unified-card-interactive p-6 text-center group">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 mx-auto mb-4 w-fit group-hover:scale-110 transition-transform">
              <Lightbulb className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Learning Path</h3>
            <p className="text-sm text-muted-foreground">Discover courses</p>
          </Link>

          <Link href="/chat" className="unified-card-interactive p-6 text-center group">
            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600 mx-auto mb-4 w-fit group-hover:scale-110 transition-transform">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Career Chat</h3>
            <p className="text-sm text-muted-foreground">Get AI guidance</p>
          </Link>
        </div>

        {/* Recent Activity Summary */}
        <div className="grid gap-6 md:grid-cols-3 mb-8 slide-up stagger-2">
          <div className="professional-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Profile Complete</span>
                <span className="font-medium text-foreground">100%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Skills Assessed</span>
                <span className="font-medium text-foreground">5</span>
              </div>
            </div>
          </div>

          <div className="professional-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
              Progress
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Career Score</span>
                <span className="font-medium text-foreground">85/100</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Next Goal</span>
                <span className="font-medium text-foreground">Resume Review</span>
              </div>
            </div>
          </div>

          <div className="professional-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Achievements
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-muted-foreground">Profile completed</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-muted-foreground">First assessment</span>
              </div>
            </div>
          </div>
        </div>

        

        {/* Dashboard content ends here */}
      </div>
    </div>
  )
}

// Main page with error boundary
export default function HomePage() {
  return (
    <ErrorBoundary>
      <MainContent />
    </ErrorBoundary>
  )
}
