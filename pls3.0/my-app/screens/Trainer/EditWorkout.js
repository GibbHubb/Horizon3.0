import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import { fetchGroupWorkoutDetails, addParticipantsToWorkout, fetchSuggestedWeights } from '../../utils/api';

const logo = require('../../imgs/Horizon.png'); // Ensure correct path

export default function EditWorkoutScreen({ route, navigation }) {
  const { workoutId, workoutDetails } = route.params || {};
  const [workout, setWorkout] = useState(workoutDetails || null);
  const [participants, setParticipants] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newParticipant, setNewParticipant] = useState('');
  const [newExercise, setNewExercise] = useState('');

  useEffect(() => {
    const loadWorkoutDetails = async () => {
      if (!workoutId) return;

      try {
        let fetchedWorkout = workoutDetails || await fetchGroupWorkoutDetails(workoutId);
        setWorkout(fetchedWorkout);
        setParticipants(fetchedWorkout.participants || []);
        setExercises(fetchedWorkout.exercises || []);

        // Fetch suggested weights
        const suggestedWeights = await fetchSuggestedWeights(workoutId);
        if (Array.isArray(suggestedWeights) && suggestedWeights.length > 0) {
          const participantWeightsMap = {};
          suggestedWeights.forEach((sw) => {
            if (!participantWeightsMap[sw.user_id]) participantWeightsMap[sw.user_id] = {};
            participantWeightsMap[sw.user_id][sw.exercise_id] = sw.suggested_weight;
          });

          setParticipants((prev) =>
            prev.map((p) => ({ ...p, weights: participantWeightsMap[p.user_id] || {} }))
          );
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch workout details.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadWorkoutDetails();
  }, [workoutId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading workout details...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Horizon Logo */}
        <Image source={logo} style={styles.logo} />

        <Text style={styles.header}>{workout?.name || 'Edit Workout'}</Text>

        {/* Add Participant */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter participant name"
            placeholderTextColor="#555"
            value={newParticipant}
            onChangeText={setNewParticipant}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if (!newParticipant.trim()) {
                Alert.alert('Error', 'Please enter a valid participant name.');
                return;
              }
              setParticipants([...participants, { user_id: Date.now(), participant_name: newParticipant, weights: {} }]);
              setNewParticipant('');
            }}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Add Exercise */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter exercise name"
            placeholderTextColor="#555"
            value={newExercise}
            onChangeText={setNewExercise}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if (!newExercise.trim()) {
                Alert.alert('Error', 'Please enter a valid exercise name.');
                return;
              }
              setExercises([...exercises, { exercise_id: Date.now(), exercise_name: newExercise }]);
              setNewExercise('');
            }}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Grid Layout */}
        <ScrollView horizontal>
          <View>
            {/* Participants Row */}
            <View style={styles.headerRow}>
              <View style={styles.firstColumn} /> {/* Empty top-left cell */}
              {participants.map((participant, index) => (
                <Text key={index} style={styles.headerCell}>
                  {participant.participant_name}
                </Text>
              ))}
            </View>

            {/* Exercises & Inputs */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {exercises.map((exercise, exerciseIndex) => (
                <View key={exercise.exercise_id || exerciseIndex} style={styles.row}>
                  <View style={styles.exerciseCell}>
                    <Text style={styles.exerciseText}>{exercise.exercise_name}</Text>
                  </View>

                  {participants.map((participant, participantIndex) => (
                    <TextInput
                      key={`${participantIndex}-${exercise.exercise_id}`}
                      style={styles.input}
                      placeholder="Weight"
                      keyboardType="numeric"
                      value={participant.weights?.[exercise.exercise_id]?.toString() || ''}
                      onChangeText={(value) => {
                        const updated = [...participants];
                        updated[participantIndex].weights[exercise.exercise_id] = value;
                        setParticipants(updated);
                      }}
                    />
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.startButton} onPress={() => {
            navigation.navigate('TrainerScreen', { workoutId, workoutDetails: { ...workout, participants, exercises } });
          }}>
            <Text style={styles.buttonText}>Start Training</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFFFFF' },
  logo: { width: 150, height: 80, resizeMode: 'contain', marginBottom: 20, alignSelf: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#3274ba', marginBottom: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  input: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#8ebce6', borderRadius: 8, backgroundColor: '#f8f8f8', color: '#1A1A1A' },
  addButton: { marginLeft: 8, backgroundColor: '#f7bf0b', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  buttonText: { color: '#1A1A1A', fontWeight: 'bold', fontSize: 16 },
  headerRow: { flexDirection: 'row', backgroundColor: '#3274ba' },
  headerCell: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 16, color: '#fff' },
  row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  exerciseCell: { width: 200, paddingVertical: 12, paddingHorizontal: 10, backgroundColor: '#8ebce6' },
  exerciseText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  saveButton: { backgroundColor: '#f7bf0b', padding: 14, borderRadius: 8, width: '48%', alignItems: 'center' },
  startButton: { backgroundColor: '#3274ba', padding: 14, borderRadius: 8, width: '48%', alignItems: 'center' },
});

