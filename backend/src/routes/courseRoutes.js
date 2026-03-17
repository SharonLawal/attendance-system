const express = require('express');
const { createCourse, getMyCourses, updateCourse, importStudents, getPendingStudents, resolvePending } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth protection to all course routes
router.use(protect);

router.post('/', createCourse);
router.get('/my-courses', getMyCourses);
router.put('/:id', updateCourse);

router.post('/:id/roster', importStudents);
router.get('/:id/pending', getPendingStudents);
router.post('/:id/resolve-pending', resolvePending);

module.exports = router;
