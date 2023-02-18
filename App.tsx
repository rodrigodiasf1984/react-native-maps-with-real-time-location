import { useEffect, useState, useRef } from 'react'
import { View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy
} from 'expo-location'

import { styles } from './styles'

export default function App() {
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null)
  const mapRef = useRef<MapView>(null)

  const requestLocationPermission = async () => {
    const { granted } = await requestForegroundPermissionsAsync()
    if (granted) {
      const currentUserPosition = await getCurrentPositionAsync()
      setUserLocation(currentUserPosition)
    }
  }

  useEffect(() => {
    requestLocationPermission()
  }, [])

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1
      },
      (newLocation) => {
        setUserLocation(newLocation)
        mapRef.current?.animateCamera({
          pitch: 70,
          center: newLocation.coords
        })
      }
    )
  }, [userLocation])

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapView
          style={styles.map}
          ref={mapRef}
          initialRegion={{
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
        >
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude
            }}
          />
        </MapView>
      )}
    </View>
  )
}
