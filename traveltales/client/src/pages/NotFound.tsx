import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Home, Compass } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 bg-brand/10 dark:bg-brand/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-12 h-12 text-brand" />
        </div>

        <h1 className="font-serif text-6xl font-bold text-navy dark:text-white mb-2">
          404
        </h1>
        <h2 className="font-serif text-2xl text-navy dark:text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Looks like this destination doesn't exist on our map. Let's get you back on track!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand hover:bg-navy text-white rounded-xl font-medium transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            to="/explore"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand hover:text-brand dark:hover:border-blue-400 dark:hover:text-blue-400 rounded-xl font-medium transition-all"
          >
            <Compass className="w-4 h-4" />
            Explore Packages
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound