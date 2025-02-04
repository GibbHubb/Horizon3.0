import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchIntakeData, submitIntakeData } from '../../utils/api';

const IntakeScreen = ({ navigation }) => {
  const [intakeData, setIntakeData] = useState({
    client_name: '',
    sex: '',
    age: '',
    fat_percentage: '',
    height_cm: '',
    weight_category: '',
    bmi: '',
    ffmi: '',
    athleticism_score: '',
    movement_shoulder: '',
    movement_hips: '',
    movement_ankles: '',
    movement_thoracic: '',
    genetics: '',
  });

  useEffect(() => {
    const loadIntakeData = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id');
        if (!user_id) {
          Alert.alert('Error', 'User ID not found');
          return;
        }
        const data = await fetchIntakeData(user_id);
        setIntakeData(data);
      } catch (error) {
        Alert.alert('Error', 'Could not load intake data.');
      }
    };
    loadIntakeData();
  }, []);

  const handleChange = (key, value) => {
    setIntakeData({ ...intakeData, [key]: value });
  };

  const submitIntake = async () => {
    try {
      await submitIntakeData(intakeData);
      Alert.alert('Success', 'Intake data submitted successfully!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Submission failed.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.title}>Client Intake</Text>
      
      {Object.keys(intakeData).map((key) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key.replace('_', ' ')}
          value={intakeData[key]}
          onChangeText={(value) => handleChange(key, value)}
          keyboardType="numeric"
        />
      ))}
      <Button title="Submit Intake" onPress={submitIntake} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5, width: '100%' },
});

export default IntakeScreen;
