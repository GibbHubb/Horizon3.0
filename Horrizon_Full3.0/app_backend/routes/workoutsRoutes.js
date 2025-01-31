const express = require('express');
const {
    getWorkouts,
    createWorkout,
    getWorkoutHistory,
    getWorkoutDetails,
    getAssignedWorkouts,
    getExerciseProgress,
} = require('../controllers/workoutsController');
const { authenticateToken } = require('../controllers/usersController');

const router = express.Router();

// Define routes
router.get('/', authenticateToken, getWorkouts);
router.post('/', authenticateToken, createWorkout);
router.get('/history', authenticateToken, getWorkoutHistory);
router.get('/:id', authenticateToken, getWorkoutDetails);
router.get('/assigned', authenticateToken, getAssignedWorkouts); // Assigned workouts route
router.get('/progress/:exerciseId', authenticateToken, getExerciseProgress)

module.exports = router;
