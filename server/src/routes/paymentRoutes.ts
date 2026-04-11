import { Router } from 'express'
import {
  createPaymentOrder,
  verifyAndConfirmPayment,
  getUserBookings,
} from '../controllers/paymentController'
import { protect } from '../middlewares/authMiddleware'

const router = Router()

router.use(protect)
router.post('/create-order', createPaymentOrder)
router.post('/verify', verifyAndConfirmPayment)
router.get('/bookings', getUserBookings)

export default router