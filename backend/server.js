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
const googleLmsRoutes = require('./src/routes/googleLmsRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const lecturerRoutes = require('./src/routes/lecturerRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const classroomRoutes = require('./src/routes/classroomRoutes');

connectDB();

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        // Dynamically allow any origin (perfect for avoiding Vercel/Netlify env matching issues)
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiLimiter);

// Static Files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/lms/google', googleLmsRoutes);  // Google Classroom OAuth + sync
app.use('/api/lms', lmsRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
    res.send('VeriPoint API is running...');
});

app.use(errorHandler);

const keepAlive = require('./src/utils/keepAlive');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    keepAlive();
});
