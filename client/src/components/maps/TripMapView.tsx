import { GoogleMap, Marker, Polyline, InfoWindow } from '@react-google-maps/api'
import { useState } from 'react'
import { useGoogleMaps } from '../../hooks/useGoogleMaps'
import { Loader2 } from 'lucide-react'

interface MapPlace {
  lat: number
  lng: number
  label: string
  day?: number
}

interface TripMapViewProps {
  places: MapPlace[]
  height?: string
}

const mapStyles = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#a2daf2' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f5f5f0' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#fefefe' }] },
]

const darkMapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
]

const TripMapView = ({ places, height = '400px' }: TripMapViewProps) => {
  const { isLoaded, loadError } = useGoogleMaps()
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null)
  const isDark = document.documentElement.classList.contains('dark')

  if (loadError) {
    return (
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl" style={{ height }}>
        <p className="text-gray-400 text-sm">Failed to load map</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl" style={{ height }}>
        <Loader2 className="w-6 h-6 animate-spin text-brand" />
      </div>
    )
  }

  // Center map on average of all coordinates
  const center = places.length > 0
    ? {
        lat: places.reduce((sum, p) => sum + p.lat, 0) / places.length,
        lng: places.reduce((sum, p) => sum + p.lng, 0) / places.length,
      }
    : { lat: 20.5937, lng: 78.9629 } // India center

  const path = places.map(p => ({ lat: p.lat, lng: p.lng }))

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height, borderRadius: '16px' }}
      center={center}
      zoom={places.length === 1 ? 10 : 6}
      options={{
        styles: isDark ? darkMapStyles : mapStyles,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
      }}
    >
      {/* Route line */}
      {places.length > 1 && (
        <Polyline
          path={path}
          options={{
            strokeColor: '#2563eb',
            strokeOpacity: 0.8,
            strokeWeight: 2.5,
            geodesic: true,
          }}
        />
      )}

      {/* Markers */}
      {places.map((place, i) => (
        <Marker
          key={i}
          position={{ lat: place.lat, lng: place.lng }}
          label={{
            text: String(i + 1),
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
          onClick={() => setSelectedPlace(place)}
        />
      ))}

      {/* Info Window */}
      {selectedPlace && (
        <InfoWindow
          position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
          onCloseClick={() => setSelectedPlace(null)}
        >
          <div className="p-1">
            <p className="font-medium text-navy text-sm">{selectedPlace.label}</p>
            {selectedPlace.day && (
              <p className="text-gray-500 text-xs">Day {selectedPlace.day}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  )
}

export default TripMapView