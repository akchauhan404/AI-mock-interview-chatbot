import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

// Mock AI evaluation function (replace with OpenAI API call)
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Real AI-based evaluation function
async function evaluateAnswer(question: string, answer: string): Promise<{ score: number; feedback: string }> {
  try {
    const prompt = `
You are an expert AI interviewer evaluating a candidate's response to a technical question.

Question:
${question}

Candidate's Answer:
${answer}

Please analyze the response and provide:
1. A total score from 0–10 (based on correctness, clarity, technical depth, and communication)
2. A 3–5 sentence constructive feedback explaining strengths and improvements.
Return output in strict JSON format:
{
  "score": <number>,
  "feedback": "<text>"
}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert technical interviewer and evaluator." },
        { role: "user", content: prompt }
      ],
      temperature: 0.4
    })

    const text = completion.choices[0].message?.content?.trim() || ""
    const jsonMatch = text.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      console.warn("AI did not return valid JSON, fallback triggered:", text)
      return { score: 6, feedback: "AI could not evaluate properly. Please try again." }
    }

    const parsed = JSON.parse(jsonMatch[0])
    return {
      score: parsed.score || 6,
      feedback: parsed.feedback || "Good response with room for improvement."
    }

  } catch (error) {
    console.error("OpenAI evaluation error:", error)
    // fallback
    return {
      score: 5,
      feedback: "Temporary issue with AI evaluation. Default feedback applied."
    }
  }
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
