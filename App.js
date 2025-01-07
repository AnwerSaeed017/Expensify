import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WelcomeScreen from './screens/welcomescreen';
import LoginScreen from './screens/loginscreen';
import SignupScreen from './screens/signupscreen';
import MainScreen from './screens/mainscreen'; // Main screen with navigation tabs
import AddForm from './components/add_expense';
import EditBudget from './screens/editbudget'; // Ensure EditBudget is imported correctly
import CategoryExpenseScreen from './screens/categoryexpense';
import GoogleMapScreen from './screens/googlemapsscreen';
import { ThemeProvider } from './components/theme';
import AboutScreen from './screens/aboutscreen';
import SplashScreen from './screens/splashscreen';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">
              <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
              <Stack.Screen name="AddExpense" component={AddForm} options={{ title: 'Add Expense', headerShown: false }} />
              <Stack.Screen
                name="EditBudget"
                component={EditBudget}
                options={{ title: 'Edit Budget', headerShown: false }} // Ensure EditBudget is properly referenced
              />
              <Stack.Screen
                name="CategoryExpense"
                component={CategoryExpenseScreen}
                options={{ title: 'Category Expenses', headerShown: false }} // New screen for category-specific expenses
              />
              <Stack.Screen
                name="GoogleMapsScreen"
                component={GoogleMapScreen}
                options={{ headerShown: false }} // New screen for category-specific expenses
              />
              <Stack.Screen
                name="AboutScreen"
                component={AboutScreen}
                options={{ headerShown: false }} // New screen for category-specific expenses
              />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
