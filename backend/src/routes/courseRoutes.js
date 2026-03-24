/**
 * @fileoverview Contextual execution boundary for backend/src/routes/courseRoutes.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const express = require('express');
const { createCourse, getMyCourses, updateCourse, importStudents, getCourseRoster, getPendingCheckIns, resolvePendingCheckIn } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createCourse);
router.get('/my-courses', getMyCourses);
router.put('/:id', updateCourse);

router.post('/:id/roster', importStudents);
router.get('/:id/roster', getCourseRoster);
router.get('/:id/pending', getPendingCheckIns);
router.post('/:id/resolve-pending', resolvePendingCheckIn);

module.exports = router;
