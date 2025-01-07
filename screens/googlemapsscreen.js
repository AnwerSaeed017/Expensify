import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function GoogleMapScreen({ route }) {
  const { categoryName, userId, selectedMonth } = route.params;
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationAndPlaces = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
      setLocation(userLocation.coords);

      
      let categoryQuery = '';
      switch (categoryName) {
        case 'Food & Drink':
          categoryQuery = 'restaurant|bar|cafe|bakery|supermarket';
          break;
        case 'Transport':
          categoryQuery = 'car_rental|bus_station|train_station|airport';
          break;
        case 'Medicine':
          categoryQuery = 'pharmacy|hospital|clinic';
          break;
        case 'Entertainment':
          categoryQuery = 'movie_theater|park|zoo|museum';
          break;
        case 'Clothes':
          categoryQuery = 'clothing_store|shopping_mall|supermarket';
          break;
        case 'Utilities':
          categoryQuery = 'hardware_store|electric_supply|bank|post_office|supermarket';
          break;
        default:
          categoryQuery = 'store';
      }

      
      const googleApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.coords.latitude},${userLocation.coords.longitude}&radius=5000&type=${categoryQuery}&key=AIzaSyA3FzKFHiA7bUcmOaubinG6wqCZt8Dw7Yk`;

      try {
        const response = await fetch(googleApiUrl);
        const data = await response.json();

        if (data.results) {
          setPlaces(data.results);
        } else {
          console.error('No places found');
        }
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationAndPlaces();
  }, [categoryName]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading places...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
            description="This is where you are"
            pinColor="blue"
          />
          
          
          {places.map((place) => (
            <Marker
              key={place.place_id}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              title={place.name}
              description={place.vicinity}
            />
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
});
