import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailPassword } from '../services/authservice';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  // Handle user login
  const handleLogin = async () => {
    try {
      await signInWithEmailPassword(email, password);
      navigation.replace('Main'); // Redirect to Main screen after successful login
    } catch (error) {
      alert(`Login Error: ${error.message}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F4F4F4' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust for both iOS and Android
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust offset for different platforms
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to Expensify!</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          {/* Email Address Input */}
          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />

          {/* Password Input */}
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#aaa"
          />

          {/* Sign In Button */}
          <TouchableOpacity onPress={handleLogin} style={styles.signinButton}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Forgot Password Link */}
          {/* <TouchableOpacity onPress={() => alert('Forgot Password Feature Coming Soon!')} style={styles.forgotPasswordWrapper}>
            <Text style={styles.linkText}>Forgot your password?</Text>
          </TouchableOpacity> */}

          {/* Navigation to Sign Up */}
          <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.bottomTextWrapper}>
            <Text style={styles.bottomText}>
              Don't have an account? <Text style={styles.linkText}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles for the Login Screen
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',  // Ensure the content is centered
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
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  signinButton: {
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
  forgotPasswordWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bottomTextWrapper: {
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
