require('dotenv').config({ path: ['.env.local', '.env'] });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const { errorHandler } = require('./src/middleware/errorHandler');
const { apiLimiter } = require('./src/middleware/rateLimiter');

// Route Imports
const authRoutes = require('./src/routes/authRoutes');
const sessionRoutes = require('./src/routes/sessionRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const lmsRoutes = require('./src/routes/lmsRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const lecturerRoutes = require('./src/routes/lecturerRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true, // CRITICAL: Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Apply a generic API rate limiter to all /api routes to protect against abuse
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/lms', lmsRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('VeriPoint API is running...');
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
