import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logo = require('../../imgs/Horizon.png'); // Adjust path if needed

const ClientHome = ({ navigation }) => {
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

      <Text style={styles.title}>Welcome Back!</Text>

      {/* Styled Buttons */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('IntakeScreen')}>
        <Text style={styles.buttonText}>📋 Intake</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LifestyleScreen')}>
        <Text style={styles.buttonText}>🌿 Lifestyle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TrainingScreen')}>
        <Text style={styles.buttonText}>💪 Training</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ProgressScreen')}>
        <Text style={styles.buttonText}>📊 Progress</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
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
    width: 160,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3274ba', // Horizon Blauw
    marginBottom: 20,
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#f7bf0b', // Horizon Gold
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ClientHome;
