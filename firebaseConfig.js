import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getAuth,getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';  // Import Expo Notifications
import { getToken,getMessaging } from 'firebase/messaging';



const firebaseConfig = {
  apiKey: "AIzaSyAzI6Ox7f2Tzd_sQfgQUf80Dvm3EuO3jT8",
  authDomain: "expensify-802b2.firebaseapp.com",
  projectId: "expensify-802b2",
  storageBucket: "expensify-802b2.appspot.com",
  messagingSenderId: "2348975214",
  appId: "1:2348975214:web:b1b0a5108064815fd3127f",
  measurementId: "G-Z34LXSHB1W",
};

let FIREBASE_APP;
if (!getApps().length) {
  FIREBASE_APP = initializeApp(firebaseConfig);
} else {
  FIREBASE_APP = getApps()[0];
}

export const FIRESTORE_DB = getFirestore(FIREBASE_APP);


let FIREBASE_AUTH;
try {
  FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  FIREBASE_AUTH = getAuth();
}

// const messaging = getMessaging(FIREBASE_APP);

// // Get FCM Token
// export const getPushNotificationToken = async () => {
//   try {
//     const token = await getToken(messaging, {
//       vapidKey: 'BNcBz1j4fCRWuKYP-PDvwxGKYvumW9WrR7pL4-o_eqqmfrMLhvyRMCfSjipcmTLeEKx2lsThAEAzwnXkex2gX_Q',
//     });
//     console.log('Push Notification Token:', token);
//     return token;
//   } catch (error) {
//     console.error('Error getting push notification token:', error);
//     throw error;
//   }
// };

// // Listen for foreground notifications using Expo
// Notifications.addNotificationReceivedListener((notification) => {
//   console.log('Notification received in foreground:', notification);
// });

export { FIREBASE_APP, FIREBASE_AUTH };
