import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../utils/api';

const backgroundImage = require('../imgs/BG.png'); // Ensure the correct path

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }
  
    setLoading(true);
  
    try {
      console.log('📡 Logging in...');
      const response = await loginUser(username, password);
      const { token, refreshToken, user } = response;
  
      console.log(`✅ Received login token: ${token}`);
      console.log(`👤 User role: ${user.role}`);
      console.log(`🆔 User ID: ${user.user_id}`);  // Log user ID
  
      // Store tokens & user ID
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('refreshToken', refreshToken || '');
      await AsyncStorage.setItem('userRole', user.role);
      await AsyncStorage.setItem('user_id', user.user_id.toString());  // 🔥 Store user_id separately
  
      console.log('🔐 Tokens & User ID stored, navigating to home');
  
      if (user.role === 'client' || user.role === 'user') {
        navigation.replace('ClientHome');
      } else if (user.role === 'pt' || user.role === 'masterPt') {
        navigation.replace('TrainerHome');
      } else {
        Alert.alert('Error', 'Invalid user role.');
      }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      Alert.alert('Login Failed', error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.overlay}>
        <Text style={styles.header}>Login to Horizon</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#ddd"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ddd"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color="#F6B000" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1, // Ensures full height and width
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for readability
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#F6B000', // Horizon Gold
  },
  input: {
    width: '90%',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent input field
    color: '#fff',
  },
  button: {
    width: '90%',
    padding: 16,
    backgroundColor: '#F6B000',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1A1A1A',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
