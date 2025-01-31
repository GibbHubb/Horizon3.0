import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { io } from 'socket.io-client';

export default function TrainerScreen({ route, navigation }) {
    const { workoutId, workoutDetails } = route.params || {};
    const [workout, setWorkout] = useState(workoutDetails || { exercises: [], participants: [] });

    const socket = io('http://192.168.1.100:3000'); // Local WebSocket for TV updates

    useEffect(() => {
        if (workoutDetails) {
            setWorkout(workoutDetails);
        }
    }, [workoutDetails]);

    useEffect(() => {
        socket.emit('workoutUpdate', workout); // Send updates to TV screen
    }, [workout]);

    const updateValue = (exerciseIndex, participantIndex, value) => {
        const updatedWorkout = { ...workout };
        updatedWorkout.participants[participantIndex].weights[exerciseIndex] = value;
        setWorkout(updatedWorkout);
        socket.emit('workoutUpdate', updatedWorkout);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.header}>{workout?.name || 'Trainer Screen'}</Text>

            <FlatList
                data={workout.exercises}
                keyExtractor={(item) => item.name}
                renderItem={({ item, index }) => (
                    <View style={styles.row}>
                        <Text style={styles.cell}>{item.name}</Text>
                        {workout.participants.map((participant, participantIndex) => (
                            <TextInput
                                key={participantIndex}
                                style={styles.input}
                                keyboardType="numeric"
                                value={participant.weights?.[index]?.toString() || ''}
                                onChangeText={(text) => updateValue(index, participantIndex, parseInt(text) || 0)}
                            />
                        ))}
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f8f8f8' },
    header: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
    backButton: { backgroundColor: '#FF6B6B', padding: 10, borderRadius: 8, marginBottom: 10 },
    backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc' },
    cell: { flex: 1, textAlign: 'center', padding: 10, fontSize: 16 },
    input: { flex: 1, textAlign: 'center', padding: 10, fontSize: 16, borderWidth: 1, borderColor: '#ccc', borderRadius: 5 },
});

