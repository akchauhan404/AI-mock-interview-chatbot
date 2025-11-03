
'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  ArrowLeft,
  Loader2,
  Sparkles,
  Zap,
  CheckCircle,
  XCircle,
  Award,
  TrendingUp,
  Play,
  StopCircle,
  RefreshCcw,
  MessageSquare,
  Clock,
  Send
} from 'lucide-react'

interface VideoInterviewFeedback {
  score: number
  feedback: string
  eyeContact: string
  speakingPace: string
  bodyLanguage: string
}

interface Message {
  id: number
  sender: 'user' | 'ai'
  text: string
}

export default function VideoInterviewPage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewActive, setInterviewActive] = useState(false)
  const [feedback, setFeedback] = useState<VideoInterviewFeedback | null>(null)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const userVideoRef = useRef<HTMLVideoElement>(null)
  const aiVideoRef = useRef<HTMLVideoElement>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)

  // Mock messages for display during active interview
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      setIsVisible(true)
    }
  }, [user, router])

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream
      }
      mediaStreamRef.current = stream
    } catch (err) {
      console.error('Error accessing media devices:', err)
      setError('Could not access camera or microphone. Please ensure permissions are granted.')
    }
  }

  const stopLocalStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }
  }

  const toggleMic = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => (track.enabled = !track.enabled))
      setMicEnabled(prev => !prev)
    }
  }

  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach(track => (track.enabled = !track.enabled))
      setCameraEnabled(prev => !prev)
    }
  }

  const startInterview = async () => {
    setLoading(true)
    setError('')
    setFeedback(null)
    setInterviewActive(true)
    setInterviewStarted(true)
    await startLocalStream()

    // Mock AI response after a delay
    setTimeout(() => {
      setLoading(false)
      // Simulate AI starting to speak
      if (aiVideoRef.current) {
        // In a real app, this would be a video stream from AI
        // For now, we can just show a placeholder or a static image
        // aiVideoRef.current.src = '/path/to/ai-speaking-video.mp4'
        // aiVideoRef.current.play()
      }
      // Simulate first question
      setMessages(prev => [...prev, { id: prev.length + 1, sender: 'ai', text: 'Hello! Welcome to your mock interview. Let\'s start with a common question: Tell me about yourself.' }])
    }, 3000)
  }

  const endInterview = async () => {
    setLoading(true)
    setError('')
    stopLocalStream()
    setInterviewActive(false)

    // Mock feedback generation
    setTimeout(() => {
      setFeedback({
        score: Math.floor(Math.random() * 10) + 1,
        feedback: 'Overall, your communication was clear, and your answers were well-structured. Focus on maintaining consistent eye contact and varying your speaking pace to keep the interviewer engaged.',
        eyeContact: 'Good, but occasionally looked away.',
        speakingPace: 'Slightly fast at times, try to moderate.',
        bodyLanguage: 'Confident posture, but some fidgeting observed.'
      })
      setLoading(false)
    }, 2000)
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
    if (score >= 8) return 'Excellent performance! You demonstrated strong communication skills.'
    if (score >= 6) return 'Good effort! Some areas for improvement identified.'
    return 'Needs significant practice. Focus on core communication elements.'
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Live Video Interview
                <Sparkles className="inline h-6 w-6 text-yellow-400 ml-2 animate-pulse" />
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!interviewStarted ? (
          <div className={`${isVisible ? 'animate-bounce-in' : 'opacity-0'}`}>
            {/* Start Interview Screen */}
            <div className="card-hover bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg pulse-glow">
                  <Video className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  Start Your Video Interview
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Experience a realistic video interview with AI analysis of your communication and presentation skills.
                </p>
                <button
                  onClick={startInterview}
                  disabled={loading}
                  className="btn-gradient text-white px-10 py-4 rounded-xl text-xl font-bold shadow-2xl hover:shadow-3xl transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center group"
                >
                  {loading ? (
                    <>
                      <div className="spinner-gradient h-6 w-6 mr-3"></div>
                      Starting Interview...
                    </>
                  ) : (
                    <>
                      <Play className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                      Start Video Interview
                      <Zap className="ml-3 h-6 w-6 group-hover:animate-spin" />
                    </>
                  )}
                </button>
                {error && (
                  <div className="notification-error rounded-xl p-4 text-center font-medium animate-bounce-in mt-4">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : feedback ? (
          <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            {/* Feedback Screen */}
            <div className="card-hover bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Interview Feedback</h2>
                <p className="text-gray-600">Your video interview performance summary</p>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
                  <h3 className="font-bold text-gray-800 mb-1">Eye Contact</h3>
                  <p className="text-gray-600">{feedback.eyeContact}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-green-500">
                  <h3 className="font-bold text-gray-800 mb-1">Speaking Pace</h3>
                  <p className="text-gray-600">{feedback.speakingPace}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-purple-500">
                  <h3 className="font-bold text-gray-800 mb-1">Body Language</h3>
                  <p className="text-gray-600">{feedback.bodyLanguage}</p>
                </div>
              </div>

              <div className="prose max-w-none mb-8">
                <div className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
                  <h3 className="font-bold text-gray-800 mb-2">Detailed Feedback:</h3>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                    {feedback.feedback}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setInterviewStarted(false)
                    setFeedback(null)
                    setError('')
                  }}
                  className="btn-gradient text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 inline-flex items-center group"
                >
                  <RefreshCcw className="mr-2 h-5 w-5 group-hover:animate-spin" />
                  Try Another Interview
                </button>
                <Link
                  href="/history"
                  className="btn-secondary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 inline-flex items-center group"
                >
                  <Clock className="mr-2 h-5 w-5 group-hover:animate-spin" />
                  View History
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className={`${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            {/* Active Interview Screen */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 card-hover bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Interview</h2>
                <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4">
                  <video ref={userVideoRef} autoPlay muted playsInline className="w-full h-full object-cover"></video>
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">You</div>
                </div>
                <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden">
                  <video ref={aiVideoRef} autoPlay muted playsInline className="w-full h-full object-cover"></video>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xl font-medium">
                    {loading ? (
                      <div className="spinner-gradient h-10 w-10"></div>
                    ) : (
                      'AI Interviewer is ready...' // Placeholder for AI video feed
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={toggleMic}
                    className={`p-3 rounded-full shadow-lg transition-all duration-300 ${micEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'} text-white icon-hover`}
                  >
                    {micEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                  </button>
                  <button
                    onClick={toggleCamera}
                    className={`p-3 rounded-full shadow-lg transition-all duration-300 ${cameraEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'} text-white icon-hover`}
                  >
                    {cameraEnabled ? <Camera className="h-6 w-6" /> : <CameraOff className="h-6 w-6" />}
                  </button>
                  <button
                    onClick={endInterview}
                    disabled={loading}
                    className="btn-danger text-white px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform transition-all duration-300 inline-flex items-center group"
                  >
                    <StopCircle className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                    End Interview
                  </button>
                </div>
              </div>

              <div className="lg:col-span-1 card-hover bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20 flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Feedback & Questions</h2>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[90%] p-3 rounded-xl shadow-sm ${msg.sender === 'user'
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
                      <div className="max-w-[90%] p-3 rounded-xl shadow-sm bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800 animate-pulse">
                        AI is thinking...
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <textarea
                    placeholder="Type your answer here..."
                    rows={3}
                    className="form-input-enhanced w-full rounded-xl py-2 px-3 text-lg focus:ring-purple-500 focus:border-purple-500"
                    disabled={loading}
                  ></textarea>
                  <button
                    className="btn-gradient w-full mt-2 px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center group"
                    disabled={loading}
                  >
                    <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    Send Answer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

