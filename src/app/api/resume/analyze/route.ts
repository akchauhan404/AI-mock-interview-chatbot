import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'
// import pdfParse from 'pdf-parse' // Moved to dynamic import to avoid build issues
import mammoth from 'mammoth'

// Mock ATS scoring function (replace with actual implementation)
function calculateATSScore(resumeText: string, jobDescription?: string): number {
  // Simple keyword matching for demonstration
  const commonKeywords = [
    'experience', 'skills', 'education', 'work', 'project', 'team', 'management',
    'leadership', 'communication', 'problem-solving', 'analytical', 'technical'
  ]
  
  const resumeWords = resumeText.toLowerCase().split(/\s+/)
  const matchedKeywords = commonKeywords.filter(keyword => 
    resumeWords.some(word => word.includes(keyword))
  )
  
  return Math.min(100, (matchedKeywords.length / commonKeywords.length) * 100)
}

// Mock AI feedback function (replace with OpenAI API call)
async function generateAIFeedback(resumeText: string): Promise<string> {
  // This would typically call OpenAI API
  // For now, return mock feedback
  return `Based on the analysis of your resume, here are some key observations:

**Strengths:**
- Clear structure and formatting
- Relevant work experience mentioned
- Educational background is present

**Areas for Improvement:**
- Consider adding more quantifiable achievements
- Include relevant technical skills section
- Optimize keywords for ATS compatibility
- Add action verbs to describe accomplishments

**Recommendations:**
- Use bullet points for better readability
- Include metrics and numbers where possible
- Tailor content to specific job requirements
- Ensure consistent formatting throughout`
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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const jobDescription = formData.get('jobDescription') as string

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload PDF or DOCX files only.' 
      }, { status: 400 })
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 })
    }

    let resumeText = ''
    const buffer = Buffer.from(await file.arrayBuffer())

    try {
      if (file.type === 'application/pdf') {
        const pdfParse = (await import('pdf-parse')).default
        const pdfData = await pdfParse(buffer)
        resumeText = pdfData.text
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer })
        resumeText = result.value
      }
    } catch (parseError) {
      console.error('File parsing error:', parseError)
      return NextResponse.json({ 
        error: 'Failed to parse file. Please ensure the file is not corrupted.' 
      }, { status: 400 })
    }

    if (!resumeText.trim()) {
      return NextResponse.json({ 
        error: 'No text content found in the file.' 
      }, { status: 400 })
    }

    // Calculate ATS score
    const atsScore = calculateATSScore(resumeText, jobDescription)

    // Generate AI feedback
    const feedback = await generateAIFeedback(resumeText)

    // Save to database
    const resume = await prisma.resume.create({
      data: {
        userId: decoded.userId,
        filename: `${Date.now()}-${file.name}`,
        originalName: file.name,
        content: resumeText,
        atsScore,
        feedback
      }
    })

    return NextResponse.json({
      id: resume.id,
      atsScore,
      feedback,
      filename: resume.originalName
    })

  } catch (error) {
    console.error('Resume analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
