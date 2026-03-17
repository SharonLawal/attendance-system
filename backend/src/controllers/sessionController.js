const AttendanceSession = require('../models/AttendanceSession');
const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');
const { z } = require('zod');

// Validation Schema for creating a session
const createSessionSchema = z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Course ID'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    radiusInMeters: z.number().min(10).max(1000).default(50),
    durationInMinutes: z.number().min(1).max(300).default(60)
});

// Helper function to generate a 6-digit OTC code
const generateOTC = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to generate a strict geographic polygon approximation (circle)
const generateGeoJSONCircle = (center, radiusInMeters, points = 32) => {
    const coords = {
        latitude: center[1],
        longitude: center[0]
    };

    const ret = [];
    const distanceX = radiusInMeters / (111320 * Math.cos(coords.latitude * Math.PI / 180));
    const distanceY = radiusInMeters / 110574;

    let theta, x, y;
    for (let i = 0; i < points; i++) {
        theta = (i / points) * (2 * Math.PI);
        x = distanceX * Math.cos(theta);
        y = distanceY * Math.sin(theta);

        ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]); // Close the polygon

    return {
        type: 'Polygon',
        coordinates: [ret]
    };
};

// @desc    Create a new attendance session
// @route   POST /api/sessions/create
// @access  Private (Lecturer only)
const createSession = asyncHandler(async (req, res) => {
    const validatedData = createSessionSchema.parse(req.body);
    const { courseId, latitude, longitude, radiusInMeters, durationInMinutes } = validatedData;
    const lecturerId = req.user._id;

    // 1. Verify Course Ownership
    const course = await Course.findOne({ _id: courseId, lecturerId });
    if (!course) {
        res.status(404);
        throw new Error('Course not found or you are not authorized to start a session for it');
    }

    // 2. Prevent Overlapping Active Sessions for this course by this lecturer
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

    // 3. Generate Session Data
    const otcCode = generateOTC();
    const startTime = now;
    const endTime = new Date(now.getTime() + durationInMinutes * 60000);
    const locationPolygon = generateGeoJSONCircle([longitude, latitude], radiusInMeters);

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
