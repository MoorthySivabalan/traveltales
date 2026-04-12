import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Plus, Trash2, Save, Users,
  MapPin, Search, X, Loader2, GripVertical,
  Calendar, ChevronDown, ChevronUp
} from 'lucide-react'
import { useTripStore } from '../store/tripStore'
import { getUserTripsApi, updateTripApi } from '../api/tripApi'
import { useGoogleMaps } from '../hooks/useGoogleMaps'
import toast from 'react-hot-toast'

interface PlaceResult {
  name: string
  address: string
  placeId: string
  lat: number
  lng: number
}

interface DayPlan {
  day: number
  places: string[]
}

// ── PLACE SEARCH COMPONENT ──
const PlaceSearch = ({
  onSelect,
  onClose,
}: {
  onSelect: (place: PlaceResult) => void
  onClose: () => void
}): React.ReactElement => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PlaceResult[]>([])
  const [searching, setSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const searchPlaces = () => {
    if (!query.trim() || !window.google) return
    setSearching(true)

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    )

    service.textSearch(
      { query: `${query} India` },
      (
        results: google.maps.places.PlaceResult[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        setSearching(false)
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setResults(
            results.slice(0, 6).map((r) => ({
              name: r.name || '',
              address: r.formatted_address || '',
              placeId: r.place_id || '',
              lat: r.geometry?.location?.lat() || 0,
              lng: r.geometry?.location?.lng() || 0,
            }))
          )
        } else {
          setResults([])
        }
      }
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden"
    >
      <div className="flex items-center gap-2 p-3 border-b border-gray-100 dark:border-gray-700">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchPlaces()}
          placeholder="Search place in India..."
          className="flex-1 text-sm bg-transparent text-navy dark:text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={searchPlaces}
          className="px-3 py-1 bg-brand text-white text-xs rounded-lg hover:bg-navy transition-colors"
        >
          Search
        </button>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {searching && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-brand" />
          </div>
        )}
        {!searching && results.length === 0 && query && (
          <p className="text-center text-gray-400 text-sm py-4">
            No results. Try a different search.
          </p>
        )}
        {!searching && results.map((place, i) => (
          <button
            key={i}
            onClick={() => onSelect(place)}
            className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-navy dark:text-white">{place.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{place.address}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ── DAY EDITOR COMPONENT ──
const DayEditor = ({
  dayIndex,
  places,
  onAddPlace,
  onRemovePlace,
  onDeleteDay,
  canDelete,
  isOpen,
  onToggle,
}: {
  dayIndex: number
  places: string[]
  onAddPlace: (dayIndex: number, place: string) => void
  onRemovePlace: (dayIndex: number, placeIndex: number) => void
  onDeleteDay: (dayIndex: number) => void
  canDelete: boolean
  isOpen: boolean
  onToggle: () => void
}): React.ReactElement => {
  const [showSearch, setShowSearch] = useState(false)
  const { isLoaded } = useGoogleMaps()

  const handlePlaceSelect = (place: PlaceResult) => {
    onAddPlace(dayIndex, place.name)
    setShowSearch(false)
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-visible">
      <div className="flex items-center gap-3 p-4">
        <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
        <div
          onClick={onToggle}
          className="flex-1 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">
              {dayIndex + 1}
            </div>
            <span className="font-medium text-navy dark:text-white text-sm">
              Day {dayIndex + 1}
            </span>
            <span className="text-xs text-gray-400">
              {places.length} {places.length === 1 ? 'place' : 'places'}
            </span>
          </div>
          {isOpen
            ? <ChevronUp className="w-4 h-4 text-gray-400" />
            : <ChevronDown className="w-4 h-4 text-gray-400" />
          }
        </div>
        {canDelete && (
          <button
            onClick={() => onDeleteDay(dayIndex)}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 dark:border-gray-700 px-4 pb-4 pt-3"
          >
            <div className="space-y-2 mb-3">
              {places.length === 0 && (
                <p className="text-xs text-gray-400 italic">
                  No places added yet. Search and add places below.
                </p>
              )}
              {places.map((place, pi) => (
                <div
                  key={pi}
                  className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                    {place}
                  </span>
                  <button
                    onClick={() => onRemovePlace(dayIndex, pi)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                disabled={!isLoaded}
                className="flex items-center gap-2 text-xs text-brand dark:text-blue-400 hover:opacity-80 transition-opacity disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                {isLoaded ? 'Add a place' : 'Loading maps...'}
              </button>

              <AnimatePresence>
                {showSearch && (
                  <PlaceSearch
                    onSelect={handlePlaceSelect}
                    onClose={() => setShowSearch(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── MAIN TRIP EDITOR PAGE ──
const TripEditor = (): React.ReactElement => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { trips, setTrips, updateTrip } = useTripStore()

  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [openDays, setOpenDays] = useState<number[]>([0])

  const [name, setName] = useState('')
  const [travellers, setTravellers] = useState(2)
  const [travelDate, setTravelDate] = useState('')
  const [tier, setTier] = useState('economy')
  const [notes, setNotes] = useState('')
  const [days, setDays] = useState<DayPlan[]>([])

  useEffect(() => {
    const loadTrip = async () => {
      try {
        let found = trips.find(t => t._id === id)
        if (!found) {
          const res = await getUserTripsApi()
          setTrips(res.trips)
          found = res.trips.find((t: any) => t._id === id)
        }
        if (found) {
          setTrip(found)
          setName(found.name)
          setTravellers(found.travellers || 2)
          setTravelDate(found.travelDate ? found.travelDate.split('T')[0] : '')
          setTier(found.tier || 'economy')
          setNotes(found.notes || '')

          const parsedDays: DayPlan[] = found.itinerary.map((item: string, i: number) => {
            const content = item.replace(/^Day \d+[: ]*/, '')
            const places = content
              .split(/[,.]/)
              .map((p: string) => p.trim())
              .filter((p: string) => p.length > 3 && p.length < 60)
              .slice(0, 5)
            return { day: i + 1, places }
          })
          setDays(parsedDays)
        }
      } catch {
        toast.error('Failed to load trip')
      } finally {
        setLoading(false)
      }
    }
    loadTrip()
  }, [id])

  const toggleDay = (index: number) => {
    setOpenDays(prev =>
      prev.includes(index) ? prev.filter(d => d !== index) : [...prev, index]
    )
  }

  const addDay = () => {
    const newDay: DayPlan = { day: days.length + 1, places: [] }
    setDays(prev => [...prev, newDay])
    setOpenDays(prev => [...prev, days.length])
    toast.success(`Day ${days.length + 1} added!`)
  }

  const deleteDay = (dayIndex: number) => {
    if (days.length <= 1) {
      toast.error('Trip must have at least 1 day')
      return
    }
    setDays(prev =>
      prev
        .filter((_, i) => i !== dayIndex)
        .map((d, i) => ({ ...d, day: i + 1 }))
    )
    toast.success(`Day ${dayIndex + 1} removed`)
  }

  const addPlace = (dayIndex: number, place: string) => {
    setDays(prev =>
      prev.map((d, i) =>
        i === dayIndex ? { ...d, places: [...d.places, place] } : d
      )
    )
  }

  const removePlace = (dayIndex: number, placeIndex: number) => {
    setDays(prev =>
      prev.map((d, i) =>
        i === dayIndex
          ? { ...d, places: d.places.filter((_, pi) => pi !== placeIndex) }
          : d
      )
    )
  }

  const handleSave = async () => {
    if (!trip) return
    try {
      setSaving(true)
      const itinerary = days.map((d, i) => {
        const placesText =
          d.places.length > 0 ? d.places.join(', ') : 'Free day — explore at leisure'
        return `Day ${i + 1}: ${placesText}`
      })

      const updatedData = {
        name,
        travellers,
        travelDate: travelDate || null,
        tier,
        notes,
        duration: days.length,
        itinerary,
      }

      const res = await updateTripApi(trip._id, updatedData)
      updateTrip(trip._id, res.trip)
      toast.success('Trip updated successfully!')
      navigate('/dashboard')
    } catch {
      toast.error('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Trip not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">

      {/* Header */}
      <div className="bg-navy dark:bg-gray-900 text-white py-6 px-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-gray-400 text-xs">Editing trip</p>
              <h1 className="font-serif text-lg">{name}</h1>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-blue-600 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Image Banner */}
        {trip.image && (
          <div className="h-40 rounded-2xl overflow-hidden">
            <img src={trip.image} alt={name} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          <h2 className="font-serif text-lg text-navy dark:text-white mb-4">Trip Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Trip Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white text-sm focus:outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Number of Travellers
              </label>
              <div className="flex items-center gap-3 mt-1.5">
                <button
                  onClick={() => setTravellers(prev => Math.max(1, prev - 1))}
                  className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-brand hover:text-brand transition-colors font-bold text-lg"
                >−</button>
                <span className="w-12 text-center font-semibold text-navy dark:text-white text-lg">
                  {travellers}
                </span>
                <button
                  onClick={() => setTravellers(prev => Math.min(20, prev + 1))}
                  className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-brand hover:text-brand transition-colors font-bold text-lg"
                >+</button>
                <span className="text-xs text-gray-400">persons</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Travel Date
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={e => setTravelDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 mt-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white text-sm focus:outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Package Tier</label>
              <div className="flex gap-2">
                {['economy', 'premium'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                      tier === t
                        ? 'bg-brand text-white'
                        : 'border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-brand hover:text-brand'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-400 block mb-1.5">
                Notes / Special Requirements
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="Dietary restrictions, accessibility needs, special requests..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-navy dark:text-white text-sm focus:outline-none focus:border-brand resize-none"
              />
            </div>
          </div>
        </div>

        {/* Itinerary Editor */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-serif text-lg text-navy dark:text-white">Day-by-Day Itinerary</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {days.length} days · Search Google Maps to add places
              </p>
            </div>
            <button
              onClick={addDay}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand/10 dark:bg-brand/20 hover:bg-brand text-brand hover:text-white dark:text-blue-400 dark:hover:text-white rounded-xl text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" /> Add Day
            </button>
          </div>

          <div className="space-y-3">
            {days.map((day, i) => (
              <DayEditor
                key={i}
                dayIndex={i}
                places={day.places}
                onAddPlace={addPlace}
                onRemovePlace={removePlace}
                onDeleteDay={deleteDay}
                canDelete={days.length > 1}
                isOpen={openDays.includes(i)}
                onToggle={() => toggleDay(i)}
              />
            ))}
          </div>

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Total: {days.length} days · {days.reduce((acc, d) => acc + d.places.length, 0)} places
            </span>
            <button
              onClick={addDay}
              className="text-xs text-brand dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add another day
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 bg-brand hover:bg-navy disabled:opacity-60 text-white rounded-2xl font-medium text-base transition-all flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving your trip...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  )
}

export default TripEditor