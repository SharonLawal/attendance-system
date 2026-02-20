const AttendanceSession = require('../models/AttendanceSession');
const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');
const { z } = require('zod');

// Validate coordinate arrays `[lng, lat]`
const sessionSchema = z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Course ID'),
    coordinates: z.array(z.tuple([z.number(), z.number()])).min(4, 'Polygon must have at least 4 coordinates (first and last must be same)'),
});

// @desc    Create an attendance session for a class
// @route   POST /api/sessions/create
// @access  Private/Lecturer
const createSession = asyncHandler(async (req, res) => {
    const validatedData = sessionSchema.parse(req.body);
    const { courseId, coordinates } = validatedData;
    const lecturerId = req.user._id;

    // Validate that the course exists and belongs to this lecturer
    const course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }
    if (course.lecturerId.toString() !== lecturerId.toString()) {
        res.status(403);
        throw new Error('You are not authorized to create a session for this course');
    }

    // Ensure Polygon coordinates form a closed ring
    const firstPoint = coordinates[0];
    const lastPoint = coordinates[coordinates.length - 1];
    if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
        res.status(400);
        throw new Error('Polygon coordinates must be closed (first and last coordinate must be identical)');
    }

    // Generate a random 4 digit OTC code
    const otcCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Set end time to 5 minutes from now
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 5 * 60000);

    const session = await AttendanceSession.create({
        courseId,
        lecturerId,
        otcCode,
        startTime,
        endTime,
        locationPolygon: {
            type: 'Polygon',
            coordinates: [coordinates] // GeoJSON expects an array of rings
        },
    });

    res.status(201).json({
        message: 'Session created successfully',
        session: {
            id: session._id,
            otcCode: session.otcCode,
            courseId: session.courseId,
            expiresAt: session.endTime,
        }
    });
});

module.exports = {
    createSession,
};
