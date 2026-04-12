import { Router } from 'express'
import { getHotels, getHotelById, getHotelsByCity } from '../controllers/hotelController'

const router = Router()

router.get('/', getHotels)
router.get('/city/:city', getHotelsByCity)
router.get('/:id', getHotelById)

export default router