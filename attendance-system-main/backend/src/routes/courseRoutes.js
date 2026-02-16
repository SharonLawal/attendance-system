import express from 'express';
import {
  getCourses,
  getCourseById,
  createCourse,
  getAttendance,
  markAttendance,
  getAttendanceStats,
} from '../controllers/courseController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Course routes
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', authorize(['Lecturer', 'Admin']), createCourse);

// Attendance routes
router.get('/:courseId/attendance', getAttendance);
// Allow students to mark their own attendance; controller enforces roles
router.post('/:courseId/attendance', markAttendance);
router.get('/:courseId/attendance/stats', getAttendanceStats);

export default router;
