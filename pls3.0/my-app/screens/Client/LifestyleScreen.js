import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LifestyleScreen = ({ navigation }) => {
  const [stress, setStress] = useState('');
  const [sleep, setSleep] = useState('');
  const [soreness, setSoreness] = useState('');
  const [calories, setCalories] = useState('');
  const [weight, setWeight] = useState('');
  const [lifestyleData, setLifestyleData] = useState([]);
  
  useEffect(() => {
    fetchLifestyleData();
  }, []);

  const fetchLifestyleData = async () => {
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        Alert.alert('Error', 'User ID not found');
        return;
      }
      
      const response = await fetch(`https://your-api-url.com/lifestyle/${user_id}`);
      const data = await response.json();
      
      if (response.ok) {
        setLifestyleData(data);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch lifestyle data');
    }
  };

  const submitLifestyleData = async () => {
    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        Alert.alert('Error', 'User ID not found');
        return;
      }
      
      const response = await fetch('https://your-api-url.com/lifestyle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stress, sleep, soreness, calories, weight }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('Success', 'Lifestyle data added successfully');
        fetchLifestyleData();
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit lifestyle data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lifestyle Check-in</Text>
      <TextInput style={styles.input} placeholder='Stress Level' value={stress} onChangeText={setStress} keyboardType='numeric' />
      <TextInput style={styles.input} placeholder='Sleep Hours' value={sleep} onChangeText={setSleep} keyboardType='numeric' />
      <TextInput style={styles.input} placeholder='Soreness Level' value={soreness} onChangeText={setSoreness} keyboardType='numeric' />
      <TextInput style={styles.input} placeholder='Calories Consumed' value={calories} onChangeText={setCalories} keyboardType='numeric' />
      <TextInput style={styles.input} placeholder='Weight' value={weight} onChangeText={setWeight} keyboardType='numeric' />
      <Button title='Submit' onPress={submitLifestyleData} />
      
      <Text style={styles.subtitle}>Previous Entries:</Text>
      <FlatList
        data={lifestyleData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>Date: {new Date(item.date).toLocaleDateString()}</Text>
            <Text>Stress: {item.stress}</Text>
            <Text>Sleep: {item.sleep} hrs</Text>
            <Text>Soreness: {item.soreness}</Text>
            <Text>Calories: {item.calories}</Text>
            <Text>Weight: {item.weight} kg</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  listItem: { padding: 10, borderBottomWidth: 1, marginVertical: 5 },
});

export default LifestyleScreen;