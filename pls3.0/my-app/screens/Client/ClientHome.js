import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClientHome = ({ navigation }) => {
  const [isNewClient, setIsNewClient] = useState(null); // Null initially to differentiate loading state

  useEffect(() => {
    const checkClientStatus = async () => {
      try {
        const clientStatus = await AsyncStorage.getItem('client_status');
        setIsNewClient(clientStatus !== 'returning'); // If not 'returning', treat them as new
      } catch (error) {
        console.error('Error checking client status:', error.message);
        Alert.alert('Error', 'Unable to determine client status.');
      }
    };

    checkClientStatus();
  }, []);

  const handleCompleteIntake = async () => {
    try {
      await AsyncStorage.setItem('client_status', 'returning'); // Mark client as returning after completing intake
      setIsNewClient(false);
    } catch (error) {
      console.error('Error updating client status:', error.message);
      Alert.alert('Error', 'Unable to save intake status.');
    }
  };

  if (isNewClient === null) {
    // Loading state
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Checking your profile...</Text>
      </View>
    );
  }

  if (isNewClient) {
    // New Client - Show Intake Form
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to the Lifestyle App!</Text>
        <Text style={styles.subtitle}>
          Please complete the intake form to get started.
        </Text>
        <TouchableOpacity
          style={styles.intakeButton}
          onPress={handleCompleteIntake}
        >
          <Text style={styles.intakeButtonText}>Complete Intake Form</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Returning Client - Show Main Home Screen
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Button
        title="Lifestyle"
        onPress={() => navigation.navigate('LifestyleScreen')}
      />
      <Button
        title="Training"
        onPress={() => navigation.navigate('TrainingScreen')}
      />
      <Button
        title="Progress"
        onPress={() => navigation.navigate('ProgressScreen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  intakeButton: {
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  intakeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClientHome;
