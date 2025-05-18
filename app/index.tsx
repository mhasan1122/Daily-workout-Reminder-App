//crate hello world in react native using tailwind css bg color red

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from './contexts/AuthContext';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const router = useRouter();
  const { login, signup } = useAuth();

  // Simple email validation
  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = () => {
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isEmailValid(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        let success;
        if (isLogin) {
          success = await login(email, password);
        } else {
          success = await signup(email, password);
        }
        
        if (success) {
          router.replace('/(app)/home');
        } else {
          Alert.alert(
            'Authentication Failed', 
            isLogin ? 'Invalid credentials' : 'Failed to create account'
          );
        }
      } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred');
        console.error(error);
      }
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'An email with reset instructions has been sent (simulated).',
      [{ text: 'OK' }]
    );
  };

  return (
    <View className="flex-1 bg-gray-100 px-6 justify-center">
      <View className="bg-white rounded-xl p-6 shadow-md">
        <Text className="text-3xl font-bold text-center mb-8 text-amber-500">
          {isLogin ? 'Login' : 'Sign Up'}
        </Text>

        <View className="mb-4">
          <Text className="text-gray-700 text-sm mb-1">Email</Text>
          <TextInput
            className={`bg-gray-50 border ${emailError ? 'border-red-300' : 'border-gray-300'} rounded-md px-4 py-3`}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          {emailError ? <Text className="text-red-500 text-xs mt-1">{emailError}</Text> : null}
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 text-sm mb-1">Password</Text>
          <TextInput
            className={`bg-gray-50 border ${passwordError ? 'border-red-300' : 'border-gray-300'} rounded-md px-4 py-3`}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {passwordError ? <Text className="text-red-500 text-xs mt-1">{passwordError}</Text> : null}
        </View>

        <TouchableOpacity
          className="bg-amber-500 rounded-md py-3 mb-4"
          onPress={handleSubmit}
        >
          <Text className="text-white font-semibold text-center">
            {isLogin ? 'Login' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        {isLogin && (
          <TouchableOpacity
            className="mb-4"
            onPress={handleForgotPassword}
          >
            <Text className="text-amber-600 text-center">Forgot Password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text className="text-gray-600 text-center">
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
