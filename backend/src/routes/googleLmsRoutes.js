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

// multer — store CSV in memory (no disk writes), 5 MB limit
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

// Public — Google redirects here after OAuth approval
router.get('/callback', handleCallback);

// All routes below are Lecturer-only
router.use(protect, authorizeRole('Lecturer'));

router.get('/auth', getAuthUrl);
router.get('/status', getConnectionStatus);
router.delete('/disconnect', disconnectGoogle);
router.get('/courses', getGoogleCourses);
router.get('/assignments', getGoogleAssignments);
router.post('/sync-roster', syncRoster);
router.post('/sync-attendance', syncLatestAttendance);  // Sync specific assignment
router.post('/import-meet-csv', upload.single('file'), importMeetCsv);  // CSV from meetlist.io extension

module.exports = router;