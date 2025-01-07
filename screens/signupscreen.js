// screens/signupscreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signUpWithEmailPassword } from '../services/authservice';

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  // Handle user registration
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      await signUpWithEmailPassword(email, password);
      navigation.replace('Login'); // Redirect to Login screen after successful sign-up
    } catch (error) {
      alert(`Sign Up Error: ${error.message}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F4F4F4' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={60}  // Adjust the offset as necessary
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Register account</Text>
          <Text style={styles.subtitle}>Create an account to continue</Text>

          <TextInput
            placeholder="First name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
          />
          <TextInput
            placeholder="Last name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder="Repeat password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity onPress={handleSignup} style={styles.registerButton}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          {/* Sign-in navigation link */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.bottomTextWrapper}>
            <Text style={styles.bottomText}>
              Already have an account? <Text style={styles.linkText}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles for the Sign-Up Screen
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,  // Add padding for better spacing when keyboard is open
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  registerButton: {
    backgroundColor: '#5D5FEF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  bottomTextWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },
  bottomText: {
    color: '#666',
  },
  linkText: {
    color: '#5D5FEF',
    fontWeight: 'bold',
  },
});
