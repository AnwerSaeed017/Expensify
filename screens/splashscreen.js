import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 4000); 

    return () => clearTimeout(timer); 
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/splashlogo.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
      </View>
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color="#5D5FEF" 
          style={styles.loading} 
        />
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d2b42',
  },
  logoContainer: {
    width: width * 1.0, 
    height: height * 1.0, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#1d2b42',
  },
  logo: {
    width: '100%',
    height: '100%',
    maxWidth: 400,
    maxHeight: 400,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: height * 0.15, // Positioned from bottom
  },
  loading: {
    transform: [{ scale: 1.5 }], // Make loading indicator larger
  },
});