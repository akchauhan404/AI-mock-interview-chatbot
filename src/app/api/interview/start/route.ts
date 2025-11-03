import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

// Mock question bank - in production, this would be more sophisticated
const questionBank = [
  {
    question: "Tell me about yourself and your background.",
    category: "behavioral",
    difficulty: "easy"
  },
  {
    question: "What are your greatest strengths and how do they apply to this role?",
    category: "behavioral",
    difficulty: "easy"
  },
  {
    question: "Describe a challenging project you worked on and how you overcame obstacles.",
    category: "behavioral",
    difficulty: "medium"
  },
  {
    question: "Where do you see yourself in 5 years?",
    category: "behavioral",
    difficulty: "easy"
  },
  {
    question: "How do you handle working under pressure and tight deadlines?",
    category: "behavioral",
    difficulty: "medium"
  },
  {
    question: "Describe a time when you had to work with a difficult team member.",
    category: "behavioral",
    difficulty: "medium"
  },
  {
    question: "What motivates you in your work?",
    category: "behavioral",
    difficulty: "easy"
  },
  {
    question: "Tell me about a time you failed and what you learned from it.",
    category: "behavioral",
    difficulty: "medium"
  },
  {
    question: "How do you prioritize tasks when you have multiple deadlines?",
    category: "behavioral",
    difficulty: "medium"
  },
  {
    question: "Why are you interested in this position and our company?",
    category: "behavioral",
    difficulty: "easy"
  }
]

function selectQuestions(count: number = 5): typeof questionBank {
  // Shuffle and select random questions
  const shuffled = [...questionBank].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { type = 'text', questionCount = 5 } = await request.json()

    // Select questions for the interview
    const selectedQuestions = selectQuestions(questionCount)

    // Create interview session
    const interview = await prisma.interview.create({
      data: {
        userId: decoded.userId,
        type,
        status: 'active',
        currentQuestion: 0,
        totalQuestions: selectedQuestions.length
      }
    })

    // Create interview questions
    const questionPromises = selectedQuestions.map((q, index) =>
      prisma.interviewQuestion.create({
        data: {
          interviewId: interview.id,
          questionText: q.question,
          category: q.category,
          order: index
        }
      })
    )

    await Promise.all(questionPromises)

    // Get the first question
    const firstQuestion = await prisma.interviewQuestion.findFirst({
      where: {
        interviewId: interview.id,
        order: 0
      }
    })

    return NextResponse.json({
      interviewId: interview.id,
      currentQuestion: 0,
      totalQuestions: selectedQuestions.length,
      question: firstQuestion
    })

  } catch (error) {
    console.error('Start interview error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
