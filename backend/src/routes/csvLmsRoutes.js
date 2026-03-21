const express = require('express');
const multer = require('multer');
const { syncFromCSV } = require('../controllers/csvLmsController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Store file in memory — we only need the buffer to parse it, no disk writes
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        // Accept CSV and TSV only
        if (
            file.mimetype === 'text/csv' ||
            file.mimetype === 'text/tab-separated-values' ||
            file.mimetype === 'application/vnd.ms-excel' ||
            file.originalname.endsWith('.csv') ||
            file.originalname.endsWith('.tsv')
        ) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are accepted'), false);
        }
    },
});

router.use(protect, authorizeRole('Lecturer'));

router.post('/sync-attendance', upload.single('file'), syncFromCSV);

module.exports = router;
