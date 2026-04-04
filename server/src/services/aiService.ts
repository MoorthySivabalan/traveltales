import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are TravelTales AI, an expert Indian travel planner assistant. 
You help users plan trips within India only.

When a user asks for a trip plan, respond with a structured JSON in this exact format:
{
  "name": "Trip name",
  "state": "State name",
  "region": "North India / South India / East India / West India",
  "duration": number of days,
  "caption": "One line description",
  "attractions": ["attraction 1", "attraction 2"],
  "itinerary": ["Day 1: ...", "Day 2: ..."],
  "tips": ["tip 1", "tip 2", "tip 3"],
  "estimatedCost": {
    "economy": { "hotel": "cost info", "transport": "cost info" },
    "premium": { "hotel": "cost info", "transport": "cost info" }
  }
}

Rules:
- Only plan trips within India
- Maximum 15 days for any trip
- Always include practical travel tips
- Keep itinerary entries concise but informative
- If the user asks something unrelated to travel, politely redirect them

For casual conversation or questions, respond normally as a helpful travel assistant without JSON.`

export const getChatResponse = async (
  messages: { role: 'user' | 'assistant'; content: string }[]
) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  // Filter only user/assistant messages and remove leading assistant messages
  const validMessages = messages.filter(m => m.role === 'user' || m.role === 'assistant')

  // Find first user message index
  const firstUserIndex = validMessages.findIndex(m => m.role === 'user')
  if (firstUserIndex === -1) return 'Please ask me something about your trip!'

  // History = everything before the last message, starting from first user message
  const historyMessages = validMessages.slice(firstUserIndex, -1)
  const lastMessage = validMessages[validMessages.length - 1].content

  const history = historyMessages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const chat = model.startChat({ history })
  const result = await chat.sendMessage(lastMessage)
  return result.response.text()
}