import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search, Star, MapPin, Wifi, Car, SlidersHorizontal, Loader2,
  Coffee, Dumbbell, Waves
} from 'lucide-react'
import { getHotelsApi } from '../api/hotelApi'
import toast from 'react-hot-toast'

interface Hotel {
  _id: string
  name: string
  city: string
  state: string
  region: string
  address: string
  rating: number
  reviews: number
  pricePerNight: { economy: number; premium: number }
  amenities: string[]
  images: string[]
  description: string
  type: 'budget' | 'mid-range' | 'luxury'
  tags: string[]
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-3 h-3" />,
  'Pool': <Waves className="w-3 h-3" />,
  'Gym': <Dumbbell className="w-3 h-3" />,
  'Parking': <Car className="w-3 h-3" />,
  'Restaurant': <Coffee className="w-3 h-3" />,
}

const typeColors = {
  budget: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'mid-range': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  luxury: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

const typeLabels = {
  budget: 'Budget',
  'mid-range': 'Mid-range',
  luxury: 'Luxury',
}

const HotelSearch = () => {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All')
  const [type, setType] = useState('All')
  const [maxPrice, setMaxPrice] = useState(60000)
  const [minRating, setMinRating] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true)
        const res = await getHotelsApi({ page: 1 })
        setHotels(res.hotels)
      } catch {
        toast.error('Failed to load hotels')
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [])

  const filtered = useMemo(() => {
    return hotels.filter(h => {
      const matchSearch =
        !search ||
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.city.toLowerCase().includes(search.toLowerCase()) ||
        h.state.toLowerCase().includes(search.toLowerCase())
      const matchRegion = region === 'All' || h.region === region
      const matchType = type === 'All' || h.type === type
      const matchPrice = h.pricePerNight.economy <= maxPrice
      const matchRating = h.rating >= minRating
      return matchSearch && matchRegion && matchType && matchPrice && matchRating
    })
  }, [hotels, search, region, type, maxPrice, minRating])

  const regions = ['All', 'North India', 'South India', 'East India', 'West India']
  const types = ['All', 'budget', 'mid-range', 'luxury']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">

      {/* Header */}
      <div className="bg-navy dark:bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl mb-2">
              Find <span className="text-accent">Hotels</span>
            </h1>
            <p className="text-gray-300 text-base max-w-xl">
              Handpicked hotels across India — from budget stays to luxury palaces.
            </p>
          </motion.div>

          {/* Search bar */}
          <div className="mt-6 flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search hotel, city or state..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${showFilters
                ? 'bg-brand border-brand text-white'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div>
                <label className="text-xs text-gray-400 block mb-1">Region</label>
                <select
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-brand"
                >
                  {regions.map(r => (
                    <option key={r} value={r} className="text-navy bg-white">{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Hotel Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:border-brand"
                >
                  {types.map(t => (
                    <option key={t} value={t} className="text-navy bg-white capitalize">{t === 'All' ? 'All Types' : typeLabels[t as keyof typeof typeLabels]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Max Price: ₹{maxPrice.toLocaleString('en-IN')}/night
                </label>
                <input
                  type="range"
                  min={500}
                  max={60000}
                  step={500}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Min Rating: {minRating > 0 ? `${minRating}+` : 'Any'}
                </label>
                <input
                  type="range"
                  min={0}
                  max={4.5}
                  step={0.5}
                  value={minRating}
                  onChange={e => setMinRating(Number(e.target.value))}
                  className="w-full accent-brand"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {loading ? 'Loading...' : `${filtered.length} hotels found`}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">No hotels found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((hotel, i) => (
              <motion.div
                key={hotel._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.07 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeColors[hotel.type]}`}>
                      {typeLabels[hotel.type]}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-accent text-accent" />
                    {hotel.rating}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-serif text-lg text-navy dark:text-white mb-1">
                    {hotel.name}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin className="w-3 h-3" />
                    {hotel.city}, {hotel.state}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3 flex-1">
                    {hotel.description}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hotel.amenities.slice(0, 4).map(amenity => (
                      <span
                        key={amenity}
                        className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full"
                      >
                        {amenityIcons[amenity] || null}
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <span className="text-xs text-gray-400">+{hotel.amenities.length - 4}</span>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="text-xs text-gray-400">From</p>
                      <p className="text-navy dark:text-white font-semibold">
                        ₹{hotel.pricePerNight.economy.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-gray-400">/night</span>
                      </p>
                    </div>
                    <Link
                      to={`/hotels/${hotel._id}`}
                      className="px-4 py-2 bg-brand/10 dark:bg-brand/20 hover:bg-brand text-brand hover:text-white dark:text-blue-400 dark:hover:text-white rounded-xl text-sm font-medium transition-all duration-200"
                    >
                      View Hotel
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HotelSearch