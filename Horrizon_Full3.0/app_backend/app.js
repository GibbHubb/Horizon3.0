const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const db = require('./models/db'); // Database initialization
const config = require('./config/config');

// Import routes
const usersRoutes = require('./routes/usersRoutes');
const exercisesRoutes = require('./routes/exercisesRoutes');
const workoutsRoutes = require('./routes/workoutsRoutes');
const groupWorkoutsRoutes = require('./routes/groupWorkoutsRoutes');
const lifestyleDataRoutes = require('./routes/lifestyleDataRoutes');

const app = express();
const PORT = config.port;

console.log('Loaded Configuration:');
console.log(`PORT: ${config.port}`);
console.log(`DATABASE_URL: ${config.databaseUrl}`);
console.log(`JWT_SECRET: ${config.jwtSecret}`);
console.log(`JWT_EXPIRES_IN: ${config.jwtExpiresIn}`);
console.log(`NODE_ENV: ${config.nodeEnv}`);

// Check critical environment variables
if (!config.databaseUrl) {
    console.error('ERROR: DATABASE_URL is not defined!');
    process.exit(1); // Exit if critical variables are missing
}

if (!config.jwtSecret) {
    console.error('ERROR: JWT_SECRET is not defined!');
    process.exit(1);
}

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cors()); // Enable CORS for all routes

// Debugging: Log incoming requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health Check Route
app.get('/api/health', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT NOW()');
        res.status(200).json({ status: 'OK', timestamp: rows[0].now });
    } catch (err) {
        console.error('Health check failed:', err.message);
        res.status(500).json({ status: 'ERROR', details: err.message });
    }
});

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/workouts', workoutsRoutes);
app.use('/api/group-workouts', groupWorkoutsRoutes);
app.use('/api/lifestyle-data', lifestyleDataRoutes);

// Catch-all for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Server Error:`, err.message);
    res.status(500).json({
        error: 'Server Error',
        details: config.nodeEnv === 'development' ? err.message : 'An unexpected error occurred.',
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Connected to database: ${config.databaseUrl}`);
});
