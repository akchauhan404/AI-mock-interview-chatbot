
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MessageSquare,
  Send,
  ArrowLeft,
  Loader2,
  Sparkles,
  Zap,
  CheckCircle,
  XCircle,
  Award,
  TrendingUp,
  Clock
} from 'lucide-react'

interface Message {
  id: number
  sender: 'user' | 'ai'
  text: string
}

interface InterviewFeedback {
  score: number
  feedback: string
}

interface InterviewState {
  interviewId: string
  currentQuestion: number
  totalQuestions: number
  question: { id: string; questionText: string; category: string }
  completed: boolean
  finalScore?: number
}

export default function TextInterviewPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewId, setInterviewId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      setIsVisible(true)
    }
  }, [user, router])

  const startInterview = async () => {
    setLoading(true)
    setMessages([])
    setFeedback(null)
    setError('')
    try {
      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user?.id, type: 'text', questionCount: 5 }),
      })
      const data = await response.json()
      if (response.ok) {
        setInterviewId(data.interviewId)
        setMessages([{ id: 1, sender: 'ai', text: data.question.questionText }])
        setInterviewStarted(true)
      } else {
        setError(data.error || 'Failed to start interview')
      }
    } catch (err) {
      setError('An error occurred while starting the interview.')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !interviewId) return

    const userMessage: Message = { id: messages.length + 1, sender: 'user', text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/interview/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ interviewId, answer: userMessage.text }),
      })
      const data = await response.json()

      if (response.ok) {
        const aiMessage: Message = { id: messages.length + 2, sender: 'ai', text: data.nextQuestion?.questionText || 'Interview ended. Here is your feedback.' }
        setMessages((prev) => [...prev, aiMessage])
        if (data.evaluation) {
          setFeedback(data.evaluation)
          setInterviewStarted(false)
        }
      } else {
        setError(data.error || 'Failed to get AI response')
      }
    } catch (err) {
      setError('An error occurred while sending your answer.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 8) return 'bg-gradient-to-r from-green-400 to-green-600'
    if (score >= 6) return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
    return 'bg-gradient-to-r from-red-400 to-red-600'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 8) return 'Outstanding! Your responses were highly effective.'
    if (score >= 6) return 'Good effort! With some refinement, you can excel.'
    return 'Keep practicing! Focus on structuring your answers.'
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                AI Interview Chatbot
                <Sparkles className="inline h-6 w-6 text-yellow-400 ml-2 animate-pulse" />
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!interviewStarted && !feedback ? (
          <div className={`${isVisible ? 'animate-bounce-in' : 'opacity-0'}`}>
            {/* Start Interview Screen */}
            <div className="card-hover bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-r from-green-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg pulse-glow">
                  <MessageSquare className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  Start Your Text Interview
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Engage in a simulated interview with our AI chatbot. Get instant feedback on your responses.
                </p>
                <button
                  onClick={startInterview}
                  disabled={loading}
                  className="btn-success text-white px-10 py-4 rounded-xl text-xl font-bold shadow-2xl hover:shadow-3xl transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center group"
                >
                  {loading ? (
                    <>
                      <div className="spinner-gradient h-6 w-6 mr-3"></div>
                      Starting Interview...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                      Start Interview
                      <Sparkles className="ml-3 h-6 w-6 group-hover:animate-spin" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[70vh]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-xl mb-4 border border-gray-200">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-xl shadow-md ${msg.sender === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white animate-slide-in-right'
                        : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800 animate-slide-in-left'}
                    `}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[70%] p-4 rounded-xl shadow-md bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800 animate-pulse">
                    AI is typing...
                  </div>
                </div>
              )}
            </div>

            {feedback ? (
              <div className="card-hover bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20 mt-4 animate-fade-in-up">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Interview Feedback</h3>
                  <p className="text-gray-600">Your performance summary</p>
                </div>

                <div className="flex justify-center mb-6">
                  <div className={`rounded-full p-8 ${getScoreBackground(feedback.score)} shadow-2xl pulse-glow`}>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-white mb-2">{feedback.score}/10</div>
                      <div className="text-white font-medium">Score</div>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    {getScoreMessage(feedback.score)}
                  </p>
                  <div className="flex justify-center items-center space-x-2">
                    {feedback.score >= 8 ? (
                      <Award className="h-6 w-6 text-green-500" />
                    ) : feedback.score >= 6 ? (
                      <TrendingUp className="h-6 w-6 text-yellow-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                    <span className={`font-medium ${getScoreColor(feedback.score)}`}>
                      {feedback.score >= 8 ? 'Excellent' : feedback.score >= 6 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </div>
                </div>

                <div className="prose max-w-none mb-8">
                  <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-xl p-6 border-l-4 border-green-500">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                      {feedback.feedback}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={startInterview}
                    className="btn-success text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 inline-flex items-center group"
                  >
                    <Zap className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                    Start New Interview
                  </button>
                  <Link
                    href="/history"
                    className="btn-gradient text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 inline-flex items-center group"
                  >
                    <Clock className="mr-2 h-5 w-5 group-hover:animate-spin" />
                    View History
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center mt-4 animate-fade-in-up">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage()
                    }
                  }}
                  className="form-input-enhanced flex-1 rounded-xl py-3 px-4 text-lg focus:ring-green-500 focus:border-green-500"
                  placeholder="Type your answer here..."
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="btn-success ml-4 px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center group"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  )}
                  <span className="ml-2 hidden sm:inline">Send</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

