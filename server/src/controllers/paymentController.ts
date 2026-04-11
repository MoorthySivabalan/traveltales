import { Response } from 'express'
import type { AuthRequest } from '../middlewares/authMiddleware'
import { createOrder, verifyPayment } from '../services/paymentService'
import Booking from '../models/Booking'

export const createPaymentOrder = async (req: AuthRequest, res: Response) => {
  try {
    const {
      type, packageId, hotelId, hotelName, packageName,
      tier, travellers, days, checkIn, checkOut,
      amount, gst, totalAmount,
    } = req.body

    const order = await createOrder(totalAmount)

    const booking = await Booking.create({
      userId: req.userId,
      type, packageId, hotelId, hotelName, packageName,
      tier, travellers, days,
      checkIn: checkIn ? new Date(checkIn) : undefined,
      checkOut: checkOut ? new Date(checkOut) : undefined,
      amount, gst, totalAmount,
      razorpayOrderId: order.id,
      status: 'pending',
    })

    res.json({
      orderId: order.id,
      bookingId: booking._id,
      amount: totalAmount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to create payment order' })
  }
}

export const verifyAndConfirmPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body

    const isValid = verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature)

    if (!isValid) {
      await Booking.findByIdAndUpdate(bookingId, { status: 'failed' })
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'paid', razorpayPaymentId },
      { new: true }
    )

    res.json({ message: 'Payment confirmed!', booking })
  } catch (err) {
    res.status(500).json({ message: 'Payment verification error' })
  }
}

export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json({ bookings })
  } catch {
    res.status(500).json({ message: 'Failed to fetch bookings' })
  }
}