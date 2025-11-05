'use client'

import { useSearchParams } from "next/navigation";
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
  Award,
  TrendingUp,
  XCircle,
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

export default function TextInterviewPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "general";
  const count = searchParams.get("count") ?? "6";

  const { user, token } = useAuth()
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewId, setInterviewId] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
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

  // ✅ START INTERVIEW
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
        body: JSON.stringify({ category, count }),
      })

      const data = await response.json()
      if (response.ok && data.firstQuestion) {
        setInterviewId(data.interviewId)
        setInterviewStarted(true)
        setCurrentQuestion(data.firstQuestion) // ✅ store active question
        setMessages([
          { id: Date.now(), sender: 'ai', text: data.firstQuestion.questionText }
        ])
      } else {
        setError(data.error || 'Failed to start interview')
      }
    } catch (err) {
      setError('An error occurred while starting the interview.')
    } finally {
      setLoading(false)
    }
  }

  // ✅ SEND USER ANSWER
  const sendMessage = async () => {
    if (!input.trim() || !interviewId || !currentQuestion) return;

    const userMessage = input.trim();

    // Show user's message
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/interview/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          interviewId,
          questionId: currentQuestion.id, // ✅ correct question reference
          answer: userMessage
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(data.error || 'Failed to get AI response');
        return;
      }

      // ✅ Show AI feedback
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'ai', text: data.evaluation.feedback }
      ]);

      // ✅ If interview is completed
      if (data.completed) {
        setMessages(prev => [
          ...prev,
          { id: Date.now(), sender: 'ai', text: `✅ Interview Completed! Final Score: ${data.finalScore.toFixed(2)}` }
        ]);
        setFeedback(data.evaluation);
        setInterviewStarted(false);
        return;
      }

      // ✅ Move to next question
      setCurrentQuestion(data.nextQuestion);

      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'ai', text: data.nextQuestion.questionText }
      ]);

    } catch (err) {
      setLoading(false);
      setError('An error occurred while sending your answer.');
    }
  }

  // ✅ Feedback UI Helpers
  const getScoreColor = (score: number) =>
    score >= 8 ? 'text-green-600' : score >= 6 ? 'text-yellow-600' : 'text-red-600'

  const getScoreBackground = (score: number) =>
    score >= 8 ? 'bg-gradient-to-r from-green-400 to-green-600' :
    score >= 6 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                 'bg-gradient-to-r from-red-400 to-red-600'

  const getScoreMessage = (score: number) =>
    score >= 8 ? 'Outstanding! Your responses were highly effective.' :
    score >= 6 ? 'Good effort! With some refinement, you can excel.' :
                 'Keep practicing! Focus on structuring your answers.'

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">

      {/* HEADER */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
          <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 transition-all duration-300">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Dashboard
          </Link>
          <h1 className="ml-8 text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            AI Interview Chatbot <Sparkles className="inline h-6 w-6 text-yellow-400 ml-2 animate-pulse" />
          </h1>
        </div>
      </header>

      {/* MAIN */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {!interviewStarted && !feedback ? (
          <div className="card-hover bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
            <MessageSquare className="mx-auto h-20 w-20 text-green-600 mb-4" />
            <h2 className="text-3xl font-bold mb-4">Start Your Text Interview</h2>
            <button
              onClick={startInterview}
              disabled={loading}
              className="btn-success px-10 py-4 rounded-xl text-xl font-bold text-white shadow-lg hover:scale-105 transition-transform"
            >
              {loading ? "Starting Interview..." : <> <Zap className="inline mr-2" /> Start Interview </>}
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-[70vh]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-xl border">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-xl shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                      : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-gray-600">AI is typing...</div>
              )}
            </div>

            {!feedback && (
              <div className="flex mt-4">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 rounded-xl py-3 px-4 border text-lg"
                  placeholder="Type your answer..."
                />
                <button onClick={sendMessage} className="btn-success ml-4 px-6 py-3 rounded-xl text-white font-bold">
                  <Send className="inline-block mr-2" /> Send
                </button>
              </div>
            )}

            {feedback && (
              <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-3">Interview Feedback</h3>
                <div className={`p-6 rounded-xl text-white text-center ${getScoreBackground(feedback.score)}`}>
                  <div className="text-5xl font-bold">{feedback.score}/10</div>
                  <p className="mt-2 text-lg">{getScoreMessage(feedback.score)}</p>
                </div>

                <p className="mt-4 text-gray-800 whitespace-pre-wrap text-lg">{feedback.feedback}</p>

                <button onClick={startInterview} className="btn-success mt-6 px-6 py-3 rounded-xl text-white font-bold">
                  Start New Interview
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
