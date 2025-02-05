import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchExercisePool, submitWorkout } from '../../utils/api';

const logo = require('../../imgs/Horizon.png'); // Ensure correct path

const TrainingScreen = ({ navigation }) => {
  const [exercisePool, setExercisePool] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    loadExercisePool();
  }, []);

  const loadExercisePool = async () => {
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        Alert.alert('Error', 'User ID not found');
        return;
      }
      const data = await fetchExercisePool(user_id);
      setExercisePool(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load exercise pool.');
    }
  };

  const addExercise = () => {
    if (!selectedExercise || !sets || !reps) {
      Alert.alert('Error', 'Please select an exercise and fill in sets and reps.');
      return;
    }
    const newExercise = { name: selectedExercise, sets, reps, weight };
    setExercises([...exercises, newExercise]);
    setSelectedExercise('');
    setSets('');
    setReps('');
    setWeight('');
  };

  const finishWorkout = async () => {
    if (exercises.length === 0) {
      Alert.alert('Error', 'No exercises added. Please add at least one exercise.');
      return;
    }
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        Alert.alert('Error', 'User ID not found');
        return;
      }
      const response = await submitWorkout(user_id, exercises);
      if (response.ok) {
        Alert.alert('Success', 'Workout saved successfully!');
        setExercises([]);
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit workout data');
    }
  };

  return (
    <View style={styles.container}>
              {/* Back Button - Top Left */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      {/* Horizon Logo */}
      <Image source={logo} style={styles.logo} />

      <Text style={styles.title}>Training Log</Text>

      {/* Exercise Picker */}
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedExercise} onValueChange={setSelectedExercise} style={styles.picker}>
          <Picker.Item label="Select an Exercise" value="" enabled={false} />
          {exercisePool.map((exercise, index) => (
            <Picker.Item key={index} label={exercise} value={exercise} />
          ))}
        </Picker>
      </View>

      {/* Input Fields */}
      <TextInput style={styles.input} placeholder="Sets" placeholderTextColor="#555" value={sets} onChangeText={setSets} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Reps" placeholderTextColor="#555" value={reps} onChangeText={setReps} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Weight (optional)" placeholderTextColor="#555" value={weight} onChangeText={setWeight} keyboardType="numeric" />

      {/* Styled Add Exercise Button */}
      <TouchableOpacity style={styles.button} onPress={addExercise}>
        <Text style={styles.buttonText}>➕ Add Exercise</Text>
      </TouchableOpacity>

      {/* Exercise List */}
      <Text style={styles.subtitle}>Workout Summary</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>🏋️ {item.name} - {item.sets} sets x {item.reps} reps {item.weight ? `@ ${item.weight} kg` : ''}</Text>
          </View>
        )}
      />

      {/* Styled Workout Finished Button */}
      <TouchableOpacity style={styles.buttonFinish} onPress={finishWorkout}>
        <Text style={styles.buttonText}>✅ Workout Finished</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background for clarity
  },
  logo: {
    width: 150,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3274ba', // Horizon Blauw
    marginBottom: 20,
  },
  pickerContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8ebce6', // Horizon Light Blue
    overflow: 'hidden',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderColor: '#8ebce6', // Horizon Light Blue
    color: '#1A1A1A',
  },
  button: {
    width: '90%',
    padding: 15,
    backgroundColor: '#f7bf0b', // Horizon Gold
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonFinish: {
    width: '90%',
    padding: 15,
    backgroundColor: '#3274ba', // Horizon Blue
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#1A1A1A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#3274ba',
  },
  listItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    marginVertical: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#3274ba',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#f7bf0b', // Horizon Gold
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    color: '#1A1A1A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listText: {
    color: '#1A1A1A',
    fontSize: 16,
  },
});

export default TrainingScreen;
