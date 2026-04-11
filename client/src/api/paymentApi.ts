import axiosInstance from './axiosInstance'

export const createOrderApi = async (data: {
  type: 'package' | 'hotel'
  packageId?: number
  hotelId?: string
  hotelName?: string
  packageName?: string
  tier: string
  travellers: number
  days: number
  checkIn?: string
  checkOut?: string
  amount: number
  gst: number
  totalAmount: number
}) => {
  const res = await axiosInstance.post('/payments/create-order', data)
  return res.data
}

export const verifyPaymentApi = async (data: {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
  bookingId: string
}) => {
  const res = await axiosInstance.post('/payments/verify', data)
  return res.data
}

export const getUserBookingsApi = async () => {
  const res = await axiosInstance.get('/payments/bookings')
  return res.data
}