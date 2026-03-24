/**
 * @fileoverview Contextual execution boundary for backend/src/routes/analyticsRoutes.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const express = require('express');
const {
    getWeeklyAttendance,
    getDepartmentRates,
    getCriticalStudents,
    getDetailedReports
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, authorizeRole('Admin', 'Lecturer'));

router.get('/weekly', getWeeklyAttendance);
router.get('/departments', getDepartmentRates);
router.get('/critical-students', getCriticalStudents);
router.get('/detailed-reports', getDetailedReports);

module.exports = router;
