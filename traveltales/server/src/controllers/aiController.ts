import { Response } from 'express'
import type { AuthRequest } from '../middlewares/authMiddleware'
import { getChatResponse } from '../services/aiService'

export const chat = async (req: AuthRequest, res: Response) => {
  try {
    const { messages } = req.body

    // ✅ Validate input safely
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        message: 'Messages must be a non-empty array'
      })
    }

    // ✅ Get AI response
    const reply = await getChatResponse(messages)

    // ❌ FIX: handle object OR string safely
    if (!reply) {
      return res.status(500).json({
        message: 'Empty response from AI'
      })
    }

    return res.status(200).json({
      reply
    })

  } catch (err: any) {
    console.error('🔥 Controller Error:', err)

    return res.status(500).json({
      message: err?.message || 'AI service failed'
    })
  }
}