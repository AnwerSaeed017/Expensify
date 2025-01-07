import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { FIRESTORE_DB } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; 
import { useTheme } from '../components/theme';
import { logOut } from '../services/authservice';
import LoginScreen from './loginscreen';

export default function SettingsScreen({ userId, navigation}) {
  const { theme, toggleTheme } = useTheme();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isDarkThemeEnabled, setIsDarkThemeEnabled] = useState(false);
  const [currency] = useState('Rs. PKR');
  const [image, setImage] = useState(null);
  
  useEffect(() => {
    const fetchThemePreference = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme) {
        setIsDarkThemeEnabled(storedTheme === 'dark');
      }
    };
    fetchThemePreference();
  }, []);

  // Update theme preference in AsyncStorage whenever the user toggles the theme
  const handleThemeToggle = async () => {
    setIsDarkThemeEnabled((prev) => !prev);
    await AsyncStorage.setItem('theme', isDarkThemeEnabled ? 'light' : 'dark');
    toggleTheme();
  };
  
  // Fetch image from Firestore when userId changes
  useEffect(() => {
    const loadImage = async () => {
      setImage(null);
      if (!userId) {
        console.error('userId is undefined or null');
        return; 
      }

      const userRef = doc(FIRESTORE_DB, 'users', userId);

      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const profileImageUrl = userData.profileImage;
          if (profileImageUrl) {
            setImage(profileImageUrl);
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    loadImage();
  }, [userId]);

  const uploadImageToImgur = async (uri) => {
    const clientId = '27b6c63f33773cf';
  
    const data = new FormData();
    data.append('image', {
      uri: uri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
  
    try {
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': `Client-ID ${clientId}`,
        },
        body: data,
      });
  
      const result = await response.json();
      
      if (response.ok && result.success) {
        return result.data.link;
      } else {
        console.error('Imgur upload failed:', result);
        throw new Error(`Imgur upload failed: ${result.status} - ${result.message}`);
      }
    } catch (error) {
      console.error('Error uploading image to Imgur:', error);
      throw error;
    }
  };

  const saveImageUrlToFirebase = async (imgurUrl) => {
    if (imgurUrl) {
      try {
        const userRef = doc(FIRESTORE_DB, 'users', userId); 
        const docSnap = await getDoc(userRef);
  
        if (docSnap.exists()) {
          await updateDoc(userRef, { profileImage: imgurUrl });
          console.log('Image URL saved to Firebase:', imgurUrl);
        } else {
          await setDoc(userRef, { profileImage: imgurUrl, userId: userId });
          console.log('User document created with image URL:', imgurUrl);
        }
      } catch (error) {
        console.error("Error saving image URL to Firebase: ", error);
      }
    } else {
      console.log("Invalid image URL");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access the media library is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);

      const imgurUrl = await uploadImageToImgur(uri);
      if (imgurUrl) {
        await saveImageUrlToFirebase(imgurUrl);
      }
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access the camera is required!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);

      const imgurUrl = await uploadImageToImgur(uri);
      if (imgurUrl) {
        await saveImageUrlToFirebase(imgurUrl);
      }
    }
  };

  const handleCameraOptions = () => {
    Alert.alert(
      "Choose an Option",
      "Select an action",
      [
        {
          text: "Take Photo",
          onPress: takePhoto,
        },
        {
          text: "Choose from Gallery",
          onPress: pickImage,
        },
        {
          text: "Cancel",
          style: "cancel",
        }
      ]
    );
  };

  const handleNotificationsToggle = () => {
    setIsNotificationsEnabled((prev) => !prev);
  };
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear any stored user data
              await AsyncStorage.removeItem('theme');
              
              // Perform logout
              await logOut();
              
              // Navigate to Login screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }]
              });
                
                
              
            } catch (error) {
              console.error("Logout Error:", error);
              Alert.alert("Logout Error", "Unable to log out. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>Settings</Text>
      </View>

      {/* Profile Image Section */}
      <View style={styles.profileImageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.profileImage} />
        ) : (
          <Text style={styles.profileText}>No Image Selected</Text>
        )}
        <TouchableOpacity onPress={handleCameraOptions} style={styles.cameraIconContainer}>
          <Ionicons name="camera-outline" size={30} color="#FFF" style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>

      {/* Preferences Section */}
      <Text style={styles.subHeading}>    Preferences</Text>

      {/* Currency Setting */}
      <View style={styles.settingTile}>
        <Ionicons name="cash-sharp" size={26} color="green" />
        <Text style={styles.settingText}>Currency</Text>
        <Text style={styles.currencyText}>{currency}</Text>
      </View>

      {/* Notifications Toggle */}
      {/* <View style={styles.settingTile}>
        <Ionicons name="notifications-sharp" size={26} color="orange" />
        <Text style={styles.settingText}>Notifications</Text>
        <Switch value={isNotificationsEnabled} onValueChange={handleNotificationsToggle} />
      </View> */}

      {/* Dark Theme Toggle */}
      <View style={styles.settingTile}>
        <Ionicons name="moon-sharp" size={26} color="black" />
        <Text style={styles.settingText}>Dark Theme</Text>
        <Switch value={isDarkThemeEnabled} onValueChange={handleThemeToggle} />
      </View>

      {/* Help Section */}
      <Text style={styles.subHeading}>    Help</Text>

      {/* About Section */}
      <TouchableOpacity style={styles.settingTile} onPress={()=> navigation.navigate('AboutScreen')}>
        <Ionicons name="information-circle-sharp" size={26} color="brown" />
        <Text style={styles.settingText}>About</Text>
      </TouchableOpacity>

      {/* Logout Option */}
      <TouchableOpacity style={styles.settingTile} onPress={handleLogout}>
        <Ionicons name="log-out-sharp" size={26} color="#FF6347" />
        <Text style={[styles.settingText, { color: '#FF6347' }]}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFF',
    paddingBottom: 20,
  },
  topBar: {
    backgroundColor: '#5D5FEF',
    width: '100%',
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  topBarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#5D5FEF',
  },
  profileText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 85,
    backgroundColor: '#5D5FEF',
    borderRadius: 50,
    padding: 8,
  },
  cameraIcon: {
    marginBottom: 0,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 20,
  },
  settingTile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    padding: 15,
    marginTop: 20,
    borderRadius: 12,
    marginVertical: 5,
    width: '90%',
    alignSelf: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginLeft: 10,
  },
  currencyText: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
});
