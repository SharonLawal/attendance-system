/**
 * @fileoverview Contextual execution boundary for backend/src/routes/studentRoutes.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const express = require('express');
const {
    getDashboard,
    getDashboardStats,
    getHistory,
    getCourses,
    getSchedule,
    getActiveSession,
    linkGoogleCallback,
    getGoogleAuthUrl
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/link-google/callback', linkGoogleCallback);

router.use(protect, authorizeRole('Student'));

router.get('/link-google', getGoogleAuthUrl);

router.get('/dashboard', getDashboard);
router.get('/stats', getDashboardStats);
router.get('/history', getHistory);
router.get('/courses', getCourses);
router.get('/schedule', getSchedule);
router.get('/active-session', getActiveSession);

module.exports = router;
