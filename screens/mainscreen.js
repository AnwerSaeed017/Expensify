import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text } from 'react-native';
import HomeScreen from './homescreen';
import GraphScreen from './graphscreen';
import CategoryScreen from './categoryscreen';
import SettingsScreen from './settingsscreen';
import { getCurrentUserId } from '../services/authservice';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from '../components/theme'; // Import ThemeProvider and useTheme hook
const Tab = createBottomTabNavigator();

export default function MainScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(moment().format('MMMM'));
  
  // Fetch the current user ID
  useEffect(() => {
    const currentUser = getCurrentUserId();
    if (currentUser) {
      setUserId(currentUser);
    } else {
      navigation.replace('Login');
    }
  }, [navigation]);

  if (!userId) {
    return <Text>Loading...</Text>;
  }

  return (
    <ThemeProvider>
      <MainTabNavigator userId={userId} currentMonth={currentMonth} navigation={navigation} />
    </ThemeProvider>
  );
}

function MainTabNavigator({ userId, currentMonth, navigation }) {
  const { theme } = useTheme(); // Access the current theme
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#5D5FEF' }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#5D5FEF"
        translucent={true}
      />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Graph') {
              iconName = 'pie-chart-outline';
            } else if (route.name === 'Categories') {
              iconName = 'grid-outline';
            } else if (route.name === 'Settings') {
              iconName = 'settings-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6200EE',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.backgroundColor, // Set bottom tab background based on theme
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen 
          name="Graph" 
          component={GraphScreen} 
          initialParams={{ userId: userId, selectedMonth: currentMonth }}
        />
        <Tab.Screen 
          name="Categories" 
          children={() => (
            <CategoryScreen userId={userId} selectedMonth={currentMonth} navigation={navigation} />
          )}
        />
        <Tab.Screen 
          name="Settings" 
          children={() => (
            <SettingsScreen userId={userId} navigation={navigation}/>
          )} 
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
