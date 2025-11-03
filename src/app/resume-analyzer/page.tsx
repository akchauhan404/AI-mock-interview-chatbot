'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Upload, 
  FileText, 
  BarChart3, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Target,
  Zap,
  Star,
  Award,
  TrendingUp
} from 'lucide-react'

interface AnalysisResult {
  id: string
  atsScore: number
  feedback: string
  filename: string
}

export default function ResumeAnalyzerPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      setIsVisible(true)
    }
  }, [user, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload only PDF or DOCX files')
        return
      }
      
      // Check file size (10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }

      setFile(selectedFile)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file to upload')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('jobDescription', jobDescription)

      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Analysis failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-green-400 to-green-600'
    if (score >= 60) return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
    return 'bg-gradient-to-r from-red-400 to-red-600'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent! Your resume is highly ATS-compatible.'
    if (score >= 60) return 'Good! Some improvements can boost your ATS score.'
    return 'Needs improvement. Consider optimizing for ATS systems.'
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
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link 
              href="/dashboard" 
              className={`flex items-center text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105 ${isVisible ? 'animate-slide-in-left' : ''}`}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
            <div className={`ml-8 ${isVisible ? 'animate-fade-in-up animate-delay-200' : 'opacity-0'}`}>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resume Analyzer & ATS Scorer
                <Sparkles className="inline h-6 w-6 text-yellow-400 ml-2 animate-pulse" />
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!result ? (
          <div className={`${isVisible ? 'animate-bounce-in' : 'opacity-0'}`}>
            {/* Upload Form */}
            <div className="card-hover bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg pulse-glow">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Upload Your Resume
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Get instant ATS compatibility scoring and AI-powered feedback to optimize your resume for job applications.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="notification-error rounded-xl p-4 flex items-center animate-bounce-in">
                    <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* File Upload */}
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-4">
                    Resume File (PDF or DOCX)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="glow-border bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center cursor-pointer hover:from-blue-100 hover:to-purple-100 transition-all duration-300 block group"
                    >
                      <div className="flex flex-col items-center">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="h-8 w-8 text-white" />
                        </div>
                        {file ? (
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900 mb-2">{file.name}</p>
                            <p className="text-sm text-gray-600">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-lg font-bold text-gray-900 mb-2">
                              Click to upload your resume
                            </p>
                            <p className="text-gray-600">
                              Supports PDF and DOCX files up to 10MB
                            </p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <label htmlFor="jobDescription" className="block text-lg font-bold text-gray-700 mb-4">
                    Job Description (Optional)
                  </label>
                  <textarea
                    id="jobDescription"
                    rows={6}
                    className="form-input-enhanced w-full rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Paste the job description here to get more targeted feedback..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading || !file}
                    className="btn-gradient text-white px-12 py-4 rounded-xl text-xl font-bold shadow-2xl hover:shadow-3xl transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center group"
                  >
                    {loading ? (
                      <>
                        <div className="spinner-gradient h-6 w-6 mr-3"></div>
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <Target className="mr-3 h-6 w-6 group-hover:animate-spin" />
                        Analyze Resume
                        <Zap className="ml-3 h-6 w-6 group-hover:animate-bounce" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            {/* ATS Score */}
            <div className="card-hover bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete!</h2>
                <p className="text-gray-600">Here&apos;s your resume analysis for: {result.filename}</p>
              </div>

              <div className="flex justify-center mb-6">
                <div className={`rounded-full p-8 ${getScoreBackground(result.atsScore)} shadow-2xl pulse-glow`}>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-white mb-2">{result.atsScore}</div>
                    <div className="text-white font-medium">ATS Score</div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <p className="text-xl font-bold text-gray-900 mb-2">
                  {getScoreMessage(result.atsScore)}
                </p>
                <div className="flex justify-center items-center space-x-2">
                  {result.atsScore >= 80 ? (
                    <Award className="h-6 w-6 text-green-500" />
                  ) : result.atsScore >= 60 ? (
                    <TrendingUp className="h-6 w-6 text-yellow-500" />
                  ) : (
                    <Target className="h-6 w-6 text-red-500" />
                  )}
                  <span className={`font-medium ${getScoreColor(result.atsScore)}`}>
                    {result.atsScore >= 80 ? 'Excellent' : result.atsScore >= 60 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="card-hover bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-700 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 ml-4">AI-Powered Feedback</h3>
              </div>
              <div className="prose max-w-none">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                    {result.feedback}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setResult(null)
                  setFile(null)
                  setJobDescription('')
                  setError('')
                }}
                className="btn-secondary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 inline-flex items-center group"
              >
                <Upload className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Analyze Another Resume
              </button>
              
              <Link
                href="/dashboard"
                className="btn-gradient text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 inline-flex items-center group"
              >
                <Star className="mr-2 h-5 w-5 group-hover:animate-spin" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
