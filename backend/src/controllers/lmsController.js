const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const { z } = require('zod');

const syncSchema = z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Course ID'),
    // Array of student IDs that attended via LMS
    attendedStudentIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)),
});

// @desc    Simulate fetching attendance from Google Classroom/Teams and syncing to DB
// @route   POST /api/lms/sync
// @access  Private/Lecturer
const syncAttendance = asyncHandler(async (req, res) => {
    const validatedData = syncSchema.parse(req.body);
    const { courseId, attendedStudentIds } = validatedData;
    const lecturerId = req.user._id;

    // Validate the course
    const course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }
    if (course.lecturerId.toString() !== lecturerId.toString()) {
        res.status(403);
        throw new Error('Not authorized to sync LMS attendance for this course');
    }
    if (!course.lmsLinked) {
        res.status(400);
        throw new Error('This course is not linked to any LMS');
    }

    // Create a silent background session to link these records to
    const session = await AttendanceSession.create({
        courseId,
        lecturerId,
        otcCode: 'LMS0', // specific to LMS sync to bypass OTC requirement
        startTime: new Date(),
        endTime: new Date(),
        locationPolygon: {
            type: 'Polygon',
            // Provide a dummy global polygon or null (if schema allowed),
            // Here we provide a tiny valid dummy coordinate array for schema compliance
            coordinates: [[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]]
        }
    });

    // Prepare records to insert
    const records = attendedStudentIds.map(studentId => ({
        sessionId: session._id,
        studentId,
        status: 'Present',
        source: 'LMS_Sync',
    }));

    // Perform bulk insertion safely handling duplicates
    const result = await AttendanceRecord.insertMany(records, { ordered: false }).catch((err) => {
        // Return partial successes ignoring duplicates if any
        return err.insertedDocs;
    });

    res.status(200).json({
        message: 'LMS Attendance synchronized successfully',
        syncedCount: result ? result.length : 0,
    });
});

module.exports = { syncAttendance };
