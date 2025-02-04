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




  // Returning Client - Show Main Home Screen
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Button
        title="Intake"
        onPress={() => navigation.navigate('IntakeScreen')}
      />      
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
