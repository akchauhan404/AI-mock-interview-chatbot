import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Map UI categories → hint text for prompt (and optional DB category tag)
const CATEGORY_HINT: Record<string, { prompt: string; tag: string }> = {
  communication: {
    prompt:
      "Focus on behavioral and communication scenarios, STAR-style prompts, teamwork, conflict resolution, stakeholder communication.",
    tag: "communication",
  },
  technical: {
    prompt:
      "Focus on systems, web/backend fundamentals, databases, REST/GraphQL, OS/networking basics, CS concepts relevant to software engineering interviews.",
    tag: "technical",
  },
  coding: {
    prompt:
      "Focus on DSA coding interview style (arrays, strings, hash maps, two pointers, sliding window, trees, graphs, DP). Avoid language-specific boilerplate.",
    tag: "coding",
  },
  personality: {
    prompt:
      "Focus on personality, values, motivation, leadership, growth mindset, self-awareness, and culture fit.",
    tag: "personality",
  },
  general: {
    prompt:
      "Mix of common campus placement interview questions for engineering graduates: light technical fundamentals, communication, situational judgement, career intent.",
    tag: "general",
  },
};

const DEFAULT_COUNT = 6;

async function generateQuestionsWithAI(category: string, count = DEFAULT_COUNT) {
  const hint = CATEGORY_HINT[category]?.prompt ?? CATEGORY_HINT.general.prompt;

  const sys =
    "You are an expert interviewer. Return only valid JSON. No commentary.";
  const user = `
Generate ${count} concise interview questions tailored to this theme:

Theme: ${category}
Guidance: ${hint}

Rules:
- Questions should be crisp, unambiguous, and interview-ready.
- Do NOT number questions in the text; we will assign indices.
- Return STRICT JSON array of objects with fields: "questionText".
- Example:
[
  {"questionText":"Explain event loop in JavaScript with an example."},
  {"questionText":"Describe a time you resolved a team conflict."}
]
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.5,
    messages: [
      { role: "system", content: sys },
      { role: "user", content: user },
    ],
  });

  const raw = completion.choices?.[0]?.message?.content?.trim() || "[]";
  // Extract the first JSON array from the response safely
  const json = raw.match(/\[[\s\S]*\]/);
  const parsed = JSON.parse(json ? json[0] : "[]");

  // Normalize → add 0-based order, coerce shape
  const questions: Array<{ questionText: string; order: number; category: string }> =
    parsed
      .filter((q: any) => typeof q?.questionText === "string" && q.questionText.trim().length > 0)
      .slice(0, count)
      .map((q: any, idx: number) => ({
        questionText: String(q.questionText).trim(),
        order: idx, // 0-based because your answer route uses 0..n-1
        category,
      }));

  if (questions.length === 0) {
    throw new Error("AI returned no questions");
  }

  return questions;
}

async function fallbackFromQuestionBank(category: string, count = DEFAULT_COUNT) {
  // Try exact match then fall back to general pool
  const primary = await prisma.questionBank.findMany({
    where: { category: category },
    orderBy: { createdAt: "desc" },
    take: count,
  });

  const pool = primary.length ? primary : await prisma.questionBank.findMany({
    orderBy: { createdAt: "desc" },
    take: count,
  });

  return pool.map((q, idx) => ({
    questionText: q.question,
    order: idx,
    category: q.category ?? category,
  }));
}

export async function POST(request: NextRequest) {
  try {
    // ---- Auth ----
    const token = getTokenFromRequest(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // ---- Inputs ----
    const { category: rawCategory, count } = await request.json().catch(() => ({}));
    const category = (rawCategory || "general").toString().toLowerCase();
    const numQuestions = Math.min(Math.max(Number(count) || DEFAULT_COUNT, 3), 12);

    // ---- Create interview shell first ----
    const interview = await prisma.interview.create({
      data: {
        userId: decoded.userId,
        type: "text",
        status: "active",
        currentQuestion: 0,
        totalQuestions: 0, // set after we know how many questions we inserted
      },
    });

    // ---- Generate questions ----
    let questions: Array<{ questionText: string; order: number; category: string }>;
    try {
      questions = await generateQuestionsWithAI(category, numQuestions);
    } catch (e) {
      console.warn("AI generation failed, using fallback QuestionBank:", e);
      questions = await fallbackFromQuestionBank(category, numQuestions);
    }

    // ---- Persist questions for this interview ----
    await prisma.interviewQuestion.createMany({
      data: questions.map((q) => ({
        interviewId: interview.id,
        questionText: q.questionText,
        category: q.category, // your schema stores a string category
        order: q.order,       // 0-based; your answer route expects this
      })),
    });

    // ---- Update interview with totalQuestions ----
    const updated = await prisma.interview.update({
      where: { id: interview.id },
      data: { totalQuestions: questions.length },
      include: {
        questions: {
          where: { order: 0 },
          take: 1,
        },
      },
    });

    const firstQuestion = updated.questions[0] || null;

    return NextResponse.json({
      interviewId: interview.id,
      firstQuestion,
      totalQuestions: questions.length,
      currentQuestion: 0,
      category,
    });
  } catch (error) {
    console.error("Interview start error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
