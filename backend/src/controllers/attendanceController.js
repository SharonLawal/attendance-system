/**
 * @module controllers/attendanceController
 * @description The core verification pipeline evaluating cryptographic One-Time Codes (OTC) and calculating geospatial topology intersections using MongoDB 2dsphere indexing.
 */
const asyncHandler = require('express-async-handler');
const { z } = require('zod');
const mongoose = require('mongoose');
const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const Course = require('../models/Course');
const { generateGeoJSONCircle } = require('../utils/geoUtils');

const markAttendanceSchema = z.object({
    otcCode: z.string().length(6, 'OTC Code must be exactly 6 digits'),
    latitude: z.number({ required_error: 'Latitude is required' }),
    longitude: z.number({ required_error: 'Longitude is required' }),
});

const checkAttendanceThreshold = async (courseId, studentId) => {
    try {

        const totalSessionsCount = await AttendanceSession.countDocuments({ courseId });
        if (totalSessionsCount === 0) return;

        const presentRecordsCount = await AttendanceRecord.countDocuments({
            studentId,
            status: 'Present',
        }).populate({
            path: 'sessionId',
            match: { courseId }
        });

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

    const sessionByCode = await AttendanceSession.findOne({ otcCode }).sort({ createdAt: -1 });
    if (!sessionByCode) {
        res.status(400);
        throw new Error('Invalid Code');
    }

    if (new Date() > sessionByCode.endTime) {
        res.status(400);
        throw new Error('Session Expired');
    }

    const studentBufferPolygon = generateGeoJSONCircle([longitude, latitude], 15);

    const validLocationSession = await AttendanceSession.findOne({
        _id: sessionByCode._id,
        locationPolygon: {
            $geoIntersects: {
                $geometry: studentBufferPolygon
            }
        }
    });

    if (!validLocationSession) {
        res.status(400);
        throw new Error('Location outside classroom bounds');
    }

        const prevRecord = await AttendanceRecord.findOne({
            studentId,
            source: 'Manual_GPS',
            createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) }
        }).sort({ createdAt: -1 });

        if (prevRecord && prevRecord.coordinates && prevRecord.coordinates.latitude && String(prevRecord.sessionId) !== String(sessionByCode._id)) {
            const R = 6371;
            const dLat = (latitude - prevRecord.coordinates.latitude) * Math.PI / 180;
            const dLon = (longitude - prevRecord.coordinates.longitude) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(prevRecord.coordinates.latitude * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const timeDiff = (Date.now() - prevRecord.createdAt.getTime()) / (1000 * 60);

            const speed = distance / (timeDiff / 60);

            if (speed > 100 && distance > 0.5) {
                 res.status(403);
                 throw new Error('Location spoofing detected: Impossible travel pace between classes.');
            }
        }

        const existingRecord = await AttendanceRecord.findOne({
            sessionId: sessionByCode._id,
            studentId: studentId
        });

        if (existingRecord) {
            res.status(400);
            throw new Error('You have already marked attendance for this session.');
        }

        const course = await Course.findById(sessionByCode.courseId);

        const isEnrolled = course && course.enrolledStudents.some(id => id.toString() === studentId.toString());
        const recordStatus = isEnrolled ? 'Present' : 'Pending';

        const record = await AttendanceRecord.create({
            sessionId: sessionByCode._id,
            studentId: studentId,
            status: recordStatus,
            source: 'Manual_GPS',
            coordinates: { latitude, longitude }
        });

        if (!isEnrolled) {
            res.status(201).json({
                status: 'pending',
                message: 'Attendance marked as pending. Awaiting lecturer approval.',
                record
            });
            return;
        }

        res.status(201).json({
            status: 'success',
            message: 'Attendance marked successfully',
            record,
        });

        checkAttendanceThreshold(sessionByCode.courseId, studentId);
});

module.exports = {
    markAttendance,
};
