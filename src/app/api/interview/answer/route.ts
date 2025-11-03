import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

// Mock AI evaluation function (replace with OpenAI API call)
async function evaluateAnswer(question: string, answer: string): Promise<{ score: number; feedback: string }> {
  // This would typically call OpenAI API
  // For now, return mock evaluation based on answer length and keywords
  
  const answerLength = answer.trim().length
  const hasSpecificExamples = /example|instance|time when|situation|experience/i.test(answer)
  const hasQuantifiableResults = /\d+%|\$\d+|increased|decreased|improved|reduced/i.test(answer)
  
  let score = 5 // Base score
  let feedback = "Thank you for your response. "
  
  if (answerLength < 50) {
    score = 3
    feedback += "Your answer could benefit from more detail and specific examples. "
  } else if (answerLength > 200) {
    score += 2
    feedback += "Good level of detail in your response. "
  }
  
  if (hasSpecificExamples) {
    score += 2
    feedback += "Great use of specific examples to illustrate your points. "
  } else {
    feedback += "Consider adding specific examples to strengthen your answer. "
  }
  
  if (hasQuantifiableResults) {
    score += 1
    feedback += "Excellent use of quantifiable results to demonstrate impact. "
  }
  
  // Cap score at 10
  score = Math.min(10, score)
  
  // Add constructive feedback based on score
  if (score >= 8) {
    feedback += "This is a strong response that demonstrates good self-awareness and communication skills."
  } else if (score >= 6) {
    feedback += "This is a solid response with room for improvement in providing more specific details."
  } else {
    feedback += "Consider expanding your answer with more specific examples and details about your experience."
  }
  
  return { score, feedback }
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

    const { interviewId, questionId, answer } = await request.json()

    if (!interviewId || !questionId || !answer) {
      return NextResponse.json({ 
        error: 'Interview ID, question ID, and answer are required' 
      }, { status: 400 })
    }

    // Verify interview belongs to user
    const interview = await prisma.interview.findFirst({
      where: {
        id: interviewId,
        userId: decoded.userId
      }
    })

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    // Get the question
    const question = await prisma.interviewQuestion.findUnique({
      where: { id: questionId }
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Evaluate the answer
    const evaluation = await evaluateAnswer(question.questionText, answer)

    // Save the answer
    await prisma.interviewAnswer.create({
      data: {
        questionId,
        interviewId,
        answerText: answer,
        score: evaluation.score,
        feedback: evaluation.feedback
      }
    })

    // Update interview progress
    const nextQuestionOrder = interview.currentQuestion + 1
    const isLastQuestion = nextQuestionOrder >= interview.totalQuestions

    if (isLastQuestion) {
      // Calculate overall score
      const allAnswers = await prisma.interviewAnswer.findMany({
        where: { interviewId }
      })
      
      const averageScore = allAnswers.reduce((sum, ans) => sum + (ans.score || 0), 0) / allAnswers.length
      
      await prisma.interview.update({
        where: { id: interviewId },
        data: {
          status: 'completed',
          score: averageScore,
          currentQuestion: nextQuestionOrder
        }
      })

      return NextResponse.json({
        evaluation,
        completed: true,
        finalScore: averageScore
      })
    } else {
      // Get next question
      const nextQuestion = await prisma.interviewQuestion.findFirst({
        where: {
          interviewId,
          order: nextQuestionOrder
        }
      })

      await prisma.interview.update({
        where: { id: interviewId },
        data: { currentQuestion: nextQuestionOrder }
      })

      return NextResponse.json({
        evaluation,
        completed: false,
        nextQuestion,
        currentQuestion: nextQuestionOrder,
        totalQuestions: interview.totalQuestions
      })
    }

  } catch (error) {
    console.error('Answer submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
