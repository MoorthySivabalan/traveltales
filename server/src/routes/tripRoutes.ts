import { Router } from 'express'
import {
  getUserTrips, createTrip, updateTrip,
  deleteTrip, getTripById
} from '../controllers/tripController'
import { protect } from '../middlewares/authMiddleware'

const router = Router()

router.use(protect)

router.get('/', getUserTrips)
router.post('/', createTrip)
router.get('/:id', getTripById)
router.put('/:id', updateTrip)
router.delete('/:id', deleteTrip)

export default router