const express = require('express');
const {
    getGroupWorkouts,
    getGroupWorkoutDetails,
    getWorkoutsByLevel,
    createGroupWorkout,
    getLast10Workouts,
    getYourWorkouts,
    getMostUsedWorkouts,
    searchWorkouts, // Added this for completeness
} = require('../controllers/groupWorkoutsController');
const { authenticateToken } = require('../controllers/usersController');

const router = express.Router();

// Group Workout Routes
router.get('/level', authenticateToken, getWorkoutsByLevel); // Fetch workouts by level
router.get('/your', authenticateToken, getYourWorkouts); // Fetch workouts for the current user
router.get('/last10', getLast10Workouts); // Fetch last 10 public workouts
router.get('/most-used', getMostUsedWorkouts); // Fetch most used workouts
router.get('/search', authenticateToken, searchWorkouts); // Search workouts by name

router.get('/:id', authenticateToken, getGroupWorkoutDetails); // Fetch details of a specific group workout
router.post('/', authenticateToken, createGroupWorkout); // Create a new group workout
router.get('/', authenticateToken, getGroupWorkouts); // Fetch all group workouts (default route)

module.exports = router;
