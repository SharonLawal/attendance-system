const express = require('express');
const {
    getSystemStats,
    getUsers,
    getAuditLogs
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, authorizeRole('Admin'));

router.get('/stats', getSystemStats);
router.get('/users', getUsers);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
