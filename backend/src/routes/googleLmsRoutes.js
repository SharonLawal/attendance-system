/**
 * @fileoverview Contextual execution boundary for backend/src/routes/googleLmsRoutes.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const express = require('express');
const multer = require('multer');
const {
    getAuthUrl,
    handleCallback,
    getConnectionStatus,
    disconnectGoogle,
    getGoogleCourses,
    getGoogleAssignments,
    syncRoster,
    syncLatestAttendance,
    importMeetCsv,
} = require('../controllers/googleLmsController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are accepted'));
        }
    },
});

router.get('/callback', handleCallback);

router.use(protect, authorizeRole('Lecturer'));

router.get('/auth', getAuthUrl);
router.get('/status', getConnectionStatus);
router.delete('/disconnect', disconnectGoogle);
router.get('/courses', getGoogleCourses);
router.get('/assignments', getGoogleAssignments);
router.post('/sync-roster', syncRoster);
router.post('/sync-attendance', syncLatestAttendance);
router.post('/import-meet-csv', upload.single('file'), importMeetCsv);

module.exports = router;