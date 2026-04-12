import mongoose, { Schema, Document } from 'mongoose'

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId
  type: 'package' | 'hotel'
  packageId?: number
  hotelId?: mongoose.Types.ObjectId
  hotelName?: string
  packageName?: string
  tier: 'economy' | 'premium'
  travellers: number
  days: number
  checkIn?: Date
  checkOut?: Date
  amount: number
  gst: number
  totalAmount: number
  razorpayOrderId: string
  razorpayPaymentId?: string
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  createdAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['package', 'hotel'], required: true },
    packageId: { type: Number },
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel' },
    hotelName: { type: String },
    packageName: { type: String },
    tier: { type: String, enum: ['economy', 'premium'], default: 'economy' },
    travellers: { type: Number, default: 2 },
    days: { type: Number, default: 1 },
    checkIn: { type: Date },
    checkOut: { type: Date },
    amount: { type: Number, required: true },
    gst: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

export default mongoose.model<IBooking>('Booking', BookingSchema)