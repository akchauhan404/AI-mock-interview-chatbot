'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  BarChart3, 
  ArrowLeft,
  FileText,
  MessageSquare,
  Video,
  Calendar,
  Clock,
  TrendingUp,
  Download,
  Eye
} from 'lucide-react'

interface InterviewRecord {
  id: string
  type: string
  status: string
  score: number | null
  createdAt: string
  totalQuestions: number
  completedQuestions: number
}

interface ResumeRecord {
  id: string
  originalName: string
  atsScore: number | null
  createdAt: string
}

export default function HistoryPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [interviews, setInterviews] = useState<InterviewRecord[]>([])
  const [resumes, setResumes] = useState<ResumeRecord[]>([])
  const [activeTab, setActiveTab] = useState<'interviews' | 'resumes'>('interviews')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      loadHistory()
    }
  }, [user, router])

  const loadHistory = async () => {
    // Mock data for demonstration
    // In a real app, this would fetch from the API
    setInterviews([
      {
        id: '1',
        type: 'text',
        status: 'completed',
        score: 8.5,
        createdAt: '2024-01-15T10:30:00Z',
        totalQuestions: 5,
        completedQuestions: 5
      },
      {
        id: '2',
        type: 'video',
        status: 'completed',
        score: 7.2,
        createdAt: '2024-01-14T14:20:00Z',
        totalQuestions: 5,
        completedQuestions: 5
      },
      {
        id: '3',
        type: 'text',
        status: 'active',
        score: null,
        createdAt: '2024-01-13T09:15:00Z',
        totalQuestions: 5,
        completedQuestions: 3
      }
    ])

    setResumes([
      {
        id: '1',
        originalName: 'John_Doe_Resume.pdf',
        atsScore: 85,
        createdAt: '2024-01-15T11:00:00Z'
      },
      {
        id: '2',
        originalName: 'Resume_Updated.docx',
        atsScore: 72,
        createdAt: '2024-01-10T16:45:00Z'
      }
    ])

    setLoading(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 8) return 'bg-green-100'
    if (score >= 6) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5 text-purple-600" />
      case 'text':
        return <MessageSquare className="h-5 w-5 text-green-600" />
      default:
        return <FileText className="h-5 w-5 text-blue-600" />
    }
  }

  const calculateAverageScore = () => {
    const completedInterviews = interviews.filter(i => i.status === 'completed' && i.score !== null)
    if (completedInterviews.length === 0) return 0
    const total = completedInterviews.reduce((sum, i) => sum + (i.score || 0), 0)
    return total / completedInterviews.length
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview History & Reports</h1>
          <p className="text-gray-600">
            Track your progress and review detailed performance reports from your interviews and resume analyses.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Interviews</p>
                <p className="text-2xl font-bold text-gray-900">{interviews.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Resumes Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">{resumes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {calculateAverageScore() > 0 ? `${calculateAverageScore().toFixed(1)}/10` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {interviews.filter(i => i.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('interviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'interviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Interviews ({interviews.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('resumes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'resumes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Resumes ({resumes.length})
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'interviews' ? (
              <div className="space-y-4">
                {interviews.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
                    <p className="text-gray-600 mb-4">Start your first interview to see your history here.</p>
                    <Link
                      href="/text-interview"
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Interview
                    </Link>
                  </div>
                ) : (
                  interviews.map((interview) => (
                    <div key={interview.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getTypeIcon(interview.type)}
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {interview.type === 'video' ? 'Video Interview' : 'Text Interview'}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(interview.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Progress</div>
                            <div className="font-medium">
                              {interview.completedQuestions}/{interview.totalQuestions} questions
                            </div>
                          </div>

                          {interview.score !== null && (
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(interview.score)}`}>
                              <span className={getScoreColor(interview.score)}>
                                {interview.score.toFixed(1)}/10
                              </span>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {interview.status === 'active' && (
                        <div className="mt-3 flex items-center justify-between bg-yellow-50 rounded-lg p-3">
                          <div className="flex items-center text-yellow-800">
                            <Clock className="h-4 w-4 mr-2" />
                            Interview in progress
                          </div>
                          <Link
                            href={`/${interview.type}-interview`}
                            className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                          >
                            Continue →
                          </Link>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {resumes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes analyzed yet</h3>
                    <p className="text-gray-600 mb-4">Upload your first resume to see analysis history here.</p>
                    <Link
                      href="/resume-analyzer"
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Analyze Resume
                    </Link>
                  </div>
                ) : (
                  resumes.map((resume) => (
                    <div key={resume.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-medium text-gray-900">{resume.originalName}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(resume.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {resume.atsScore !== null && (
                            <div>
                              <div className="text-sm text-gray-500">ATS Score</div>
                              <div className={`font-medium ${
                                resume.atsScore >= 80 ? 'text-green-600' :
                                resume.atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {resume.atsScore}%
                              </div>
                            </div>
                          )}

                          <div className="flex space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
