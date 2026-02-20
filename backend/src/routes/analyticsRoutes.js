const express = require('express');
const {
    getWeeklyAttendance,
    getDepartmentRates,
    getCriticalStudents,
    getDetailedReports
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
// Admin and potentially Lecturer might access analytics
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, authorizeRole('Admin', 'Lecturer'));

router.get('/weekly', getWeeklyAttendance);
router.get('/departments', getDepartmentRates);
router.get('/critical-students', getCriticalStudents);
router.get('/detailed-reports', getDetailedReports);

module.exports = router;
