'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  Brain, 
  FileText, 
  MessageSquare, 
  Video, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Users,
  Award,
  Zap,
  Sparkles,
  Star,
  Rocket
} from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <div className="spinner-gradient h-16 w-16"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 float-animation"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 float-animation"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20 float-animation"></div>
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 float-animation"></div>
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className={`flex items-center ${isVisible ? 'animate-slide-in-left' : ''}`}>
              <div className="relative">
                <Brain className="h-8 w-8 text-blue-600 pulse-glow" />
                <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Interview Platform
              </span>
            </div>
            <div className={`flex items-center space-x-4 ${isVisible ? 'animate-slide-in-right' : ''}`}>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="btn-gradient text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transform transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`${isVisible ? 'animate-bounce-in' : 'opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Master Your
              <span className="rainbow-text block text-6xl md:text-8xl">Interview Skills</span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                with AI
              </span>
            </h1>
          </div>
          
          <div className={`${isVisible ? 'animate-fade-in-up animate-delay-200' : 'opacity-0'}`}>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Practice with our advanced AI-powered mock interview platform. Get real-time feedback, 
              improve your resume, and land your dream job with confidence.
            </p>
          </div>
          
          <div className={`flex flex-col sm:flex-row gap-6 justify-center ${isVisible ? 'animate-fade-in-up animate-delay-400' : 'opacity-0'}`}>
            <Link
              href="/signup"
              className="btn-gradient text-white px-10 py-4 rounded-full text-lg font-bold shadow-2xl hover:shadow-3xl transform transition-all duration-300 flex items-center justify-center group"
            >
              <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
              Start Free Trial
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="glow-border bg-white text-gray-800 px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Star className="inline mr-2 h-5 w-5 text-yellow-500" />
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-r from-white to-blue-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools you need to prepare for any interview
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Resume Analyzer */}
            <div className="card-hover bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg border border-blue-200">
              <div className="bg-gradient-to-r from-blue-500 to-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg icon-hover">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Resume Analyzer & ATS Scorer</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Upload your resume and get an instant ATS compatibility score with AI-powered feedback 
                on how to improve it.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  PDF & DOCX support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  ATS compatibility scoring
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Detailed improvement suggestions
                </li>
              </ul>
            </div>

            {/* Text Interview */}
            <div className="card-hover bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-lg border border-green-200">
              <div className="bg-gradient-to-r from-green-500 to-green-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg icon-hover">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Interview Chatbot</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Practice with our intelligent chatbot that asks relevant questions and provides 
                instant feedback on your responses.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Behavioral & technical questions
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Instant feedback
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Performance scoring
                </li>
              </ul>
            </div>

            {/* Video Interview */}
            <div className="card-hover bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 shadow-lg border border-purple-200">
              <div className="bg-gradient-to-r from-purple-500 to-purple-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg icon-hover">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Video Interview</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Experience realistic video interviews with AI analysis of your speech, 
                body language, and overall presentation.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Real-time video analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Voice & visual feedback
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  Comprehensive reports
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Trusted by Job Seekers Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of professionals who have improved their interview skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center card-hover bg-white rounded-2xl p-8 shadow-lg">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg pulse-glow">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">10,000+</div>
              <div className="text-gray-600 font-medium">Active Users</div>
            </div>

            <div className="text-center card-hover bg-white rounded-2xl p-8 shadow-lg">
              <div className="bg-gradient-to-r from-green-400 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg pulse-glow">
                <Award className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">95%</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>

            <div className="text-center card-hover bg-white rounded-2xl p-8 shadow-lg">
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg pulse-glow">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">50,000+</div>
              <div className="text-gray-600 font-medium">Interviews Completed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Start practicing today and build the confidence you need to land your dream job.
          </p>
          <Link
            href="/signup"
            className="bg-white text-purple-600 px-12 py-5 rounded-full text-xl font-bold hover:bg-gray-50 transition-all duration-300 inline-flex items-center shadow-2xl hover:shadow-3xl transform hover:scale-105 group"
          >
            <Sparkles className="mr-3 h-6 w-6 group-hover:animate-spin" />
            Get Started for Free
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <Brain className="h-10 w-10 text-blue-400 pulse-glow" />
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Interview Platform
                </span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                Empowering job seekers with AI-powered interview preparation tools. 
                Practice, improve, and succeed in your career journey.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6 text-white">Platform</h3>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/resume-analyzer" className="hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 transform inline-block">Resume Analyzer</Link></li>
                <li><Link href="/text-interview" className="hover:text-green-400 transition-colors duration-300 hover:translate-x-1 transform inline-block">Text Interview</Link></li>
                <li><Link href="/video-interview" className="hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 transform inline-block">Video Interview</Link></li>
                <li><Link href="/history" className="hover:text-pink-400 transition-colors duration-300 hover:translate-x-1 transform inline-block">Interview History</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6 text-white">Account</h3>
              <ul className="space-y-3 text-gray-300">
                <li><Link href="/signup" className="hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 transform inline-block">Sign Up</Link></li>
                <li><Link href="/login" className="hover:text-green-400 transition-colors duration-300 hover:translate-x-1 transform inline-block">Sign In</Link></li>
                <li><Link href="/dashboard" className="hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 transform inline-block">Dashboard</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-lg">
              &copy; 2024 AI Interview Platform. All rights reserved. 
              <span className="ml-2 text-pink-400">Made with ❤️ for job seekers</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
