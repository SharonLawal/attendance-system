const express = require('express');
const {
    getDashboardStats,
    getHistory,
    getCourses,
    getSchedule,
    getActiveSession,
    getNotifications
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, authorizeRole('Student'));

router.get('/stats', getDashboardStats);
router.get('/history', getHistory);
router.get('/courses', getCourses);
router.get('/schedule', getSchedule);
router.get('/active-session', getActiveSession);
router.get('/notifications', getNotifications);

module.exports = router;
