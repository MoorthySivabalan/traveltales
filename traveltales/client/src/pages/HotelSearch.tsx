import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Search, SlidersHorizontal, MapPin, Star } from 'lucide-react'
import { getHotelsApi } from '../api/hotelApi'
import toast from 'react-hot-toast'

interface Hotel {
  _id: string
  name: string
  city: string
  state: string
  region: string
  description: string
  rating: number
  pricePerNight: { economy: number; premium: number }
  images: string[]
  amenities: string[]
}

const HotelSearch = () => {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const [search, setSearch] = useState<string>('')
  const [region, setRegion] = useState<string>('All')
  const [maxPrice, setMaxPrice] = useState<number>(60000)
  const [minRating, setMinRating] = useState<number>(0)
  const [showFilters, setShowFilters] = useState<boolean>(false)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true)
        const res = await getHotelsApi()
        setHotels(res?.hotels ?? [])
      } catch (err) {
        console.error(err)
        toast.error('Failed to load hotels')
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [])

  const filteredHotels = useMemo(() => {
    return hotels.filter(h => {
      const matchSearch =
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.city.toLowerCase().includes(search.toLowerCase()) ||
        h.state.toLowerCase().includes(search.toLowerCase())

      const matchRegion = region === 'All' || h.region === region
      const matchPrice = h.pricePerNight.economy <= maxPrice
      const matchRating = h.rating >= minRating

      return matchSearch && matchRegion && matchPrice && matchRating
    })
  }, [hotels, search, region, maxPrice, minRating])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* HEADER */}
      <div className="bg-navy text-white p-8 md:p-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-2">Find Your Perfect Stay</h1>
          <p className="text-gray-300 mb-6">Discover handpicked hotels across India</p>

          <div className="flex flex-col md:flex-row gap-3">
            {/* SEARCH */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, city, or state..."
                className="w-full pl-11 py-3 rounded-xl bg-white/10 text-white border border-white/20 outline-none focus:bg-white/20 transition-all"
              />
            </div>

            {/* FILTER TOGGLE */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                showFilters ? 'bg-brand text-white' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* EXPANDABLE FILTERS */}
          {showFilters && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              {/* Region Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-navy border border-white/20 text-white p-2.5 rounded-lg outline-none focus:border-brand"
                >
                  <option value="All">All Regions</option>
                  <option value="North India">North India</option>
                  <option value="South India">South India</option>
                  <option value="East India">East India</option>
                  <option value="West India">West India</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-gray-300">Max Price (Economy)</label>
                  <span className="text-brand font-bold">₹{maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={60000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand"
                />
              </div>

              {/* Rating Range */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-gray-300">Minimum Rating</label>
                  <span className="text-brand font-bold">{minRating} ★</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.5}
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full accent-brand"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RESULTS SECTION */}
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin w-10 h-10 text-brand mb-4" />
            <p className="text-gray-500">Searching for best hotels...</p>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-navy dark:text-white">No Hotels Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHotels.map((hotel) => (
              <div 
                key={hotel._id} 
                className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={hotel.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={hotel.name}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-bold text-navy">{hotel.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-bold text-lg text-navy dark:text-white line-clamp-1">{hotel.name}</h2>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-brand" />
                    {hotel.city}, {hotel.state}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 h-10">
                    {hotel.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="text-xs text-gray-400">Starting from</p>
                      <p className="text-lg font-bold text-brand">₹{hotel.pricePerNight.economy.toLocaleString()}<span className="text-xs text-gray-500 font-normal">/night</span></p>
                    </div>
                    <Link
                      to={`/hotels/${hotel._id}`}
                      className="px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-brand transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HotelSearch