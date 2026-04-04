import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes'
import tripRoutes from './routes/tripRoutes'
import aiRoutes from './routes/aiRoutes'
import hotelRoutes from './routes/hotelRoutes'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/hotels', hotelRoutes)

app.get('/', (_req, res) => {
  res.json({ message: 'TravelTales API is running' })
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/trips', tripRoutes)
app.use('/api/v1/ai', aiRoutes)

export default app