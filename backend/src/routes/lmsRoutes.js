const express = require('express');
const { syncAttendance } = require('../controllers/lmsController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Only Lecturers can initiate LMS sync
router.post('/sync', protect, authorizeRole('Lecturer'), syncAttendance);

module.exports = router;
