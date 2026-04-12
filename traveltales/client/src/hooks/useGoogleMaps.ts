import { useJsApiLoader } from '@react-google-maps/api'
import type { Libraries } from '@react-google-maps/api'

const libraries: Libraries = ['places']

export const useGoogleMaps = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries,
  })

  return { isLoaded, loadError }
}