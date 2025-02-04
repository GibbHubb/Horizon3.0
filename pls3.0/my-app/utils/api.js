import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL
const API_URL = 'http://localhost:5000/api'; // Replace with your live API URL if applicable

// Helper function to create an Axios instance with authentication
const createApiInstance = async () => {
  const authToken = await AsyncStorage.getItem('authToken');
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken || ''}`, // Include token if available
    },
  });
};

/**
 * Fetch a single group workout
 */
export const fetchGroupWorkoutDetails = async (workoutId) => {
  const api = await createApiInstance();
  try {
    const response = await api.get(`/group-workouts/${workoutId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching group workout details:', error);
    throw error;
  }
};

/**
 * Fetch all workouts by level
 */
export const fetchWorkoutsByLevel = async (level) => {
  const api = await createApiInstance();
  try {
    const response = await api.get('/group-workouts', { params: { level } });
    return response.data;
  } catch (error) {
    console.error(`Error fetching workouts for level "${level}":`, error);
    throw error;
  }
};

/**
 * Fetch workouts created by the current trainer
 */
export const fetchYourWorkouts = async () => {
  const api = await createApiInstance();
  try {
    const response = await api.get('/group-workouts/your-workouts');
    return response.data;
  } catch (error) {
    console.error('Error fetching your workouts:', error);
    throw error;
  }
};

/**
 * Fetch the last 10 group workouts
 */
export const fetchLast10Workouts = async () => {
  const api = await createApiInstance();
  try {
    const response = await api.get('/group-workouts/last-10');
    return response.data;
  } catch (error) {
    console.error('Error fetching last 10 workouts:', error);
    throw error;
  }
};

/**
 * Fetch the most used workouts
 */
export const fetchMostUsedWorkouts = async () => {
  const api = await createApiInstance();
  try {
    const response = await api.get('/group-workouts/most-used');
    return response.data;
  } catch (error) {
    console.error('Error fetching most used workouts:', error);
    throw error;
  }
};

/**
 * Search for workouts
 */
export const searchWorkouts = async (query) => {
  const api = await createApiInstance();
  try {
    const response = await api.get('/group-workouts/search', { params: { query } });
    return response.data;
  } catch (error) {
    console.error('Error searching workouts:', error);
    throw error;
  }
};

/**
 * Create a new group workout
 */
export const createGroupWorkout = async (workoutData) => {
  const api = await createApiInstance();
  try {
    const response = await api.post('/group-workouts', workoutData);
    return response.data;
  } catch (error) {
    console.error('Error creating group workout:', error);
    throw error;
  }
};

/**
 * Update an existing group workout
 */
export const updateGroupWorkout = async (workoutId, updatedData) => {
  const api = await createApiInstance();
  try {
    const response = await api.put(`/group-workouts/${workoutId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating group workout:', error);
    throw error;
  }
};

/**
 * Add participants to a group workout
 */
export const addParticipantsToWorkout = async (workoutId, participants) => {
  const api = await createApiInstance();
  try {
    const response = await api.post(`/group-workouts/${workoutId}/participants`, { participants });
    return response.data;
  } catch (error) {
    console.error('Error adding participants to workout:', error);
    throw error;
  }
};

/**
 * Remove a participant from a group workout
 */
export const removeParticipantFromWorkout = async (workoutId, participantId) => {
  const api = await createApiInstance();
  try {
    const response = await api.delete(`/group-workouts/${workoutId}/participants/${participantId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing participant from workout:', error);
    throw error;
  }
};

/**
 * Fetch all exercises
 */
export const fetchExercises = async () => {
  const api = await createApiInstance();
  try {
    const response = await api.get('/exercises');
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

/**
 * Login User
 */
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, { username, password });
    if (response.data.token) {
      await AsyncStorage.setItem('authToken', response.data.token); // Store token after login
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Fetch Intake Data (Updated to use Axios)
 */
export const fetchIntakeData = async (userId) => {
  const api = await createApiInstance();
  try {
    const response = await api.get(`/intake/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching intake data:', error);
    throw error;
  }
};

/**
 * Submit Intake Data (Updated to use Axios)
 */
export const submitIntakeData = async (intakeData) => {
  const api = await createApiInstance();
  try {
    const response = await api.post('/intake', intakeData);
    return response.data;
  } catch (error) {
    console.error('Error submitting intake data:', error);
    throw error;
  }
};

/**
 * Fetch paginated users sorted by last check-in
 */
export const fetchUsers = async (page = 1, searchQuery = '') => {
  const api = await createApiInstance();
  try {
    const response = await api.get('/users', { params: { page, search: searchQuery } });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Fetch a single user profile
 */
export const fetchUserProfile = async (userId) => {
  try {
    const api = await createApiInstance(); // Ensure token is included
    console.log(`Fetching user profile for ID: ${userId}`); // Debugging
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user profile for ID ${userId}:`, error.response?.data || error);
    return null;
  }
};


export async function fetchSuggestedWeights(workoutId) {
  try {
      const token = await AsyncStorage.getItem('authToken');

      console.log(`📡 Fetching suggested weights for group workout ${workoutId}`);

      const response = await fetch(`${API_URL}/workouts/suggested-weights/${workoutId}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      });

      console.log("🛜 API Response Status:", response.status);

      if (!response.ok) {
          throw new Error(`❌ API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("💪 Suggested Weights Data:", data);

      return data;

  } catch (error) {
      console.error('❌ Error fetching suggested weights:', error.message);
      return [];
  }
}
