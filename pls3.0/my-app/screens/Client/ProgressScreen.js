import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import correct Picker
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProgressData } from '../../utils/api';

const ProgressScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  // Predefined Exercise Categories
  const exerciseCategories = [
    { label: 'Weight', value: 'weight' },
    { label: 'Vertical Press', value: 'vertical_press' },
    { label: 'Horizontal Press', value: 'horizontal_press' },
    { label: 'Squat', value: 'squat' },
    { label: 'Deadlift', value: 'deadlift' },
  ];

  useEffect(() => {
    if (selectedCategory) {
      loadProgressData(selectedCategory);
    }
  }, [selectedCategory]);

  const loadProgressData = async (category) => {
    if (!category) return;

    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      const data = await fetchProgressData(user_id, category);
      if (!data || data.length === 0) {
        Alert.alert('No Data', `No progress data found for ${category}.`);
        return;
      }

      setChartData({
        labels: data.map((entry) => new Date(entry.date).toLocaleDateString()),
        datasets: [{ data: data.map((entry) => entry.weight) }],
      });
    } catch (error) {
      console.error('Error fetching progress data:', error);
      Alert.alert('Error', `Failed to fetch progress data for ${category}.`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress Tracker</Text>
      
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select an Exercise" value="" enabled={false} />
        {exerciseCategories.map((exercise, index) => (
          <Picker.Item key={index} label={exercise.label} value={exercise.value} />
        ))}
      </Picker>

      {chartData.labels.length > 0 ? (
        <LineChart
          data={chartData}
          width={350}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noDataText}>Select an exercise to view progress.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  picker: { height: 50, width: 300 },
  chart: { marginVertical: 10, borderRadius: 5 },
  noDataText: { fontSize: 16, color: 'gray', marginTop: 20 },
});

export default ProgressScreen;
