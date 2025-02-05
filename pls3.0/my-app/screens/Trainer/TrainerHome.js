import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logo = require('../../imgs/Horizon.png'); // Ensure correct path

export default function TrainerHome({ navigation }) {
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Logged Out', 'You have been logged out.');
      navigation.replace('Login'); // Redirect to login
    } catch (error) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logout Button - Top Right */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>🚪 Logout</Text>
      </TouchableOpacity>

      {/* Horizon Logo */}
      <Image source={logo} style={styles.logo} />

      <Text style={styles.header}>Trainer Dashboard</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('WorkoutsMenu')}>
        <Text style={styles.buttonText}>🏋️ Workout Overview</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ClientOverview')}>
        <Text style={styles.buttonText}>👥 Client Overview</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fc6e4c', // Horizon Orange
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10, // Ensure it's above other content
  },
  logoutButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  logo: {
    width: 150,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3274ba', // Horizon Blauw
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#f7bf0b', // Horizon Gold
    padding: 16,
    borderRadius: 8,
    width: '80%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4, // Increased shadow for depth
  },
  buttonText: {
    color: '#1A1A1A',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
