import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Star, Users, Globe, Calendar, Search, Compass } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const popularPackages = [
  {
    id: 1,
    name: 'Magical Rajasthan',
    duration: '7 Days',
    price: '₹4,300',
    rating: 4.8,
    reviews: 124,
    tag: 'Most Popular',
    tagColor: 'bg-accent text-white',
    description: 'Explore majestic forts, colorful bazaars and the golden Thar desert.',
    image: '/images/Rajasthan trip 1.jpg',
    places: ['Jaipur', 'Jodhpur', 'Jaisalmer'],
  },
  {
    id: 3,
    name: 'Heavenly Kashmir',
    duration: '6 Days',
    price: '₹6,100',
    rating: 4.9,
    reviews: 98,
    tag: 'Top Rated',
    tagColor: 'bg-brand text-white',
    description: 'Dal Lake houseboats, Mughal gardens and snow-capped Himalayan peaks.',
    image: '/images/Kashmir .jpg',
    places: ['Srinagar', 'Gulmarg', 'Pahalgam'],
  },
  {
    id: 11,
    name: 'Coastal City Escapes',
    duration: '5 Days',
    price: '₹4,216',
    rating: 4.7,
    reviews: 156,
    tag: 'Trending',
    tagColor: 'bg-emerald-500 text-white',
    description: 'City buzz of Mumbai followed by sun, sand and seafood in Goa.',
    image: '/images/mumbai-goa.jpg',
    places: ['Mumbai', 'North Goa', 'South Goa'],
  },
]

const steps = [
  {
    icon: <Search className="w-6 h-6" />,
    title: 'Browse Packages',
    desc: 'Explore 15+ curated Indian destinations with detailed itineraries and pricing.',
  },
  {
    icon: <Compass className="w-6 h-6" />,
    title: 'Customize Your Trip',
    desc: 'Use our AI planner to personalize days, hotels, and activities to your budget.',
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'Book & Go',
    desc: 'Confirm your dates, pay securely via Razorpay and get instant confirmation.',
  },
]

const stats = [
  { icon: <Globe className="w-5 h-5" />, value: '15+', label: 'Destinations' },
  { icon: <MapPin className="w-5 h-5" />, value: '50+', label: 'Hotels' },
  { icon: <Users className="w-5 h-5" />, value: '2,000+', label: 'Happy Travellers' },
  { icon: <Star className="w-5 h-5" />, value: '4.8', label: 'Avg Rating' },
]

// Rotating hero images — pulled from your existing /public/images folder
const HERO_IMAGES = [
  { src: '/images/Kashmir .jpg',        label: 'Kashmir' },
  { src: '/images/Uttarakhand 1.jpg',   label: 'Uttarakhand' },
  { src: '/images/himachal.jpg',         label: 'Himachal Pradesh' },
  { src: '/images/kerala.jpg',           label: 'Kerala' },
  { src: '/images/Rajasthan trip 1.jpg', label: 'Rajasthan' },
]

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="font-sans">

      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex items-center text-white overflow-hidden">

        {/* Rotating background images */}
        <AnimatePresence mode="sync">
          <motion.div
            key={currentIndex}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          >
            <img
              src={HERO_IMAGES[currentIndex].src}
              alt={HERO_IMAGES[currentIndex].label}
              className="w-full h-full object-cover"
            />
            {/* Left-heavy dark overlay — keeps text readable, lets right side breathe */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/60 to-[#0a1628]/20" />
            {/* Bottom fade into stats bar */}
            <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Location label — top right */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`label-${currentIndex}`}
            className="absolute top-6 right-6 z-10 flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs px-3 py-1.5 rounded-full"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4 }}
          >
            <MapPin className="w-3 h-3 text-amber-400" />
            {HERO_IMAGES[currentIndex].label}
          </motion.div>
        </AnimatePresence>

        {/* Slide indicator dots — bottom centre */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentIndex
                  ? 'w-8 bg-amber-400'
                  : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm px-4 py-1.5 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-amber-400" />
              Explore India like never before
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
              Every Trip <br />
              <span className="text-amber-400">Tells a Story</span>
            </h1>

            <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              Discover handpicked travel packages across India. Plan smarter with AI, book hotels, and travel with confidence.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 bg-brand hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-900/30"
              >
                Explore Packages
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/planner"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/25 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
              >
                Plan My Trip
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="p-2 bg-brand/10 dark:bg-brand/20 rounded-lg text-brand">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xl font-semibold text-navy dark:text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR PACKAGES ── */}
      <section className="bg-gray-50 dark:bg-gray-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-brand text-sm font-medium mb-1">Featured</p>
              <h2 className="font-serif text-3xl md:text-4xl text-navy dark:text-white">
                Popular Packages
              </h2>
            </div>
            <Link
              to="/explore"
              className="hidden sm:inline-flex items-center gap-1 text-brand hover:text-navy dark:hover:text-blue-400 text-sm font-medium transition-colors"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularPackages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${pkg.tagColor}`}>
                    {pkg.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-lg text-navy dark:text-white">{pkg.name}</h3>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg shrink-0 ml-2">
                      {pkg.duration}
                    </span>
                  </div>

                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Places */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {pkg.places.map(place => (
                      <span key={place} className="inline-flex items-center gap-1 text-xs text-brand dark:text-blue-400 bg-brand/10 dark:bg-brand/20 px-2 py-0.5 rounded-full">
                        <MapPin className="w-3 h-3" />
                        {place}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <span className="text-xs text-gray-400">From</span>
                      <p className="text-navy dark:text-white font-semibold">{pkg.price}<span className="text-xs font-normal text-gray-400">/day</span></p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm font-medium text-navy dark:text-white">{pkg.rating}</span>
                      <span className="text-xs text-gray-400">({pkg.reviews})</span>
                    </div>
                  </div>

                  <Link
                    to={`/explore/${pkg.id}`}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-brand/10 dark:bg-brand/20 hover:bg-brand text-brand hover:text-white dark:text-blue-400 dark:hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  >
                    View Package <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand text-sm font-medium mb-1">Simple Process</p>
            <h2 className="font-serif text-3xl md:text-4xl text-navy dark:text-white">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-brand/10 dark:bg-brand/20 rounded-2xl flex items-center justify-center text-brand mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="w-7 h-7 bg-brand text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto -mt-2 mb-3">
                  {i + 1}
                </div>
                <h3 className="font-serif text-xl text-navy dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-brand dark:bg-blue-900 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
            Ready to Write Your Travel Story?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of travellers who planned their perfect India trip with TravelTales.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 bg-white text-brand hover:bg-gray-100 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            >
              Browse Packages <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 border border-white/40 text-white hover:bg-white/10 px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Plan with AI
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home