import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Star, Wifi, Wind, Coffee, Waves,
  SlidersHorizontal, Search, X, Hotel, ChevronDown,
  Dumbbell, Car, UtensilsCrossed, Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'

// ─── Types ─────────────────────────────────────────────────────────────────────

type Amenity = 'WiFi' | 'AC' | 'Breakfast' | 'Pool' | 'Gym' | 'Parking' | 'Restaurant'
type PriceTier = 'all' | 'budget' | 'mid' | 'luxury'
type StarFilter = 0 | 3 | 4 | 5

interface HotelData {
  id: number
  name: string
  city: string
  state: string
  stars: number
  rating: number
  reviews: number
  pricePerNight: number
  tier: 'budget' | 'mid' | 'luxury'
  amenities: Amenity[]
  image: string
  tag?: string
  tagColor?: string
  description: string
}

// ─── Mock Hotel Data ────────────────────────────────────────────────────────────
// 🔁 BACKEND SWAP: replace with GET /api/v1/hotels?city=...&tier=...&stars=...

const HOTELS: HotelData[] = [
  // Rajasthan
  {
    id: 1, name: 'The Raj Palace', city: 'Jaipur', state: 'Rajasthan',
    stars: 5, rating: 4.9, reviews: 312, pricePerNight: 8500, tier: 'luxury',
    amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Parking'],
    image: '/images/Rajasthan trip 1.jpg', tag: 'Top Rated', tagColor: 'bg-amber-500',
    description: 'A converted 18th-century palace offering regal rooms, royal dining, and rooftop views of Jaipur.',
  },
  {
    id: 2, name: 'Hotel Arya Niwas', city: 'Jaipur', state: 'Rajasthan',
    stars: 3, rating: 4.3, reviews: 187, pricePerNight: 1800, tier: 'budget',
    amenities: ['WiFi', 'AC', 'Breakfast', 'Parking'],
    image: '/images/Rajasthan trip 1.jpg',
    description: 'Clean, comfortable heritage-style hotel in the heart of Jaipur near Hawa Mahal.',
  },
  {
    id: 3, name: 'Umaid Bhawan Heritage', city: 'Jodhpur', state: 'Rajasthan',
    stars: 4, rating: 4.7, reviews: 224, pricePerNight: 5200, tier: 'mid',
    amenities: ['WiFi', 'AC', 'Breakfast', 'Pool', 'Restaurant'],
    image: '/images/rajasthan 2.jpg', tag: 'Popular', tagColor: 'bg-brand',
    description: 'Elegant heritage property at the foot of Mehrangarh Fort with stunning Blue City views.',
  },
  {
    id: 4, name: 'Desert Haveli Camp', city: 'Jaisalmer', state: 'Rajasthan',
    stars: 4, rating: 4.6, reviews: 145, pricePerNight: 3800, tier: 'mid',
    amenities: ['WiFi', 'AC', 'Breakfast', 'Restaurant'],
    image: '/images/rajasthan 2.jpg',
    description: 'Luxury tent camp at the edge of Sam Sand Dunes with camel rides and stargazing.',
  },

  // Kashmir
  {
    id: 5, name: 'Houseboat Grand Palace', city: 'Srinagar', state: 'Jammu & Kashmir',
    stars: 4, rating: 4.8, reviews: 276, pricePerNight: 4500, tier: 'mid',
    amenities: ['WiFi', 'AC', 'Breakfast', 'Restaurant'],
    image: '/images/Kashmir .jpg', tag: 'Unique Stay', tagColor: 'bg-emerald-500',
    description: 'A beautifully carved walnut-wood houseboat on Dal Lake with traditional Kashmiri hospitality.',
  },
  {
    id: 6, name: 'The Khyber Himalayan Resort', city: 'Gulmarg', state: 'Jammu & Kashmir',
    stars: 5, rating: 4.9, reviews: 198, pricePerNight: 11000, tier: 'luxury',
    amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Parking'],
    image: '/images/Kashmir .jpg', tag: 'Luxury Pick', tagColor: 'bg-purple-500',
    description: 'Ski-in ski-out five-star resort perched at 8,825 ft with panoramic Himalayan views.',
  },
  {
    id: 7, name: 'Hotel Pine Palace', city: 'Pahalgam', state: 'Jammu & Kashmir',
    stars: 3, rating: 4.2, reviews: 134, pricePerNight: 2200, tier: 'budget',
    amenities: ['WiFi', 'AC', 'Breakfast', 'Parking'],
    image: '/images/Kashmir .jpg',
    description: 'Cozy mountain lodge in Pahalgam surrounded by pine forests and the Lidder River.',
  },

  // Kerala
  {
    id: 8, name: 'Kumarakom Lake Resort', city: 'Alleppey', state: 'Kerala',
    stars: 5, rating: 4.9, reviews: 341, pricePerNight: 9800, tier: 'luxury',
    amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Parking'],
    image: '/images/kerala.jpg', tag: 'Best in Kerala', tagColor: 'bg-emerald-600',
    description: 'Award-winning heritage resort spread across 25 acres on the Vembanad Lake backwaters.',
  },
  {
    id: 9, name: 'Spice Village Resort', city: 'Munnar', state: 'Kerala',
    stars: 4, rating: 4.6, reviews: 212, pricePerNight: 5500, tier: 'mid',
    amenities: ['WiFi', 'Breakfast', 'Restaurant', 'Parking'],
    image: '/images/kerala.jpg', tag: 'Eco Stay', tagColor: 'bg-green-500',
    description: 'Eco-resort with tribal-style cottages nestled in a cardamom and pepper plantation.',
  },
  {
    id: 10, name: 'Fort House Hotel', city: 'Kochi', state: 'Kerala',
    stars: 3, rating: 4.4, reviews: 189, pricePerNight: 2800, tier: 'budget',
    amenities: ['WiFi', 'AC', 'Breakfast'],
    image: '/images/kerala.jpg',
    description: 'Charming boutique hotel in Fort Kochi, steps away from the famous Chinese fishing nets.',
  },

  // Himachal
  {
    id: 11, name: 'Wildflower Hall', city: 'Shimla', state: 'Himachal Pradesh',
    stars: 5, rating: 4.8, reviews: 267, pricePerNight: 12500, tier: 'luxury',
    amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Parking'],
    image: '/images/himachal.jpg', tag: 'Heritage Luxury', tagColor: 'bg-amber-500',
    description: 'Former residence of Lord Kitchener, offering breathtaking cedar forest and mountain views.',
  },
  {
    id: 12, name: 'Snow Valley Resort', city: 'Manali', state: 'Himachal Pradesh',
    stars: 3, rating: 4.1, reviews: 156, pricePerNight: 2000, tier: 'budget',
    amenities: ['WiFi', 'AC', 'Breakfast', 'Parking'],
    image: '/images/himachal.jpg',
    description: 'Budget-friendly mountain resort near Old Manali with Beas River views.',
  },

  // Uttarakhand
  {
    id: 13, name: 'Ananda in the Himalayas', city: 'Rishikesh', state: 'Uttarakhand',
    stars: 5, rating: 4.9, reviews: 298, pricePerNight: 15000, tier: 'luxury',
    amenities: ['WiFi', 'AC', 'Pool', 'Gym', 'Restaurant', 'Parking'],
    image: '/images/Uttarakhand 1.jpg', tag: 'Wellness Retreat', tagColor: 'bg-teal-500',
    description: 'World-renowned luxury spa resort in a former Maharaja\'s palace above the Ganges.',
  },
  {
    id: 14, name: 'Zostel Rishikesh', city: 'Rishikesh', state: 'Uttarakhand',
    stars: 3, rating: 4.3, reviews: 423, pricePerNight: 700, tier: 'budget',
    amenities: ['WiFi', 'Parking'],
    image: '/images/Uttarakhand 1.jpg', tag: 'Budget Favourite', tagColor: 'bg-orange-500',
    description: 'Vibrant backpacker hostel with Ganga views, rooftop yoga deck, and great community vibes.',
  },
]

// ─── Constants ─────────────────────────────────────────────────────────────────

const CITIES = ['All Cities', 'Jaipur', 'Jodhpur', 'Jaisalmer', 'Srinagar', 'Gulmarg', 'Pahalgam', 'Alleppey', 'Munnar', 'Kochi', 'Shimla', 'Manali', 'Rishikesh']

const AMENITY_ICONS: Record<Amenity, React.ReactNode> = {
  WiFi: <Wifi className="w-3.5 h-3.5" />,
  AC: <Wind className="w-3.5 h-3.5" />,
  Breakfast: <Coffee className="w-3.5 h-3.5" />,
  Pool: <Waves className="w-3.5 h-3.5" />,
  Gym: <Dumbbell className="w-3.5 h-3.5" />,
  Parking: <Car className="w-3.5 h-3.5" />,
  Restaurant: <UtensilsCrossed className="w-3.5 h-3.5" />,
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

const StarRating = ({ count }: { count: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < count ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ))}
  </div>
)

const MapPlaceholder = ({ city }: { city: string }) => (
  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
    {/* Grid lines */}
    <div className="absolute inset-0 opacity-20"
      style={{ backgroundImage: 'linear-gradient(#93c5fd 1px, transparent 1px), linear-gradient(90deg, #93c5fd 1px, transparent 1px)', backgroundSize: '40px 40px' }}
    />
    {/* Fake road lines */}
    <div className="absolute inset-0 flex items-center justify-center opacity-30">
      <div className="w-full h-px bg-blue-300 dark:bg-blue-600" />
    </div>
    <div className="absolute inset-0 flex items-center justify-center opacity-30">
      <div className="h-full w-px bg-blue-300 dark:bg-blue-600" />
    </div>

    {/* Pin cluster */}
    <div className="relative z-10 flex flex-col items-center gap-3">
      <div className="relative">
        <div className="w-14 h-14 bg-brand rounded-full flex items-center justify-center shadow-lg shadow-brand/40">
          <MapPin className="w-7 h-7 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
          {HOTELS.filter(h => city === 'All Cities' || h.city === city).length}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl px-4 py-2 shadow-md text-center">
        <p className="text-sm font-medium text-navy dark:text-white">
          {city === 'All Cities' ? 'All Destinations' : city}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 justify-center">
          <Sparkles className="w-3 h-3" />
          Google Maps — Phase 5
        </p>
      </div>
    </div>

    {/* Fake mini pins */}
    {[
      { top: '25%', left: '20%' }, { top: '60%', left: '70%' },
      { top: '35%', left: '75%' }, { top: '70%', left: '30%' },
    ].map((pos, i) => (
      <div
        key={i}
        className="absolute w-6 h-6 bg-white dark:bg-gray-800 border-2 border-brand rounded-full flex items-center justify-center shadow-sm opacity-60"
        style={pos}
      >
        <Hotel className="w-3 h-3 text-brand" />
      </div>
    ))}
  </div>
)

// ─── Main Component ─────────────────────────────────────────────────────────────

const HotelSearch = () => {
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [priceTier, setPriceTier] = useState<PriceTier>('all')
  const [starFilter, setStarFilter] = useState<StarFilter>(0)
  const [searchQuery, setSearchQuery] = useState('')
  // const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc'>('rating')
  const [cityOpen, setCityOpen] = useState(false)

  // ── Filter + sort logic ──
  const filtered = useMemo(() => {
    let list = [...HOTELS]

    if (selectedCity !== 'All Cities') list = list.filter(h => h.city === selectedCity)
    if (priceTier !== 'all') list = list.filter(h => h.tier === priceTier)
    if (starFilter > 0) list = list.filter(h => h.stars >= starFilter)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.state.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'price_asc') list.sort((a, b) => a.pricePerNight - b.pricePerNight)
    else list.sort((a, b) => b.pricePerNight - a.pricePerNight)

    return list
  }, [selectedCity, priceTier, starFilter, searchQuery, sortBy])

  const hasActiveFilters = priceTier !== 'all' || starFilter > 0 || selectedCity !== 'All Cities'

  const clearFilters = () => {
    setPriceTier('all')
    setStarFilter(0)
    setSelectedCity('All Cities')
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">

      {/* ── Page Header ── */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl text-navy dark:text-white">Hotel Search</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {filtered.length} hotel{filtered.length !== 1 ? 's' : ''} found
                {selectedCity !== 'All Cities' ? ` in ${selectedCity}` : ' across India'}
              </p>
            </div>

            {/* Search bar */}
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search hotels or cities..."
                className="bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mt-4">

            {/* City dropdown */}
            <div className="relative">
              <button
                onClick={() => setCityOpen(!cityOpen)}
                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand text-sm text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl transition-all"
              >
                <MapPin className="w-4 h-4 text-brand" />
                {selectedCity}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${cityOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {cityOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-1 left-0 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg z-30 py-1 min-w-[160px]"
                  >
                    {CITIES.map(city => (
                      <button
                        key={city}
                        onClick={() => { setSelectedCity(city); setCityOpen(false) }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          selectedCity === city
                            ? 'text-brand bg-brand/5 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Price tier */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
              {(['all', 'budget', 'mid', 'luxury'] as PriceTier[]).map(tier => (
                <button
                  key={tier}
                  onClick={() => setPriceTier(tier)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${
                    priceTier === tier
                      ? 'bg-white dark:bg-gray-700 text-navy dark:text-white shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-navy dark:hover:text-white'
                  }`}
                >
                  {tier === 'all' ? 'All' : tier === 'mid' ? 'Mid-range' : tier.charAt(0).toUpperCase() + tier.slice(1)}
                </button>
              ))}
            </div>

            {/* Star filter */}
            <div className="flex items-center gap-1">
              {([0, 3, 4, 5] as StarFilter[]).map(s => (
                <button
                  key={s}
                  onClick={() => setStarFilter(s)}
                  className={`text-xs px-3 py-2 rounded-xl font-medium transition-all border ${
                    starFilter === s
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-400 text-amber-600 dark:text-amber-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-amber-300'
                  }`}
                >
                  {s === 0 ? 'All ★' : `${s}★+`}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1 ml-auto">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm bg-transparent text-gray-600 dark:text-gray-300 outline-none cursor-pointer"
              >
                <option value="rating">Top Rated</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Split Layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 items-start">

          {/* ── Map (sticky left) ── */}
          <div className="hidden lg:block w-[380px] shrink-0 sticky top-20 h-[calc(100vh-120px)] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
            <MapPlaceholder city={selectedCity} />
          </div>

          {/* ── Hotel list (right, scrollable) ── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                    <Hotel className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-serif text-xl text-navy dark:text-white mb-2">No hotels found</h3>
                  <p className="text-sm text-gray-400 mb-4">Try changing your filters or search query.</p>
                  <button onClick={clearFilters} className="text-sm text-brand hover:underline">Clear all filters</button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((hotel, i) => (
                    <motion.div
                      key={hotel.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex flex-col sm:flex-row">

                        {/* Image */}
                        <div className="relative sm:w-56 h-48 sm:h-auto shrink-0 overflow-hidden">
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {hotel.tag && (
                            <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full text-white ${hotel.tagColor}`}>
                              {hotel.tag}
                            </span>
                          )}
                          {/* Tier badge */}
                          <span className={`absolute bottom-3 left-3 text-xs px-2 py-0.5 rounded-full font-medium capitalize
                            ${hotel.tier === 'luxury' ? 'bg-purple-500/90 text-white' :
                              hotel.tier === 'mid' ? 'bg-brand/90 text-white' :
                              'bg-emerald-500/90 text-white'}`}>
                            {hotel.tier === 'mid' ? 'Mid-range' : hotel.tier}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-serif text-lg text-navy dark:text-white leading-snug">{hotel.name}</h3>
                              <div className="text-right shrink-0">
                                <p className="text-xl font-bold text-navy dark:text-white">
                                  ₹{hotel.pricePerNight.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-400">per night</p>
                              </div>
                            </div>

                            {/* Location & stars */}
                            <div className="flex items-center gap-3 mb-2">
                              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <MapPin className="w-3.5 h-3.5 text-brand" />
                                {hotel.city}, {hotel.state}
                              </span>
                              <StarRating count={hotel.stars} />
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                              {hotel.description}
                            </p>

                            {/* Amenities */}
                            <div className="flex flex-wrap gap-1.5">
                              {hotel.amenities.map(a => (
                                <span
                                  key={a}
                                  className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full"
                                >
                                  {AMENITY_ICONS[a]} {a}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">{hotel.rating}</span>
                              </div>
                              <span className="text-xs text-gray-400">({hotel.reviews} reviews)</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Add to Trip */}
                              <Link
                                to="/planner"
                                className="text-xs px-3 py-2 border border-gray-200 dark:border-gray-700 hover:border-brand dark:hover:border-blue-400 text-gray-600 dark:text-gray-300 hover:text-brand dark:hover:text-blue-400 rounded-xl font-medium transition-all"
                              >
                                + Add to Trip
                              </Link>
                              {/* View Details — future /hotels/:id */}
                              <Link
                                to={`/hotels/${hotel.id}`}
                                className="text-xs px-4 py-2 bg-brand hover:bg-navy text-white rounded-xl font-medium transition-all hover:scale-105"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelSearch