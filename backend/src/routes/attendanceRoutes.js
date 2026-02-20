const express = require('express');
const { markAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Only Students can mark their own presence
router.post('/mark', protect, authorizeRole('Student'), markAttendance);

module.exports = router;
