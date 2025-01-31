import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { fetchGroupWorkoutDetails, addParticipantsToWorkout } from '../../utils/api';

export default function EditWorkoutScreen({ route, navigation }) {
  const { workoutId, workoutDetails } = route.params || {};
  const [workout, setWorkout] = useState(workoutDetails || null);
  const [participants, setParticipants] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newParticipant, setNewParticipant] = useState('');

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const loadWorkoutDetails = async () => {
        try {
            if (!workoutDetails) {
                console.log("🔄 Fetching workout details for ID:", workoutId);
                const fetchedWorkout = await fetchGroupWorkoutDetails(workoutId);
                setWorkout(fetchedWorkout);
                setParticipants(fetchedWorkout.participants || []);
                setExercises(fetchedWorkout.exercises || []);
            } else {
                console.log("✅ Received workout details via navigation:", workoutDetails);
                setWorkout(workoutDetails);
                setParticipants(workoutDetails.participants || []);
                setExercises(workoutDetails.exercises || []);
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
}, [workoutId, workoutDetails]);

  const handleAddParticipant = () => {
    if (!newParticipant.trim()) {
      Alert.alert('Error', 'Please enter a valid participant name.');
      return;
    }
    setParticipants((prev) => [
      ...prev,
      { participant_name: newParticipant, weights: {} },
    ]);
    setNewParticipant('');
  };

  const handleWeightChange = (participantIndex, exerciseIndex, value) => {
    const updatedParticipants = [...participants];
    if (!updatedParticipants[participantIndex].weights) {
      updatedParticipants[participantIndex].weights = {};
    }
    updatedParticipants[participantIndex].weights[exerciseIndex] = value;
    setParticipants(updatedParticipants);
  };

  const handleSave = async () => {
    try {
      const payload = {
        participants: participants.map((participant) => ({
          participant_name: participant.participant_name,
          weights: participant.weights,
        })),
      };

      console.log('Saving participants to workout:', payload);
      await addParticipantsToWorkout(workoutId, payload.participants);
      Alert.alert('Success', 'Participants added successfully!');
    } catch (error) {
      console.error('Error saving participants:', error.message);
      Alert.alert('Error', 'Failed to save participants.');
    }
  };

  const handleStartTraining = () => {
    if (!workoutId || !workout) {
        Alert.alert("Error", "Workout data is missing.");
        return;
    }
    navigation.navigate('TrainerScreen', { workoutId, workoutDetails: { ...workout, participants, exercises } });
};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading workout details...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      horizontal={false} // Allow vertical scrolling for the whole page
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
  
        {/* Workout Header */}
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
  
        {/* Grid Layout */}
{/* Exercises & Weights Grid */}
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
        <View key={exerciseIndex} style={styles.row}>
          {/* Exercise Name Column */}
          <View style={styles.exerciseCell}>
            <Text style={styles.exerciseOrder}>{exerciseIndex + 1}.</Text>
            <Text style={styles.exerciseText}>{exercise?.name || exercise?.exercise_name || 'Unnamed Exercise'}</Text>
          </View>

          {/* Participant Weight Inputs */}
          {participants.map((participant, participantIndex) => (
            <TextInput
              key={participantIndex}
              style={styles.input}
              placeholder="Weight"
              keyboardType="numeric"
              value={participant.weights?.[exerciseIndex]?.toString() || ''}
              onChangeText={(value) =>
                handleWeightChange(participantIndex, exerciseIndex, value)
              }
            />
          ))}
        </View>
      ))}
    </ScrollView>
  </View>
</ScrollView>

  
        {/* Footer Controls */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartTraining}
          >
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
