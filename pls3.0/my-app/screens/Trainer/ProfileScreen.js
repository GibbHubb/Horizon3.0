import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity, 
  StyleSheet, 
  Image 
} from 'react-native';
import { fetchUserProfile } from '../../utils/api'; // API call to get user details

const logo = require('../../imgs/Horizon.png'); // Ensure correct path

export default function ProfileScreen({ route, navigation }) {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userDetails = await fetchUserProfile(userId);
        setUser(userDetails);
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f6b000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button (Top Left) */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* Horizon Logo */}
      <Image source={logo} style={styles.logo} />

      <Text style={styles.header}>User Profile</Text>

      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.label}>👤 Name:</Text>
          <Text style={styles.value}>{user.username}</Text>

          <Text style={styles.label}>🎂 Age:</Text>
          <Text style={styles.value}>{user.age ? user.age : 'Not available'}</Text>

          <Text style={styles.label}>📊 Progress:</Text>
          <Text style={styles.value}>{user.progress ? user.progress : 'No progress data'}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>User not found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF', // White Background
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#f7bf0b', // Horizon Gold
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3274ba', // Horizon Blauw
  },
  userInfo: {
    width: '90%',
    backgroundColor: '#f8f8f8', // Light Grey for contrast
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#3274ba', // Horizon Blauw
  },
  value: {
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginTop: 20,
  },
});
