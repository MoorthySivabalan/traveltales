import { Response } from 'express'
import type { AuthRequest } from '../middlewares/authMiddleware'
import { getChatResponse } from '../services/aiService'

export const chat = async (req: AuthRequest, res: Response) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages array is required' })
    }

    const reply = await getChatResponse(messages)
    res.json({ reply })
  } catch (err) {
    console.error('AI Error:', err)
    res.status(500).json({ message: 'AI service failed. Try again.' })
  }
}