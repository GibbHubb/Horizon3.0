import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../utils/api';

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
      console.log('Attempting login...');
      const response = await loginUser(username, password);
      console.log('Login response:', response);
  
      const { token, refreshToken, user } = response;
  
      // Save tokens and user role
      await AsyncStorage.setItem('authToken', token);
      console.log('authToken saved:', token);
  
      await AsyncStorage.setItem('refreshToken', refreshToken);
      console.log('refreshToken saved:', refreshToken);
  
      await AsyncStorage.setItem('userRole', user.role);
      console.log('userRole saved:', user.role);
  
      // Navigate based on role
      if (user.role === 'client' || user.role === 'user') {
        console.log('Navigating to ClientHome');
        navigation.replace('ClientHome');
      } else if (user.role === 'pt' || user.role === 'masterPt') {
        console.log('Navigating to TrainerHome');
        navigation.replace('TrainerHome');
      } else {
        console.log('Invalid user role:', user.role);
        Alert.alert('Error', 'Invalid user role.');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      Alert.alert('Login Failed', error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login to Horizon!</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0056A6" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#0056A6',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: 16,
    backgroundColor: '#0056A6',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
