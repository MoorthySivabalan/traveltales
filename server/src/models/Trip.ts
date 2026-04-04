import mongoose, { Schema, Document } from 'mongoose'

interface IDayPlan {
  day: number
  title: string
  description: string
}

export interface ITrip extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  caption: string
  state: string
  region: string
  duration: number
  image: string
  attractions: string[]
  itinerary: string[]
  tier: 'economy' | 'premium'
  pricing: {
    economy: { hotel: string; transport: string }
    premium: { hotel: string; transport: string }
  }
  tags: string[]
  isCustom: boolean
  sourcePackageId: number | null
  travelDate: Date | null
  travellers: number
  notes: string
  createdAt: Date
  updatedAt: Date
}

const TripSchema = new Schema<ITrip>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    caption: { type: String, default: '' },
    state: { type: String, required: true },
    region: { type: String, default: '' },
    duration: { type: Number, required: true },
    image: { type: String, default: '' },
    attractions: [{ type: String }],
    itinerary: [{ type: String }],
    tier: { type: String, enum: ['economy', 'premium'], default: 'economy' },
    pricing: {
      economy: { hotel: String, transport: String },
      premium: { hotel: String, transport: String },
    },
    tags: [{ type: String }],
    isCustom: { type: Boolean, default: false },
    sourcePackageId: { type: Number, default: null },
    travelDate: { type: Date, default: null },
    travellers: { type: Number, default: 2 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model<ITrip>('Trip', TripSchema)