import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Clock, Trash2, Pencil,
  Plus, Users, Loader2, PackageOpen
} from 'lucide-react'

import { useAuthStore } from '../store/authStore'
import { useTripStore } from '../store/tripStore'
import { getUserTripsApi, deleteTripApi } from '../api/tripApi'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuthStore()
  const { trips, setTrips, removeTrip } = useTripStore()

  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const navigate = useNavigate()

  // ✅ FETCH TRIPS
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await getUserTripsApi()
        setTrips(res?.trips || [])
      } catch (err) {
        console.error(err)
        toast.error('Failed to load trips')
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [setTrips])

  // ✅ DELETE TRIP
  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await deleteTripApi(deleteId)
      removeTrip(deleteId)
      toast.success('Trip deleted')
      setDeleteId(null)
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete trip')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">

      {/* HEADER */}
      <div className="bg-navy dark:bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">

          <div className="flex justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-brand uppercase">Dashboard</p>
              <h1 className="text-4xl font-bold">
                {user?.fullName || 'User'}'s Trips
              </h1>
            </div>

            <Link
              to="/explore"
              className="px-5 py-3 bg-brand text-white rounded-xl"
            >
              <Plus className="inline w-4 h-4 mr-2" />
              New Trip
            </Link>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-2xl font-bold">{trips.length}</p>
              <p className="text-xs">Trips</p>
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-2xl font-bold">
                {trips.filter(t => t.isCustom).length}
              </p>
              <p className="text-xs">Custom</p>
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-2xl font-bold">
                {trips.filter(t => t.travelDate).length}
              </p>
              <p className="text-xs">Planned</p>
            </div>

            <div className="bg-white/10 p-4 rounded-xl">
              <p className="text-2xl font-bold">
                {trips.reduce((sum, t) => sum + (t.duration || 0), 0)}
              </p>
              <p className="text-xs">Days</p>
            </div>

          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-10">

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <PackageOpen className="mx-auto w-12 h-12 text-gray-400" />
            <p className="mt-3 text-gray-500">No trips found</p>
            <Link to="/explore" className="text-blue-500">
              Start Planning →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">

            {trips.map((trip, i) => (
              <motion.div
                key={trip._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow overflow-hidden"
              >

                <img
                  src={trip.image || 'https://source.unsplash.com/600x400/?travel'}
                  className="h-40 w-full object-cover"
                />

                <div className="p-4">

                  <h2 className="font-bold">{trip.name}</h2>

                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {trip.state}
                  </p>

                  <p className="text-sm mt-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {trip.duration || 0} Days
                  </p>

                  <p className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {trip.travellers || 1} People
                  </p>

                  <div className="flex gap-2 mt-4">

                    {/* EDIT */}
                    <button
                      onClick={() => navigate(`/trip-editor/${trip._id}`)}
                      className="flex-1 bg-gray-100 py-2 rounded"
                    >
                      <Pencil className="w-4 h-4 inline" /> Edit
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => {
                        if (trip._id) setDeleteId(trip._id)
                      }}
                      className="px-3 bg-red-100 text-red-500 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>

              </motion.div>
            ))}

          </div>
        )}

      </div>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

            <div className="bg-white p-6 rounded-xl">

              <p>Are you sure you want to delete?</p>

              <div className="flex gap-3 mt-4">

                <button onClick={() => setDeleteId(null)}>
                  Cancel
                </button>

                <button onClick={handleDelete} className="text-red-500">
                  Delete
                </button>

              </div>

            </div>

          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default Dashboard