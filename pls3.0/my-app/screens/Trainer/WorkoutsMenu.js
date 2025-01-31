import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  fetchWorkoutsByLevel,
  fetchYourWorkouts,
  fetchLast10Workouts,
  fetchMostUsedWorkouts,
  searchWorkouts,
  fetchGroupWorkoutDetails,
} from '../../utils/api'; // API calls

export default function WorkoutsMenu({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Navigate to CreateWorkoutScreen
  const handleNavigateToCreateWorkout = () => {
    console.log('Navigating to CreateWorkoutScreen');
    navigation.navigate('CreateWorkout');
  };

  // Navigate to EditWorkoutScreen
  const handleNavigateToEditWorkout = async (workoutId) => {
    setLoading(true);
    try {
      const workoutDetails = await fetchGroupWorkoutDetails(workoutId);
      navigation.navigate('EditWorkout', { workoutId, workoutDetails });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch workout details.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch workouts dynamically
  const handleFetchWorkouts = async (fetchFunction, label) => {
    setLoading(true);
    try {
      const data = await fetchFunction();
      if (!data || data.length === 0) {
        Alert.alert('No Workouts', `No ${label} workouts found.`);
      } else {
        setWorkouts(data);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to fetch ${label} workouts.`);
    } finally {
      setLoading(false);
    }
  };

  // Search workouts
  const handleSearchWorkouts = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setWorkouts([]);
      return;
    }
    setLoading(true);
    try {
      const results = await searchWorkouts(query);
      setWorkouts(results.slice(0, 10));
    } catch (error) {
      Alert.alert('Error', 'Failed to search workouts.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Workout Menu</Text>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search workouts"
          value={searchQuery}
          onChangeText={handleSearchWorkouts}
        />
      </View>

      {/* Loader */}
      {loading && <ActivityIndicator size="large" color="#0056A6" />}

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Workouts List */}
        <FlatList
          data={workouts}
          keyExtractor={(item, index) => item?.group_workout_id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.workoutItem}
              onPress={() => handleNavigateToEditWorkout(item.group_workout_id)}
            >
              <Text style={styles.workoutName}>{item.name}</Text>
              <Text style={styles.workoutDate}>{new Date(item.date).toLocaleDateString()}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            !loading && <Text style={styles.emptyText}>No workouts found.</Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }} // Prevents content from getting cut off
          nestedScrollEnabled={true} // Enables scrolling inside ScrollView
        />

         {/* Workout Category Buttons */}
         <View style={styles.topButtonContainer}>
          <TouchableOpacity style={styles.mainButton} onPress={() => handleFetchWorkouts(fetchYourWorkouts, 'your')}>
            <Text style={styles.mainButtonText}>Your Workouts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mainButton} onPress={() => handleFetchWorkouts(fetchLast10Workouts, 'last 10')}>
            <Text style={styles.mainButtonText}>Last 10</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mainButton} onPress={() => handleFetchWorkouts(fetchMostUsedWorkouts, 'most used')}>
            <Text style={styles.mainButtonText}>Most Used</Text>
          </TouchableOpacity>
        </View>

        {/* Level Buttons */}
        <View style={styles.levelContainer}>
          <TouchableOpacity style={styles.subButton} onPress={() => handleFetchWorkouts(() => fetchWorkoutsByLevel('Novice'), 'Novice')}>
            <Text style={styles.subButtonText}>Novice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subButton} onPress={() => handleFetchWorkouts(() => fetchWorkoutsByLevel('Beginner'), 'Beginner')}>
            <Text style={styles.subButtonText}>Beginner</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subButton} onPress={() => handleFetchWorkouts(() => fetchWorkoutsByLevel('Intermediate'), 'Intermediate')}>
            <Text style={styles.subButtonText}>Intermediate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subButton} onPress={() => handleFetchWorkouts(() => fetchWorkoutsByLevel('Advanced'), 'Advanced')}>
            <Text style={styles.subButtonText}>Advanced</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fixed Create Workout Button */}
      <TouchableOpacity style={styles.createWorkoutButton} onPress={handleNavigateToCreateWorkout}>
        <Text style={styles.createWorkoutButtonText}>Create a Workout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16, 
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchBarContainer: {
    backgroundColor: '#eaeaea',
    borderRadius: 8,
    marginBottom: 16,
  },
  searchInput: {
    padding: 8,
    fontSize: 16,
    color: '#333',
  },
  workoutItem: {
    backgroundColor: '#eee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutDate: {
    fontSize: 14,
    color: '#555',
  },
  createWorkoutButton: {
    backgroundColor: '#28A745',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10, // Ensure spacing at bottom
  },
  createWorkoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 16,
    color: '#777',
  },
  levelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  subButton: {
    backgroundColor: '#82CFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    width: '23%', // Ensures proper alignment
  },
  subButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  topButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  mainButton: {
    backgroundColor: '#0056A6',
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  }, 
   mainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  

});

