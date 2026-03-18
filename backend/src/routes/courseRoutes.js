const express = require('express');
const { createCourse, getMyCourses, updateCourse, importStudents, getPendingCheckIns, resolvePendingCheckIn } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth protection to all course routes
router.use(protect);

router.post('/', createCourse);
router.get('/my-courses', getMyCourses);
router.put('/:id', updateCourse);

router.post('/:id/roster', importStudents);
router.get('/:id/pending', getPendingCheckIns);
router.post('/:id/resolve-pending', resolvePendingCheckIn);

module.exports = router;
