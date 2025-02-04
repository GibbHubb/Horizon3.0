const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const db = require('./models/db'); 
const config = require('./config/config');

const app = express();
const PORT = config.port || 5000;

// ✅ CORS Configuration (Ensure this is before your routes)
app.use(cors({
    origin: '*', // Allow ALL origins for now (change this later)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// ✅ Ensure preflight requests (OPTIONS) are handled properly
app.options('*', cors());

console.log('Loaded Configuration:');
console.log(`PORT: ${PORT}`);
console.log(`DATABASE_URL: ${config.databaseUrl}`);
console.log(`JWT_SECRET: ${config.jwtSecret}`);
console.log(`JWT_EXPIRES_IN: ${config.jwtExpiresIn}`);
console.log(`NODE_ENV: ${config.nodeEnv}`);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Debugging: Log all incoming requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ✅ Health Check Route
app.get('/api/health', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT NOW()');
        res.status(200).json({ status: 'OK', timestamp: rows[0].now });
    } catch (err) {
        console.error('❌ Health check failed:', err.message);
        res.status(500).json({ status: 'ERROR', details: err.message });
    }
});

// ✅ Routes (Make sure they come AFTER CORS setup)
app.use('/api/users', require('./routes/usersRoutes'));
app.use('/api/exercises', require('./routes/exercisesRoutes'));
app.use('/api/workouts', require('./routes/workoutsRoutes'));
app.use('/api/group-workouts', require('./routes/groupWorkoutsRoutes'));
app.use('/api/lifestyle-data', require('./routes/lifestyleDataRoutes'));

// ✅ Catch-all for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: '❌ Route not found' });
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] ❌ Server Error:`, err.message);
    res.status(500).json({
        error: 'Server Error',
        details: config.nodeEnv === 'development' ? err.message : 'An unexpected error occurred.',
    });
});

// ✅ Start Server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`✅ Connected to database: ${config.databaseUrl}`);
});

module.exports = { app, server };
