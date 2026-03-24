/**
 * @fileoverview Contextual execution boundary for backend/src/routes/lmsRoutes.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const express = require('express');
const { syncAttendance } = require('../controllers/lmsController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/sync', protect, authorizeRole('Lecturer'), syncAttendance);

module.exports = router;
