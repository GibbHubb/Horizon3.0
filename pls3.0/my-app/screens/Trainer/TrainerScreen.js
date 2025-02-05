import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image 
} from 'react-native';
import { io } from 'socket.io-client';
import { fetchGroupWorkoutDetails, fetchMinimumWeights } from '../../utils/api'; // Backend calls

const logo = require('../../imgs/Horizon.png'); // Ensure correct path

export default function TrainerScreen({ route, navigation }) {
    const { workoutId, workoutDetails } = route.params || {};
    const [workout, setWorkout] = useState(workoutDetails || { exercises: [], participants: [] });
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timer, setTimer] = useState(3000);
    const [timerRunning, setTimerRunning] = useState(false);
   // const socket = io('http://192.168.1.100:3000');

    useEffect(() => {
        if (workoutDetails) {
            setWorkout(workoutDetails);
        }
    }, [workoutDetails]);

    useEffect(() => {
        socket.emit('workoutUpdate', workout);
    }, [workout]);

    useEffect(() => {
        if (timerRunning && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timerRunning, timer]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const groupColors = ['#FF6B6B', '#4CAF50', '#FFA500', '#5D6D7E'];
    const getExerciseForGroup = (groupIndex) => (currentExerciseIndex + groupIndex) % workout.exercises.length;
    
    const handleNextExercise = () => {
        setCurrentExerciseIndex((prev) => (prev + 1) % workout.exercises.length);
    };

    return (
        <View style={styles.container}>
            {/* Horizon Logo */}
            <Image source={logo} style={styles.logo} />

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.header}>{workout?.name || 'Trainer View'}</Text>

            <ScrollView horizontal>
                <View>
                    <View style={styles.headerRow}>
                        <View style={styles.exerciseColumn} />
                        {workout.participants.map((participant, index) => (
                            <Text key={index} style={[styles.headerCell, { backgroundColor: groupColors[index % groupColors.length] }]}>
                                {participant.participant_name}
                            </Text>
                        ))}
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        {workout.exercises.map((exercise, exerciseIndex) => (
                            <View key={exerciseIndex} style={styles.row}>
                                <View style={styles.exerciseColumn}>
                                    <Text style={styles.exerciseText}>{exercise.exercise_name}</Text>
                                </View>
                                {workout.participants.map((participant, participantIndex) => {
                                    const weight = participant.weights?.[exercise.exercise_id] ?? ''; 
                                    const groupIndex = Math.floor(participantIndex / 3);
                                    const isCurrentExercise = getExerciseForGroup(groupIndex) === exerciseIndex;

                                    return (
                                        <TextInput
                                            key={participantIndex}
                                            style={[
                                                styles.input,
                                                isCurrentExercise ? styles.highlightedInput : styles.disabledInput,
                                            ]}
                                            keyboardType="numeric"
                                            value={weight === 0 ? 'Body Weight' : weight.toString()} 
                                            editable={isCurrentExercise}
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
                <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>{formatTime(timer)}</Text>
                </View>
                <TouchableOpacity style={styles.startButton} onPress={() => setTimerRunning(true)}>
                    <Text style={styles.startButtonText}>Start Timer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextButton} onPress={handleNextExercise}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
    
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#8ebce6' },
    logo: { width: 150, height: 80, resizeMode: 'contain', marginBottom: 20, alignSelf: 'center' },
    header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#f6b000', marginBottom: 16 },
    backButton: { backgroundColor: '#f6b000', padding: 10, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10 },
    backButtonText: { color: '#1A1A1A', fontWeight: 'bold', fontSize: 16 },
    scrollContainer: { flexGrow: 1, paddingBottom: 16 },
    headerRow: { flexDirection: 'row', backgroundColor: '#3274ba', borderBottomWidth: 2, borderBottomColor: '#ddd' },
    headerCell: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, textAlign: 'center', fontWeight: 'bold', fontSize: 16, color: '#fff' },
    exerciseColumn: { width: 150, backgroundColor: '#bbdefb', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, fontWeight: 'bold', textAlign: 'center' },
    row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    exerciseText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    highlightedInput: { backgroundColor: '#FFFF99', borderColor: '#FFD700' },
    disabledInput: { backgroundColor: '#EAEAEA', color: '#AAA' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, alignItems: 'center' },
    timerContainer: { backgroundColor: '#3274ba', padding: 20, borderRadius: 10, width: 120, alignItems: 'center' },
    timerText: { color: '#fff', fontWeight: 'bold', fontSize: 22 },
    startButton: { backgroundColor: '#f6b000', padding: 12, borderRadius: 8, width: '30%', alignItems: 'center' },
    startButtonText: { color: '#1A1A1A', fontWeight: 'bold', fontSize: 16 },
    nextButton: { backgroundColor: '#3274ba', padding: 12, borderRadius: 8, width: '30%', alignItems: 'center' },
    nextButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});


