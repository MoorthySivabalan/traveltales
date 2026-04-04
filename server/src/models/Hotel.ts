import mongoose, { Schema, Document } from 'mongoose'

export interface IHotel extends Document {
  name: string
  city: string
  state: string
  region: string
  address: string
  rating: number
  reviews: number
  pricePerNight: {
    economy: number
    premium: number
  }
  amenities: string[]
  images: string[]
  description: string
  coordinates: { lat: number; lng: number }
  type: 'budget' | 'mid-range' | 'luxury'
  tags: string[]
}

const HotelSchema = new Schema<IHotel>(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    region: { type: String, required: true },
    address: { type: String, required: true },
    rating: { type: Number, required: true },
    reviews: { type: Number, default: 0 },
    pricePerNight: {
      economy: { type: Number, required: true },
      premium: { type: Number, required: true },
    },
    amenities: [{ type: String }],
    images: [{ type: String }],
    description: { type: String, default: '' },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    type: { type: String, enum: ['budget', 'mid-range', 'luxury'], default: 'mid-range' },
    tags: [{ type: String }],
  },
  { timestamps: true }
)

export default mongoose.model<IHotel>('Hotel', HotelSchema)