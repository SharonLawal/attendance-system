/**
 * @fileoverview Contextual execution boundary for backend/src/routes/lecturerRoutes.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const express = require('express');
const {
    getDashboard,
    getCoursesSummary,
    getClassrooms,
    getSyncHistory,
    getLiveSessionAttendees,
    approvePendingAttendance,
    rejectPendingAttendance,
    endSession,
    extendSession
} = require('../controllers/lecturerController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, authorizeRole('Lecturer'));

router.get('/dashboard', getDashboard);
router.get('/courses-summary', getCoursesSummary);
router.get('/classrooms', getClassrooms);
router.get('/sync-history', getSyncHistory);
router.get('/live-session/:id/attendees', getLiveSessionAttendees);
router.post('/attendance/:recordId/approve', approvePendingAttendance);
router.post('/attendance/:recordId/reject', rejectPendingAttendance);
router.post('/end-session/:id', endSession);
router.post('/extend-session/:id', extendSession);

module.exports = router;
