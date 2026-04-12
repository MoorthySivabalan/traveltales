import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
})
axiosInstance.interceptors.request.use((config) => {
const token = useAuthStore.getState().token || localStorage.getItem("token")
if (token) {
 config.headers.Authorization = `Bearer ${token}`
}
  console.log("TOKEN:", useAuthStore.getState().token);
  return config
})
export default axiosInstance