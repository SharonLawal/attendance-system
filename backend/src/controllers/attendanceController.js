const asyncHandler = require('express-async-handler');
const { z } = require('zod');
const mongoose = require('mongoose');
const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const Notification = require('../models/Notification');
const Course = require('../models/Course');

const markAttendanceSchema = z.object({
    otcCode: z.string().length(4, 'OTC Code must be exactly 4 digits'),
    latitude: z.number({ required_error: 'Latitude is required' }),
    longitude: z.number({ required_error: 'Longitude is required' }),
});

// Helper function to check attendance threshold
const checkAttendanceThreshold = async (courseId, studentId) => {
    try {
        // Total sessions created for the course
        const totalSessionsCount = await AttendanceSession.countDocuments({ courseId });
        if (totalSessionsCount === 0) return;

        // Total times student was present
        const presentRecordsCount = await AttendanceRecord.countDocuments({
            studentId,
            status: 'Present',
        }).populate({
            path: 'sessionId',
            match: { courseId }
        });

        // We only want to count records corresponding to this course. Since populate filtering 
        // applies the match conditionally to the populated doc, it might be simpler to aggregate:

        const studentRecordsInCourse = await AttendanceRecord.aggregate([
            { $match: { studentId: new mongoose.Types.ObjectId(studentId), status: 'Present' } },
            {
                $lookup: {
                    from: 'attendancesessions',
                    localField: 'sessionId',
                    foreignField: '_id',
                    as: 'session'
                }
            },
            { $unwind: '$session' },
            { $match: { 'session.courseId': new mongoose.Types.ObjectId(courseId) } },
            { $count: 'presentCount' }
        ]);

        const presentCount = studentRecordsInCourse.length > 0 ? studentRecordsInCourse[0].presentCount : 0;
        const attendancePercentage = (presentCount / totalSessionsCount) * 100;

        if (attendancePercentage < 75) {
            const course = await Course.findById(courseId);
            await Notification.create({
                studentId,
                message: `Warning: Your attendance for ${course.courseCode} has dropped below 75% (Current: ${attendancePercentage.toFixed(1)}%).`,
            });
        }
    } catch (error) {
        console.error('Failed to calculate attendance threshold:', error);
    }
};

// @desc    Mark attendance for a student
// @route   POST /api/attendance/mark
// @access  Private/Student
const markAttendance = asyncHandler(async (req, res) => {
    const validatedData = markAttendanceSchema.parse(req.body);
    const { otcCode, latitude, longitude } = validatedData;
    const studentId = req.user._id;

    // 1. Check if OTC code session exists at all
    const sessionByCode = await AttendanceSession.findOne({ otcCode }).sort({ createdAt: -1 });
    if (!sessionByCode) {
        res.status(400);
        throw new Error('Invalid Code');
    }

    // 2. Check if the session is expired
    if (new Date() > sessionByCode.endTime) {
        res.status(400);
        throw new Error('Session Expired');
    }

    // 3. Check for geospatial intersection
    const validLocationSession = await AttendanceSession.findOne({
        _id: sessionByCode._id,
        locationPolygon: {
            $geoIntersects: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude] // GeoJSON is [lng, lat]
                }
            }
        }
    });

    if (!validLocationSession) {
        res.status(400);
        throw new Error('Location outside classroom bounds');
    }

    // 4. Try to save the attendance record
    try {
        const record = await AttendanceRecord.create({
            sessionId: sessionByCode._id,
            studentId: studentId,
            status: 'Present',
            source: 'Manual_GPS'
        });

        res.status(201).json({
            message: 'Attendance marked successfully',
            record,
        });

        // Fire-and-forget threshold check securely in the background
        checkAttendanceThreshold(sessionByCode.courseId, studentId);

    } catch (error) {
        // Handle uniqueness error (student already marked presence in this session)
        if (error.code === 11000) {
            res.status(400);
            throw new Error('Attendance already marked for this session');
        }
        throw error;
    }
});

module.exports = {
    markAttendance,
};
