import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, MapPin, Calendar, Users,
  Shield, CreditCard, CheckCircle, Loader2,
  Hotel, Package
} from 'lucide-react'
import { createOrderApi, verifyPaymentApi } from '../api/paymentApi'
import { useAuthStore } from '../store/authStore'
import { defaultPackages } from '../data/packagesData'
import toast from 'react-hot-toast'

declare global {
  interface Window { Razorpay: any }
}

const Checkout = () => {
  const { type, id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(false)

  // Package checkout params
  const tier = (searchParams.get('tier') || 'economy') as 'economy' | 'premium'
  const travellers = parseInt(searchParams.get('travellers') || '2')
  const days = parseInt(searchParams.get('days') || '1')

  // Hotel checkout params
  const checkIn = searchParams.get('checkin') || ''
  const checkOut = searchParams.get('checkout') || ''
  const nights = parseInt(searchParams.get('nights') || '1')
  const guests = parseInt(searchParams.get('guests') || '2')
  const totalParam = parseInt(searchParams.get('total') || '0')

  const isHotel = type === 'hotel'

  // Get package data if package checkout
  const pkg = !isHotel ? defaultPackages.find(p => p.id === Number(id)) : null

  // Calculate amounts
  const getPackageAmount = () => {
    if (!pkg) return 0
    const pricing = pkg.pricing[tier]
    const rooms = Math.ceil(travellers / 2)
    const hotelCost = parseInt(pricing.hotel.replace(/[^0-9]/g, '')) * days * rooms
    const transportCost = parseInt(pricing.transport.replace(/[^0-9]/g, '')) * days
    return hotelCost + transportCost
  }

  const baseAmount = isHotel ? Math.round(totalParam / 1.18) : getPackageAmount()
  const gst = Math.round(baseAmount * 0.18)
  const totalAmount = baseAmount + gst

  const loadRazorpay = () => {
    return new Promise(resolve => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login first')
      navigate('/login')
      return
    }

    const loaded = await loadRazorpay()
    if (!loaded) {
      toast.error('Failed to load payment gateway')
      return
    }

    try {
      setLoading(true)

      const orderData = await createOrderApi({
        type: isHotel ? 'hotel' : 'package',
        packageId: !isHotel ? Number(id) : undefined,
        hotelId: isHotel ? id : undefined,
        hotelName: isHotel ? searchParams.get('name') || 'Hotel' : undefined,
        packageName: !isHotel ? pkg?.name : undefined,
        tier, travellers: isHotel ? guests : travellers,
        days: isHotel ? nights : days,
        checkIn, checkOut,
        amount: baseAmount, gst, totalAmount,
      })

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'TravelTales',
        description: isHotel ? 'Hotel Booking' : `${pkg?.name} Package`,
        order_id: orderData.orderId,
        prefill: {
          name: user.fullName,
          email: user.email,
        },
        theme: { color: '#2563eb' },
        handler: async (response: any) => {
          try {
            await verifyPaymentApi({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId: orderData.bookingId,
            })
            setPaid(true)
            toast.success('Payment successful! 🎉')
          } catch {
            toast.error('Payment verification failed')
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            toast.error('Payment cancelled')
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error('Failed to initiate payment')
    } finally {
      setLoading(false)
    }
  }

  if (paid) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="font-serif text-2xl text-navy dark:text-white mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Your payment of ₹{totalAmount.toLocaleString('en-IN')} was successful.
            A confirmation has been sent to {user?.email}.
          </p>
          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="flex-1 py-2.5 bg-brand hover:bg-navy text-white rounded-xl text-sm font-medium transition-colors text-center"
            >
              My Trips
            </Link>
            <Link
              to="/explore"
              className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors text-center hover:border-brand hover:text-brand"
            >
              Explore More
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">

      {/* Header */}
      <div className="bg-navy dark:bg-gray-900 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-gray-400 text-xs">Secure Checkout</p>
            <h1 className="font-serif text-2xl">Complete Your Booking</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Order Summary */}
          <div className="lg:col-span-3 space-y-5">

            {/* Booking Details */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-serif text-xl text-navy dark:text-white mb-4">
                Booking Summary
              </h2>

              <div className="flex items-start gap-4 mb-5 pb-5 border-b border-gray-100 dark:border-gray-800">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isHotel ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-brand/10 dark:bg-brand/20'
                }`}>
                  {isHotel
                    ? <Hotel className="w-6 h-6 text-purple-500" />
                    : <Package className="w-6 h-6 text-brand" />
                  }
                </div>
                <div>
                  <p className="font-medium text-navy dark:text-white">
                    {isHotel ? searchParams.get('name') || 'Hotel Booking' : pkg?.name}
                  </p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">
                    {isHotel ? 'Hotel Booking' : 'Travel Package'} · {tier}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                {isHotel ? (
                  <>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 text-brand" />
                      <span>Check-in: {checkIn}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 text-brand" />
                      <span>Check-out: {checkOut}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4 text-brand" />
                      <span>{guests} Guests · {nights} Nights</span>
                    </div>
                  </>
                ) : (
                  <>
                    {pkg && (
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 text-brand" />
                        <span>{pkg.state} · {days} Days</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4 text-brand" />
                      <span>{travellers} Travellers</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Guest Details */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
              <h2 className="font-serif text-xl text-navy dark:text-white mb-4">
                Guest Details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name</span>
                  <span className="text-navy dark:text-white font-medium">{user?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span className="text-navy dark:text-white">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown + Pay */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="font-serif text-xl text-navy dark:text-white mb-5">
                Price Details
              </h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Base Amount</span>
                  <span>₹{baseAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>GST (18%)</span>
                  <span>₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-semibold text-navy dark:text-white pt-3 border-t border-gray-100 dark:border-gray-800 text-lg">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-brand hover:bg-navy disabled:opacity-60 text-white rounded-xl font-medium text-base transition-all hover:scale-[1.02]"
              >
                {loading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : <CreditCard className="w-5 h-5" />
                }
                {loading ? 'Processing...' : `Pay ₹${totalAmount.toLocaleString('en-IN')}`}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                Powered by Razorpay · Test Mode
              </p>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-400 text-center mb-2">Test card details:</p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p>Card: 4111 1111 1111 1111</p>
                  <p>Expiry: Any future date</p>
                  <p>CVV: Any 3 digits</p>
                  <p>OTP: 1234</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout