const AttendanceSession = require('../models/AttendanceSession');
const Course = require('../models/Course');
const Classroom = require('../models/Classroom');
const asyncHandler = require('express-async-handler');
const { z } = require('zod');

// Validation Schema for creating a session
const createSessionSchema = z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Course ID'),
    classroomId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Classroom ID'),
    durationInMinutes: z.number().min(1).max(300).default(60)
});

// Helper function to generate a 6-digit OTC code
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

    // 1. Verify Course Ownership
    const course = await Course.findOne({ _id: courseId, lecturerId });
    if (!course) {
        res.status(404);
        throw new Error('Course not found or you are not authorized to start a session for it');
    }

    // 2. Verify Classroom Exists
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
        res.status(404);
        throw new Error('Classroom not found');
    }

    // 3. Prevent Overlapping Active Sessions for this course by this lecturer
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

    // 4. Generate Session Data
    const otcCode = generateOTC();
    const startTime = now;
    const endTime = new Date(now.getTime() + durationInMinutes * 60000);
    const locationPolygon = classroom.locationPolygon;

    // 4. Create Session
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
