import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { io } from 'socket.io-client';

//const socket = io('http://192.168.1.100:3000'); // Local network for trainer connection

const initialWorkoutData = [
    { exercise: 'Push Up', participants: { Wendy: 10, Michael: 15, Elizabeth: 20 } },
    { exercise: 'DB RDL', participants: { Wendy: 20, Michael: 30, Elizabeth: 25 } },
    { exercise: 'Goblet Squat', participants: { Wendy: 30, Michael: 25, Elizabeth: 40 } },
    { exercise: 'Lat Pulldown', participants: { Wendy: 50, Michael: 40, Elizabeth: 60 } }
];

const participantColors = {
    Wendy: '#FFADAD', 
    Michael: '#FFC48C', 
    Elizabeth: '#FFEB99',
    Agamem: '#B1E5FC',
    Bart: '#B0E57C',
    Rachel: '#C8A2C8',
    Ruth: '#A2D2FF',
    Shiva: '#8ECAE6',
    Rob: '#DDA15E',
    Carl: '#DDA0DD',
    Pasc: '#7DD3FC',
    Jim: '#6D6875',
    Cara: '#A8D5BA',
    Xubi: '#72EFDD'
};

const TVScreen = () => {
    const [workoutData, setWorkoutData] = useState(initialWorkoutData);

    useEffect(() => {
        console.log("Sending workout update to TV:", workout); // Debugging
        socket.emit('workoutUpdate', workout);
    }, [workout]);
    
    const updateValue = (exerciseIndex, participantIndex, value) => {
        const updatedWorkout = { ...workout };
        updatedWorkout.participants[participantIndex].weights[exerciseIndex] = value;
        setWorkout(updatedWorkout);
    
        console.log("Updated workout data being sent to TV:", updatedWorkout); // Debugging
        socket.emit('workoutUpdate', updatedWorkout);
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.headerCell}>Exercise</Text>
                {Object.keys(participantColors).map((participant) => (
                    <Text key={participant} style={[styles.headerCell, { backgroundColor: participantColors[participant] }]}>
                        {participant}
                    </Text>
                ))}
            </View>

            <FlatList
                data={workoutData}
                keyExtractor={(item) => item.exercise}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.cell}>{item.exercise}</Text>
                        {Object.keys(participantColors).map((participant) => (
                            <Text key={participant} style={[styles.cell, { backgroundColor: participantColors[participant] }]}>
                                {item.participants[participant] || '-'}
                            </Text>
                        ))}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#000',
        padding: 10
    },
    headerCell: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#fff',
        padding: 10
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        padding: 10,
        fontSize: 16
    }
});

export default TVScreen;
