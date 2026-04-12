import axiosInstance from './axiosInstance'

export const loginApi = async (email: string, password: string) => {
  const res = await axiosInstance.post('/auth/login', { email, password })
  return res.data
}

export const signupApi = async (data: {
  fullName: string
  email: string
  phone: string
  password: string
}) => {
  const res = await axiosInstance.post('/auth/signup', data)
  return res.data
}

export const logoutApi = async () => {
  const res = await axiosInstance.post('/auth/logout')
  return res.data
}