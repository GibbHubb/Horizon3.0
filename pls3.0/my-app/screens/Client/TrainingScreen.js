import React, { useState, useEffect } from 'react';
import { View, Text, Picker, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchExercisePool, submitWorkout } from '../../utils/api';

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
      <Text style={styles.title}>Training Log</Text>
      
      <Text style={styles.label}>Select Exercise</Text>
      <Picker selectedValue={selectedExercise} onValueChange={setSelectedExercise} style={styles.picker}>
        {exercisePool.map((exercise, index) => (
          <Picker.Item key={index} label={exercise} value={exercise} />
        ))}
      </Picker>
      
      <TextInput style={styles.input} placeholder='Sets' value={sets} onChangeText={setSets} keyboardType='numeric' />
      <TextInput style={styles.input} placeholder='Reps' value={reps} onChangeText={setReps} keyboardType='numeric' />
      <TextInput style={styles.input} placeholder='Weight (optional)' value={weight} onChangeText={setWeight} keyboardType='numeric' />
      <Button title='Add Exercise' onPress={addExercise} />
      
      <FlatList
        data={exercises}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.name} - {item.sets} sets x {item.reps} reps {item.weight ? `@ ${item.weight} kg` : ''}</Text>
          </View>
        )}
      />
      
      <Button title='Workout Finished' onPress={finishWorkout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  picker: { height: 50, width: '100%' },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  listItem: { padding: 10, borderBottomWidth: 1, marginVertical: 5 },
});

export default TrainingScreen;
