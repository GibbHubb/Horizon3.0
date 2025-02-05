import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { fetchProgressData } from '../../utils/api';

const logo = require('../../imgs/Horizon.png'); // Ensure correct path

const ProgressScreen = () => {
  const navigation = useNavigation(); // Fix navigation issue
  const [selectedCategory, setSelectedCategory] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  const exerciseCategories = [
    { label: 'Weight', value: 'weight' },
    { label: 'Vertical Press', value: 'vertical_press' },
    { label: 'Horizontal Press', value: 'horizontal_press' },
    { label: 'Squat', value: 'squat' },
    { label: 'Deadlift', value: 'deadlift' },
    { label: 'Vertical Pull', value: 'vertical_pull' }, // Added
    { label: 'Horizontal Pull', value: 'horizontal_pull' }, // Added
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
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Horizon Logo */}
      <Image source={logo} style={styles.logo} />

      <Text style={styles.title}>Progress Tracker</Text>

      <View style={styles.pickerContainer}>
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
      </View>

      {chartData.labels.length > 0 ? (
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={350}
            height={220}
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(247, 191, 11, ${opacity})`, // Horizon Gold
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 10 },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#3274ba', // Horizon Blue
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      ) : (
        <Text style={styles.noDataText}>Select an exercise to view progress.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3274ba',
    marginBottom: 20,
  },
  pickerContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8ebce6',
    overflow: 'hidden',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#000',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
  },
  noDataText: {
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
});

export default ProgressScreen;
