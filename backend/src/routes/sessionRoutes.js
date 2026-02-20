const express = require('express');
const { createSession } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Only Lecturers can create attendance sessions
router.post('/create', protect, authorizeRole('Lecturer'), createSession);

module.exports = router;
