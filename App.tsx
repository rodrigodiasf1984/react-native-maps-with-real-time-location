import { View } from 'react-native'
import { styles } from './styles'
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject
} from 'expo-location'
import { useEffect, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'

export default function App() {
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null)

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

  return (
    <View style={styles.container}>
      {userLocation && (
        <MapView
          style={styles.map}
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
