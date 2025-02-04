import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { fetchGroupWorkoutDetails, addParticipantsToWorkout, fetchSuggestedWeights } from '../../utils/api';

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
        console.log("🔄 Fetching workout details for ID:", workoutId);

        let fetchedWorkout = workoutDetails;
        if (!fetchedWorkout) {
          fetchedWorkout = await fetchGroupWorkoutDetails(workoutId);
        }

        setWorkout(fetchedWorkout);
        setParticipants(fetchedWorkout.participants || []);
        setExercises(fetchedWorkout.exercises || []);

        // ✅ Fetch suggested weights after setting participants
        const suggestedWeights = await fetchSuggestedWeights(workoutId);
        console.log("💪 Suggested weights received:", suggestedWeights);

        if (Array.isArray(suggestedWeights) && suggestedWeights.length > 0) {
          const participantWeightsMap = {};

          // 🔄 Process each suggested weight and map it correctly
          suggestedWeights.forEach((sw) => {
            if (!participantWeightsMap[sw.user_id]) {
              participantWeightsMap[sw.user_id] = {};
            }

            // 🔥 Assign only the correct suggested weight
            participantWeightsMap[sw.user_id][sw.exercise_id] = sw.suggested_weight;
          });

          // ✅ Map weights to participants
          setParticipants((prevParticipants) =>
            prevParticipants.map((participant) => ({
              ...participant,
              weights: participantWeightsMap[participant.user_id] || {},
            }))
          );
        } else {
          console.warn("⚠️ No suggested weights found.");
        }
      } catch (error) {
        console.error('❌ Error fetching workout details:', error.message);
        Alert.alert('Error', 'Failed to fetch workout details.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadWorkoutDetails();
  }, [workoutId]);


  const handleWeightChange = (participantIndex, exerciseId, value) => {
    setParticipants((prevParticipants) => {
      const updatedParticipants = [...prevParticipants];
      const participant = updatedParticipants[participantIndex];

      if (!participant.weights) {
        participant.weights = {};
      }

      participant.weights[exerciseId] = value;
      return updatedParticipants;
    });
  };

  const handleAddParticipant = () => {
    if (!newParticipant.trim()) {
      Alert.alert('Error', 'Please enter a valid participant name.');
      return;
    }
    setParticipants((prev) => [
      ...prev,
      { user_id: Date.now(), participant_name: newParticipant, weights: {} }, // 🔥 Temporary ID for new participant
    ]);
    setNewParticipant('');
  };

  const handleAddExercise = () => {
    if (!newExercise.trim()) {
      Alert.alert('Error', 'Please enter a valid exercise name.');
      return;
    }
    setExercises((prev) => [
      ...prev,
      { exercise_id: Date.now(), exercise_name: newExercise }, // 🔥 Temporary ID for new exercise
    ]);
    setNewExercise('');
  };

  const handleStartTraining = () => {
    if (!workoutId || !workout) {
      Alert.alert("Error", "Workout data is missing.");
      return;
    }
  
    const workoutToSend = {
      ...workout,
      participants: participants.map((participant) => ({
        user_id: participant.user_id,
        participant_name: participant.participant_name,
        weights: { ...participant.weights }, // ✅ Ensure weights are carried over
      })),
      exercises: exercises.map((exercise) => ({
        exercise_id: exercise.exercise_id,
        exercise_name: exercise.exercise_name,
      })),
    };
  
    console.log("🚀 Navigating to TrainerScreen with data:", workoutToSend);
  
    navigation.navigate('TrainerScreen', { workoutId, workoutDetails: workoutToSend });
  };
  

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
        <Text style={styles.header}>{workout?.name || 'Edit Workout'}</Text>

        {/* Add Participant */}
        <View style={styles.addParticipantContainer}>
          <TextInput
            style={styles.participantInput}
            placeholder="Enter participant name"
            value={newParticipant}
            onChangeText={setNewParticipant}
          />
          <TouchableOpacity
            style={styles.addParticipantButton}
            onPress={handleAddParticipant}
          >
            <Text style={styles.addParticipantButtonText}>Add Participant</Text>
          </TouchableOpacity>
        </View>

        {/* Add Exercise */}
        <View style={styles.addParticipantContainer}>
          <TextInput
            style={styles.participantInput}
            placeholder="Enter exercise name"
            value={newExercise}
            onChangeText={setNewExercise}
          />
          <TouchableOpacity
            style={styles.addParticipantButton}
            onPress={handleAddExercise}
          >
            <Text style={styles.addParticipantButtonText}>Add Exercise</Text>
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
        <Text style={styles.exerciseOrder}>{exerciseIndex + 1}.</Text>
        <Text style={styles.exerciseText}>{exercise.exercise_name}</Text>
      </View>

      {participants.map((participant, participantIndex) => {
        const weight = participant.weights?.[exercise.exercise_id]; // ✅ Safely extract weight

        return (
          <TextInput
            key={`${participantIndex}-${exercise.exercise_id}`}
            style={styles.input}
            placeholder="Weight"
            keyboardType="numeric"
            value={
              weight === 0 || weight === null || weight === undefined
                ? 'Body Weight'  // ✅ Ensure correct display for 0/null/undefined
                : weight.toString()
            }
            onChangeText={(value) =>
              handleWeightChange(participantIndex, exercise.exercise_id, value)
            }
          />
        );
      })}
    </View>
  ))}
</ScrollView>

          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.startButton} onPress={handleStartTraining}>
            <Text style={styles.startButtonText}>Start Training</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  addParticipantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  participantInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  addParticipantButton: {
    marginLeft: 8,
    backgroundColor: '#28A745',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addParticipantButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // GRID LAYOUT STYLES
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  gridContainer: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  firstColumn: {
    width: 200, // More space for exercise names
    backgroundColor: '#bbdefb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightWidth: 2,
    borderRightColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  exerciseCell: {
    width: 200, // Align exercise names properly
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#bbdefb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 2,
    borderRightColor: '#ddd',
  },
  exerciseOrder: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  exerciseText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    flex: 1,
    textAlign: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#28A745',
    padding: 14,
    borderRadius: 8,
    width: '48%',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#0056A6',
    padding: 14,
    borderRadius: 8,
    width: '48%',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
