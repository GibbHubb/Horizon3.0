import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchIntakeData, submitIntakeData } from '../../utils/api';

const logo = require('../../imgs/Horizon.png');

const IntakeScreen = ({ navigation }) => {
  const [intakeData, setIntakeData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadIntakeData = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id');
        if (!user_id) {
          Alert.alert('Error', 'User ID not found');
          return;
        }
        const data = await fetchIntakeData(user_id);
        if (data && Object.keys(data).length > 0) {
          setIntakeData(data);
          setSubmitted(true);
        }
      } catch (error) {
        Alert.alert('Error', 'Could not load intake data.');
      }
    };
    loadIntakeData();
  }, []);

  const handleChange = (key, value) => {
    if (!submitted) {
      setIntakeData({ ...intakeData, [key]: value });
    }
  };

  const calculateBMI = () => {
    const heightMeters = intakeData.height_cm / 100;
    if (intakeData.weight_category && intakeData.height_cm) {
      return (intakeData.weight_category / (heightMeters * heightMeters)).toFixed(2);
    }
    return '';
  };

  const validateFields = () => {
    return Object.values(intakeData).every((value) => value !== '');
  };

  const submitIntake = async () => {
    if (!validateFields()) {
      Alert.alert('Error', 'Please fill in all fields before submitting.');
      return;
    }

    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        throw new Error('User ID not found. Please log in again.');
      }

      const intakePayload = {
        ...intakeData,
        user_id,
        bmi: calculateBMI(),
      };

      await submitIntakeData(intakePayload);
      Alert.alert('Success', 'Intake data submitted successfully!');
      setSubmitted(true);
    } catch (error) {
      Alert.alert('Error', error.message || 'Submission failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>Client Intake</Text>

        {Object.entries({
          client_name: 'Enter Client Name',
          sex: '1 = Female, 2 = Male',
          age: '1-5 Age Group',
          fat_percentage: 'Fat Percentage (1-5)',
          height_cm: 'Height in cm',
          weight_category: 'Weight Category (1-5)',
          ffmi: 'FFMI (1-5)',
          athleticism_score: 'Athleticism (1-5)',
          movement_shoulder: 'Shoulder Mobility (1-5)',
          movement_hips: 'Hip Mobility (1-5)',
          movement_ankles: 'Ankle Mobility (1-5)',
          movement_thoracic: 'Thoracic Mobility (1-5)',
          genetics: 'Genetics (1-5)',
        }).map(([key, description]) => (
          <View key={key} style={styles.inputContainer}>
            <Text style={styles.label}>{description}</Text>
            <TextInput
              style={[styles.input, submitted && styles.inputDisabled]}
              placeholder={key.replace('_', ' ')}
              placeholderTextColor="#555"
              value={intakeData[key]}
              onChangeText={(value) => handleChange(key, value)}
              keyboardType="numeric"
              editable={!submitted}
            />
          </View>
        ))}

        <View style={styles.bmiContainer}>
          <Text style={styles.label}>BMI (Auto Calculated)</Text>
          <Text style={styles.bmiValue}>{calculateBMI()}</Text>
        </View>

        {!submitted && (
          <TouchableOpacity style={styles.button} onPress={submitIntake}>
            <Text style={styles.buttonText}>Submit Intake</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContainer: { flexGrow: 1, padding: 20, alignItems: 'center' },
  backButton: { position: 'absolute', top: 20, left: 20, backgroundColor: '#f7bf0b', padding: 10, borderRadius: 8 },
  backButtonText: { color: '#1A1A1A', fontWeight: 'bold', fontSize: 16 },
  logo: { width: 150, height: 80, resizeMode: 'contain', marginBottom: 20, marginTop: 60 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#3274ba', marginBottom: 20 },
  inputContainer: { marginBottom: 15, width: '100%' },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#3274ba' },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, width: '100%', backgroundColor: '#f8f8f8', borderColor: '#8ebce6' },
  inputDisabled: { backgroundColor: '#e0e0e0', color: '#555' },
  bmiContainer: { marginBottom: 15, width: '100%', alignItems: 'center', padding: 12, backgroundColor: '#8ebce6', borderRadius: 8 },
  bmiValue: { fontSize: 18, fontWeight: 'bold', color: '#f7bf0b' },
  button: { width: '90%', padding: 15, backgroundColor: '#f7bf0b', borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#1A1A1A', fontSize: 18, fontWeight: 'bold' },
});

export default IntakeScreen;
