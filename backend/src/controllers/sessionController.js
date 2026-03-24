/**
 * @fileoverview Contextual execution boundary for backend/src/controllers/sessionController.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const AttendanceSession = require('../models/AttendanceSession');
const Course = require('../models/Course');
const Classroom = require('../models/Classroom');
/**
 * @module controllers/sessionController
 * @description Manages the lifecycle of live lecture sessions. Dynamically queries and inherits absolute MongoDB 2dsphere geometry from assigned campus venues to strictly bound student check-ins.
 */
const asyncHandler = require('express-async-handler');
const { z } = require('zod');

const createSessionSchema = z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Course ID'),
    classroomId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Classroom ID'),
    durationInMinutes: z.number().min(1).max(300).default(60)
});

const generateOTC = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Create a new attendance session
// @route   POST /api/sessions/create
// @access  Private (Lecturer only)
const createSession = asyncHandler(async (req, res) => {
    const validatedData = createSessionSchema.parse(req.body);
    const { courseId, classroomId, durationInMinutes } = validatedData;
    const lecturerId = req.user._id;

    const course = await Course.findOne({ _id: courseId, lecturerId });
    if (!course) {
        res.status(404);
        throw new Error('Course not found or you are not authorized to start a session for it');
    }

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
        res.status(404);
        throw new Error('Classroom not found');
    }

    const now = new Date();
    const existingActiveSession = await AttendanceSession.findOne({
        courseId,
        lecturerId,
        endTime: { $gt: now }
    });

    if (existingActiveSession) {
        res.status(400);
        throw new Error('An active session already exists for this course. Please end it before starting a new one.');
    }

    const otcCode = generateOTC();
    const startTime = now;
    const endTime = new Date(now.getTime() + durationInMinutes * 60000);
    const locationPolygon = classroom.locationPolygon;

    const session = await AttendanceSession.create({
        courseId,
        lecturerId,
        otcCode,
        startTime,
        endTime,
        locationPolygon
    });

    res.status(201).json({
        success: true,
        message: 'Attendance session started',
        data: {
            sessionId: session._id,
            otcCode: session.otcCode,
            courseCode: course.courseCode,
            endTime: session.endTime
        }
    });
});

module.exports = {
    createSession
};
