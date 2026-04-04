import axiosInstance from './axiosInstance'

export const getHotelsApi = async (params?: {
  search?: string
  region?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  page?: number
}) => {
  const res = await axiosInstance.get('/hotels', { params })
  return res.data
}

export const getHotelByIdApi = async (id: string) => {
  const res = await axiosInstance.get(`/hotels/${id}`)
  return res.data
}

export const getHotelsByCityApi = async (city: string) => {
  const res = await axiosInstance.get(`/hotels/city/${city}`)
  return res.data
}