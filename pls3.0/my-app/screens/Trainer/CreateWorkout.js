import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { fetchExercises, createGroupWorkout } from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function CreateWorkout({ navigation }) {
  const [workoutName, setWorkoutName] = useState('');
  const [difficulty, setDifficulty] = useState('Novice');
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [exercises, setExercises] = useState([
    { exercise_id: null, name: '', repRange: '', sets: '', rir: '' },
  ]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]); // Store filtered exercises for search

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const fetchedExercises = await fetchExercises();
        setExerciseOptions(fetchedExercises);
      } catch (error) {
        console.error('Error fetching exercises:', error.message);
        Alert.alert('Error', 'Failed to fetch exercises.');
      } finally {
        setLoading(false);
      }
    };
    loadExercises();
  }, []);

  const addExercise = () => {
    setExercises([...exercises, { exercise_id: null, name: '', repRange: '', sets: '', rir: '' }]);
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index, field, value) => {
    setExercises(exercises.map((exercise, i) => (i === index ? { ...exercise, [field]: value } : exercise)));
  };

  const handleSearch = (text, index) => {
    updateExercise(index, 'name', text);
    if (text.length > 0) {
      const filtered = exerciseOptions.filter((option) =>
        option.name.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectExercise = (index, selectedExercise) => {
    setExercises((prevExercises) => {
      const updatedExercises = [...prevExercises];
      updatedExercises[index] = {
        ...updatedExercises[index],
        name: selectedExercise.name, // ✅ Set exercise name
        exercise_id: selectedExercise.exercise_id, // ✅ Set exercise ID
      };
      return updatedExercises;
    });
    setSearchResults([]); // ✅ Hide dropdown after selection
  };
  

  const handleSubmit = async () => {
    if (!workoutName.trim()) {
      Alert.alert('Error', 'Workout name is required.');
      return;
    }

    if (exercises.some((exercise) => !exercise.exercise_id)) {
      Alert.alert('Error', 'Please select an exercise for all exercise blocks.');
      return;
    }

    try {
      const trainerId = await AsyncStorage.getItem('trainer_id');
      if (!trainerId) {
        Alert.alert('Error', 'Trainer ID is missing. Please log in again.');
        return;
      }

      const payload = {
        name: workoutName,
        difficulty: difficulty,
        trainer_id: parseInt(trainerId, 10),
        date: new Date().toISOString(),
        exercises: exercises.map((exercise) => ({
          exercise_id: exercise.exercise_id,
          reps: exercise.repRange,
          sets: parseInt(exercise.sets, 10) || 0,
          weight: 0, // Backend requires weight, replacing RIR for now
        })),
        participants: [],
      };

      console.log('🚀 Sending payload:', JSON.stringify(payload, null, 2));

      const response = await createGroupWorkout(payload);
      console.log('✅ Response from backend:', response);

      if (!response || !response.groupWorkout || !response.groupWorkout.group_workout_id) {
        throw new Error('Invalid response structure from backend');
      }

      Alert.alert('Success', 'Workout created successfully!');

      navigation.replace('EditWorkout', {
        workoutId: response.groupWorkout.group_workout_id,
        workoutDetails: response.groupWorkout,
      });
    } catch (error) {
      console.error('❌ Error saving workout:', error.message);
      Alert.alert('Error', `Failed to create workout. ${error.message}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Create Workout</Text>

      <TextInput
        style={styles.workoutNameInput}
        placeholder="Workout Name"
        value={workoutName}
        onChangeText={setWorkoutName}
      />

      {/* Difficulty Selector */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Difficulty Level:</Text>
        <Picker selectedValue={difficulty} onValueChange={(itemValue) => setDifficulty(itemValue)} style={styles.picker}>
          <Picker.Item label="Novice" value="Novice" />
          <Picker.Item label="Beginner" value="Beginner" />
          <Picker.Item label="Intermediate" value="Intermediate" />
          <Picker.Item label="Advanced" value="Advanced" />
        </Picker>
      </View>

      {exercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseRow}>
          {/* Exercise Search */}
          <TextInput
            style={styles.exerciseInput}
            placeholder="Search Exercise"
            value={exercise.name}
            onChangeText={(text) => handleSearch(text, index)}
          />
          {searchResults.length > 0 && (
            <View style={styles.dropdownContainer}>
              {searchResults.map((option) => (
                <TouchableOpacity key={option.exercise_id} style={styles.dropdownItem} onPress={() => handleSelectExercise(index, option)}>
                  <Text>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Inputs */}
          <TextInput style={styles.exerciseInput} placeholder="Rep Range" value={exercise.repRange} onChangeText={(text) => updateExercise(index, 'repRange', text)} />
          <TextInput style={styles.exerciseInput} placeholder="Sets" keyboardType="numeric" value={exercise.sets} onChangeText={(text) => updateExercise(index, 'sets', text)} />

          {/* Remove Exercise Button */}
          <TouchableOpacity style={styles.removeButton} onPress={() => removeExercise(index)}>
            <Text style={styles.removeButtonText}>-</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addExercise}>
        <Text style={styles.addButtonText}>Add Exercise</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Save Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ✅ Styles remain consistent across the app
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f8f8' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  workoutNameInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 16 },
  backButton: { backgroundColor: '#FF6B6B', padding: 10, borderRadius: 8, marginBottom: 16 },
  backButtonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  pickerContainer: { marginBottom: 16 },
  exerciseRow: { marginBottom: 16 },
  exerciseInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 4 },
  removeButton: { backgroundColor: '#FF6B6B', padding: 8, borderRadius: 8, marginTop: 8 },
  removeButtonText: { color: '#fff', fontWeight: 'bold' },
  saveButton: { backgroundColor: '#28A745', padding: 16, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
});

