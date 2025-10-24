import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const MODEL_NAME = 'gemini-1.5-flash'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history } = body as { message: string; history?: Array<{ role: string; content: string }> }

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyA5C6oRo6YcviobxNp-vgPMfMghZmrHCn0'
    const apiKey =  'AIzaSyA5C6oRo6YcviobxNp-vgPMfMghZmrHCn0'
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })

    const systemPreamble = `You are ProPath, an AI career assistant. Provide concise, actionable help for careers, resumes, skills, and learning paths.`
    const recent = (history || []).slice(-6).map(h => `${h.role}: ${h.content}`).join('\n')
    const prompt = `${systemPreamble}\n\n${recent ? `Context:\n${recent}\n\n` : ''}User: ${message}`

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800
      }
    })

    const response = await result.response
    const text = response.text()

    return NextResponse.json({ content: text })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}


