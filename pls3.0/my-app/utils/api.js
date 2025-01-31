import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL
const API_URL = 'http://localhost:5000/api'; // Replace with your live API URL if applicable

// Create an Axios instance with dynamic token
const createApiInstance = async () => {
  const authToken = await AsyncStorage.getItem('authToken');
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken || ''}`, // Add token if available
    },
  });
};

/**
 * Fetch the details of a single group workout
 * @param {number} workoutId - ID of the group workout
 * @returns {Promise<object>} - Group workout details
 */
export const fetchGroupWorkoutDetails = async (workoutId) => {
    const api = await createApiInstance(); // Ensure your Axios instance is properly created
    try {
      const response = await api.get(`/group-workouts/${workoutId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching group workout details:', error.message);
      throw error;
    }
  };
  

/**
 * Fetch all workouts by level
 */
export const fetchWorkoutsByLevel = async (level) => {
  const api = await createApiInstance();
  try {
    const response = await api.get('/group-workouts', {
      params: { level },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching workouts for level "${level}":`, error.message);
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
    console.error('Error fetching your workouts:', error.message);
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
    console.error('Error fetching last 10 workouts:', error.message);
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
    console.error('Error fetching most used workouts:', error.message);
    throw error;
  }
};

/**
 * Search for workouts by a query string
 */
export const searchWorkouts = async (query) => {
  const api = await createApiInstance();
  try {
    const response = await api.get('/group-workouts/search', {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching workouts:', error.message);
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
    console.error('Error creating group workout:', error.message);
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
    console.error('Error updating group workout:', error.message);
    throw error;
  }
};

/**
 * Add participants to a group workout
 */
export const addParticipantsToWorkout = async (workoutId, participants) => {
  const api = await createApiInstance();
  try {
    const response = await api.post(`/group-workouts/${workoutId}/participants`, {
      participants,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding participants to workout:', error.message);
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
    console.error('Error removing participant from workout:', error.message);
    throw error;
  }
};

/**
 * Fetch exercises for a workout
 */
export const fetchExercises = async () => {
  const api = await createApiInstance();
  try {
    const response = await api.get('/exercises');
    return response.data;
  } catch (error) {
    console.error('Error fetching exercises:', error.message);
    throw error;
  }
};

/**
 * Login User
 */
export const loginUser = async (username, password) => {
  const api = await createApiInstance();
  try {
    const response = await api.post('/users/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error;
  }
};
