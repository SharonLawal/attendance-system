/**
 * @fileoverview Contextual execution boundary for backend/src/routes/attendanceRoutes.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const express = require('express');
const { markAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');
const { attendanceLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/mark', protect, authorizeRole('Student'), attendanceLimiter, markAttendance);

module.exports = router;
