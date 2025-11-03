'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FileText, 
  MessageSquare, 
  Video, 
  BarChart3, 
  User, 
  LogOut,
  TrendingUp,
  Clock,
  Award,
  Target,
  Sparkles,
  Rocket,
  Zap,
  Star,
  Upload,
  Play,
  CheckCircle
} from 'lucide-react'

interface DashboardStats {
  totalInterviews: number
  completedInterviews: number
  averageScore: number
  resumesAnalyzed: number
}

export default function DashboardPage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
    resumesAnalyzed: 0
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      // Mock stats - in a real app, this would fetch from API
      setStats({
        totalInterviews: 12,
        completedInterviews: 8,
        averageScore: 8.5,
        resumesAnalyzed: 3
      })
      setIsVisible(true)
    }
  }, [user, loading, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="spinner-gradient h-16 w-16"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 float-animation"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-10 float-animation"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-10 float-animation"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-10 float-animation"></div>
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className={`flex items-center ${isVisible ? 'animate-slide-in-left' : ''}`}>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {user.name || user.email}! 
                <Sparkles className="inline h-6 w-6 text-yellow-400 ml-2 animate-pulse" />
              </h1>
            </div>
            <div className={`flex items-center space-x-4 ${isVisible ? 'animate-slide-in-right' : ''}`}>
              <Link
                href="/history"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium hover:scale-105 transform"
              >
                History
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-all duration-300 font-medium hover:scale-105 transform"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className={`mb-8 text-center ${isVisible ? 'animate-bounce-in' : 'opacity-0'}`}>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our AI-powered tools below and take your interview skills to the next level!
          </p>
        </div>

        {/* Stats Overview */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="card-hover bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Interviews</p>
                <p className="text-3xl font-bold">{stats.totalInterviews}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <MessageSquare className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="card-hover bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold">{stats.completedInterviews}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Award className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="card-hover bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Average Score</p>
                <p className="text-3xl font-bold">{stats.averageScore}/10</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="card-hover bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">Resumes Analyzed</p>
                <p className="text-3xl font-bold">{stats.resumesAnalyzed}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <FileText className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Features */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 ${isVisible ? 'animate-fade-in-up animate-delay-200' : 'opacity-0'}`}>
          {/* Resume Analyzer */}
          <div className="card-hover bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg icon-hover">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">Resume Analyzer & ATS Scorer</h3>
                <p className="text-gray-600">Get ATS compatibility scores</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Upload your resume and receive instant feedback on ATS compatibility, 
              keyword optimization, and formatting suggestions.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Upload className="h-4 w-4 mr-2 text-blue-500" />
                Upload PDF or DOCX files
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                Get ATS compatibility score
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                Receive AI-powered feedback
              </div>
            </div>
            <Link
              href="/resume-analyzer"
              className="btn-gradient text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 inline-flex items-center group w-full justify-center"
            >
              <Target className="mr-2 h-5 w-5 group-hover:animate-spin" />
              Analyze Resume
              <Sparkles className="ml-2 h-5 w-5 group-hover:animate-bounce" />
            </Link>
          </div>

          {/* Text Interview */}
          <div className="card-hover bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-green-700 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg icon-hover">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">AI Interview Chatbot</h3>
                <p className="text-gray-600">Practice with AI chatbot</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Engage in realistic text-based interviews with our AI interviewer. 
              Get instant feedback and improve your responses.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                Text-based interview simulation
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-green-500" />
                Instant question-by-question feedback
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BarChart3 className="h-4 w-4 mr-2 text-green-500" />
                Technical accuracy scoring
              </div>
            </div>
            <Link
              href="/text-interview"
              className="btn-success text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 inline-flex items-center group w-full justify-center"
            >
              <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Start Interview
              <Star className="ml-2 h-5 w-5 group-hover:animate-spin" />
            </Link>
          </div>
        </div>

        {/* Video Interview Section */}
        <div className={`card-hover bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-2xl p-8 text-white mb-12 ${isVisible ? 'animate-fade-in-up animate-delay-400' : 'opacity-0'}`}>
          <div className="flex flex-col lg:flex-row items-center">
            <div className="flex-1 mb-6 lg:mb-0">
              <div className="flex items-center mb-4">
                <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg icon-hover">
                  <Video className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-3xl font-bold">Video Interview Experience</h3>
                  <p className="text-purple-100">Practice with real-time analysis</p>
                </div>
              </div>
              <p className="text-lg leading-relaxed mb-6">
                Take your preparation to the next level with our advanced video interview simulator. 
                Get AI-powered feedback on your body language, speech patterns, and overall presentation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-purple-100">
                  <Video className="h-4 w-4 mr-2" />
                  Real-time video conferencing
                </div>
                <div className="flex items-center text-purple-100">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Voice and visual analysis
                </div>
                <div className="flex items-center text-purple-100">
                  <FileText className="h-4 w-4 mr-2" />
                  Comprehensive performance report
                </div>
              </div>
              <Link
                href="/video-interview"
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 inline-flex items-center group hover:scale-105"
              >
                <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                Start Video Interview
                <Sparkles className="ml-3 h-6 w-6 group-hover:animate-spin" />
              </Link>
            </div>
            <div className="lg:ml-8">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center pulse-glow">
                <Video className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${isVisible ? 'animate-fade-in-up animate-delay-500' : 'opacity-0'}`}>
          <Link
            href="/history"
            className="card-hover bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 text-center group"
          >
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg icon-hover">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">View History</h3>
            <p className="text-gray-600">Review your past interviews and progress</p>
          </Link>

          <div className="card-hover bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 text-center">
            <div className="bg-gradient-to-r from-teal-400 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg icon-hover">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Recent Activity</h3>
            <p className="text-gray-600">Last interview: 2 days ago</p>
          </div>

          <div className="card-hover bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20 text-center">
            <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg icon-hover">
              <User className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Profile</h3>
            <p className="text-gray-600">Manage your account settings</p>
          </div>
        </div>
      </div>
    </div>
  )
}
