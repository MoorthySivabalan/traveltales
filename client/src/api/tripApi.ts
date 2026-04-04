import axiosInstance from './axiosInstance'
import type { TravelPackage } from '../types/package'

export const getUserTripsApi = async () => {
  const res = await axiosInstance.get('/trips')
  return res.data
}

export const createTripFromPackage = async (pkg: TravelPackage, tier: 'economy' | 'premium') => {
  const res = await axiosInstance.post('/trips', {
    name: pkg.name,
    caption: pkg.caption,
    state: pkg.state,
    region: pkg.region,
    duration: pkg.duration,
    image: pkg.image,
    attractions: pkg.attractions,
    itinerary: pkg.itinerary,
    tier,
    pricing: pkg.pricing,
    tags: pkg.tags,
    isCustom: false,
    sourcePackageId: pkg.id,
  })
  return res.data
}

export const updateTripApi = async (id: string, data: Partial<any>) => {
  const res = await axiosInstance.put(`/trips/${id}`, data)
  return res.data
}

export const deleteTripApi = async (id: string) => {
  const res = await axiosInstance.delete(`/trips/${id}`)
  return res.data
}