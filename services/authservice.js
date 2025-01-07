import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';

// Get Current User ID
export const getCurrentUserId = () => {
  const user = FIREBASE_AUTH.currentUser;
  return user ? user.uid : null;
};

// Email/Password Sign-In Function
export const signInWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Email/Password Sign-In Error:', error);
    throw error;
  }
};

// Email/Password Sign-Up Function
export const signUpWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
    const user = userCredential.user;

    

    return user;
  } catch (error) {
    console.error('Email/Password Sign-Up Error:', error);
    throw error;
  }
};



// Sign Out Function
export const logOut = async () => {
  try {
    await signOut(FIREBASE_AUTH);
    console.log("User signed out successfully!");
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
};

