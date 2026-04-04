import { create } from 'zustand'

interface Trip {
  _id: string
  name: string
  caption: string
  state: string
  region: string
  duration: number
  image: string
  attractions: string[]
  itinerary: string[]
  tier: 'economy' | 'premium'
  pricing: {
    economy: { hotel: string; transport: string }
    premium: { hotel: string; transport: string }
  }
  tags: string[]
  isCustom: boolean
  sourcePackageId: number | null
  travelDate: string | null
  travellers: number
  notes: string
  createdAt: string
}

interface TripState {
  trips: Trip[]
  setTrips: (trips: Trip[]) => void
  addTrip: (trip: Trip) => void
  removeTrip: (id: string) => void
  updateTrip: (id: string, data: Partial<Trip>) => void
}

export const useTripStore = create<TripState>((set) => ({
  trips: [],
  setTrips: (trips) => set({ trips }),
  addTrip: (trip) => set((s) => ({ trips: [trip, ...s.trips] })),
  removeTrip: (id) => set((s) => ({ trips: s.trips.filter(t => t._id !== id) })),
  updateTrip: (id, data) => set((s) => ({
    trips: s.trips.map(t => t._id === id ? { ...t, ...data } : t)
  })),
}))