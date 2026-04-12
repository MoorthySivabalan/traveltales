import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `
You are TravelTales AI, an expert Indian travel planner assistant.
You ONLY plan trips inside India.

Return ONLY valid JSON.

Format:
{
  "name": "",
  "caption": "",
  "state": "",
  "region": "",
  "duration": number,
  "attractions": [],
  "itinerary": [],
  "estimatedCost": {
    "economy": { "hotel": "", "transport": "" },
    "premium": { "hotel": "", "transport": "" }
  },
  "tips": []
}
`

export const getChatResponse = async (messages: any[]) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY missing')
    }

    const genAI = new GoogleGenerativeAI(apiKey)

    // ✅ FIXED MODEL (THIS IS THE KEY FIX)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest'
    })

    const lastUserMessage =
      messages.filter(m => m.role === 'user').pop()?.content

    if (!lastUserMessage) {
      return 'Please ask a travel question'
    }

    const prompt = `${SYSTEM_PROMPT}\n\nUser: ${lastUserMessage}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    try {
      return JSON.parse(text)
    } catch {
      return text
    }

  } catch (error: any) {
    console.error('❌ GEMINI ERROR FULL:', error)
    throw new Error('AI service unavailable')
  }
}