import { Router } from 'express'
import { chat } from '../controllers/aiController'
import { protect } from '../middlewares/authMiddleware'

const router = Router()

router.post('/chat', protect, chat)

export default router