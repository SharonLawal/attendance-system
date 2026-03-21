const express = require('express');
const {
    getAuthUrl,
    handleCallback,
    getConnectionStatus,
    disconnectGoogle,
    getGoogleCourses,
    getCourseWork,
    syncRoster,
    syncAttendance,
} = require('../controllers/googleLmsController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public — Google redirects here after OAuth approval
router.get('/callback', handleCallback);

// All routes below are Lecturer-only
router.use(protect, authorizeRole('Lecturer'));

router.get('/auth', getAuthUrl);
router.get('/status', getConnectionStatus);
router.delete('/disconnect', disconnectGoogle);
router.get('/courses', getGoogleCourses);
router.get('/courses/:courseId/coursework', getCourseWork);
router.post('/sync-roster', syncRoster);
router.post('/sync-attendance', syncAttendance);

module.exports = router;