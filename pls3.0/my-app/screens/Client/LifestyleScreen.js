import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchLifestyleData, submitLifestyleData } from '../../utils/api';

const logo = require('../../imgs/Horizon.png'); // Ensure correct path

const LifestyleScreen = ({ navigation }) => {
    const [stress, setStress] = useState('');
    const [sleep, setSleep] = useState('');
    const [soreness, setSoreness] = useState('');
    const [calories, setCalories] = useState('');
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState(''); // Allow logging notes to trainer
    const [lifestyleData, setLifestyleData] = useState([]);

    const fetchLifestyleDataHandler = async () => {
        try {
            const data = await fetchLifestyleData();

            if (Array.isArray(data)) {
                setLifestyleData(data);
            } else {
                console.error('Unexpected API response:', data);
                setLifestyleData([]);
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    useEffect(() => {
        fetchLifestyleDataHandler();
    }, []);

    const handleSubmitLifestyleData = async () => {
        if (!stress || !sleep || !soreness || !calories || !weight) {
            Alert.alert('Error', 'Please fill in all fields before submitting.');
            return;
        }

        try {
            await submitLifestyleData({ stress, sleep, soreness, calories, weight, notes_to_trainer: notes });
            Alert.alert('Success', 'Lifestyle data added successfully');
            fetchLifestyleDataHandler(); // Refresh data
            setNotes(''); // Clear notes input after submission
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const renderSelector = (label, value, setValue) => (
        <View style={styles.selectorContainer}>
            <Text style={styles.label}>{label} (1 = Worst, 5 = Best)</Text>
            <View style={styles.selectorRow}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={[
                            styles.selectorButton,
                            value == num && styles.selectedButton
                        ]}
                        onPress={() => setValue(num)}
                    >
                        <Text style={styles.selectorText}>{num}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            {/* Horizon Logo */}
            <Image source={logo} style={styles.logo} />

            <Text style={styles.title}>Lifestyle Check-in</Text>

            {/* Selectors for Stress, Sleep, and Soreness */}
            {renderSelector("Stress Level", stress, setStress)}
            {renderSelector("Sleep Quality", sleep, setSleep)}
            {renderSelector("Soreness Level", soreness, setSoreness)}

            <TextInput
                style={styles.input}
                placeholder="Calories Consumed"
                placeholderTextColor="#555"
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Weight"
                placeholderTextColor="#555"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Notes to Trainer (Optional)"
                placeholderTextColor="#555"
                value={notes}
                onChangeText={setNotes}
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmitLifestyleData}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>

            <Text style={styles.subtitle}>Last 3 Submissions</Text>

            {/* Display Previous Entries (Last 3 Only) */}
            <View style={styles.submissionsContainer}>
                {lifestyleData.length > 0 ? (
                    <FlatList
                        data={lifestyleData.slice(0, 3)} // Take only the last 3 submissions
                        keyExtractor={(item) => item.lifestyle_id?.toString() || Math.random().toString()}
                        horizontal // 🔥 Enables horizontal scrolling
                        showsHorizontalScrollIndicator={false} // Hide scrollbar
                        inverted // 🔥 Ensures most recent entry is on the left
                        renderItem={({ item }) => (
                            <View style={styles.submissionBox}>
                                <Text style={styles.submissionDate}>{new Date(item.date).toLocaleDateString()}</Text>
                                <Text style={styles.submissionText}>💆 Stress: {item.stress}</Text>
                                <Text style={styles.submissionText}>😴 Sleep: {item.sleep} hrs</Text>
                                <Text style={styles.submissionText}>💪 Soreness: {item.soreness}</Text>
                                <Text style={styles.submissionText}>🔥 Calories: {item.calories}</Text>
                                <Text style={styles.submissionText}>⚖️ Weight: {item.weight} kg</Text>
                                {item.notes_to_trainer ? <Text style={styles.submissionText}>📝 {item.notes_to_trainer}</Text> : null}
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.noEntriesText}>No submissions yet.</Text>
                )}
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
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
        color: '#3274ba',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
        width: '100%',
        backgroundColor: '#f8f8f8',
        borderColor: '#8ebce6',
        color: '#1A1A1A',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#f7bf0b',
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
    button: {
        width: '90%',
        padding: 15,
        backgroundColor: '#f7bf0b',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
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
    listText: {
        color: '#1A1A1A',
        fontSize: 16,
    },
    selectorContainer: {
        width: '100%',
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#3274ba',
    },
    selectorRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    selectorButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#3274ba',
        width: 50,
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: '#3274ba',
    },
    selectorText: {
        fontSize: 16,
        color: '#1A1A1A',
    }, submissionsContainer: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
    },

    submissionBox: {
        backgroundColor: '#f8f8f8',
        padding: 12,
        borderRadius: 8,
        width: 150, // Controls the size of each submission box
        marginHorizontal: 8, // Spacing between items
        alignItems: 'center',
        borderLeftWidth: 5,
        borderLeftColor: '#3274ba',
    },

    submissionDate: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3274ba',
        marginBottom: 5,
    },

    submissionText: {
        fontSize: 14,
        color: '#1A1A1A',
        textAlign: 'center',
    },

    noEntriesText: {
        fontSize: 16,
        color: '#999',
        fontStyle: 'italic',
    },

});

export default LifestyleScreen;
