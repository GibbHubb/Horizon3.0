import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TrainerHome({ navigation }) {
  return (
<View style={styles.container}>
      <Text style={styles.header}>Trainer Dashboard</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('WorkoutsMenu')}
      >
        <Text style={styles.buttonText}>Workout Overview</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ClientOverview')}
      >
        <Text style={styles.buttonText}>Client Overview</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0056A6',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#0056A6',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
