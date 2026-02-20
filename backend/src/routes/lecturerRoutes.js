const express = require('express');
const {
    getCoursesSummary,
    getClassrooms,
    getSyncHistory,
    getLiveSessionStats,
    endSession,
    extendSession
} = require('../controllers/lecturerController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, authorizeRole('Lecturer'));

router.get('/courses-summary', getCoursesSummary);
router.get('/classrooms', getClassrooms);
router.get('/sync-history', getSyncHistory);
router.get('/live-session', getLiveSessionStats);
router.post('/end-session/:id', endSession);
router.post('/extend-session/:id', extendSession);

module.exports = router;
