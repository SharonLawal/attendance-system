const asyncHandler = require('express-async-handler');
const { z } = require('zod');
const mongoose = require('mongoose');
const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const Course = require('../models/Course');

const markAttendanceSchema = z.object({
    otcCode: z.string().length(6, 'OTC Code must be exactly 6 digits'),
    latitude: z.number({ required_error: 'Latitude is required' }),
    longitude: z.number({ required_error: 'Longitude is required' }),
});

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

        // Removed notification logic
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

    // 3. Check for geospatial intersection with a buffer
    const studentBufferPolygon = generateGeoJSONCircle([longitude, latitude], 15); // 15 meters buffer

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

        // 3.5 Location Spoofing Check (Impossible Travel)
        const prevRecord = await AttendanceRecord.findOne({
            studentId,
            source: 'Manual_GPS',
            createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // Last 30 mins
        }).sort({ createdAt: -1 });

        if (prevRecord && prevRecord.coordinates && prevRecord.coordinates.latitude && String(prevRecord.sessionId) !== String(sessionByCode._id)) {
            const R = 6371; // Earth radius in km
            const dLat = (latitude - prevRecord.coordinates.latitude) * Math.PI / 180;
            const dLon = (longitude - prevRecord.coordinates.longitude) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(prevRecord.coordinates.latitude * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); // km
            const timeDiff = (Date.now() - prevRecord.createdAt.getTime()) / (1000 * 60); // minutes

            // Speed in km/h 
            const speed = distance / (timeDiff / 60);
            
            // If speed is faster than 100 km/h and distance > 0.5km (impossible campus travel)
            if (speed > 100 && distance > 0.5) {
                 res.status(403);
                 throw new Error('Location spoofing detected: Impossible travel pace between classes.');
            }
        }

        // 4. Determine Enrollment & Save Record
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
            return; // Skip threshold checks for unverified students
        }

        res.status(201).json({
            status: 'success',
            message: 'Attendance marked successfully',
            record,
        });

        // Fire-and-forget threshold check securely in the background
        checkAttendanceThreshold(sessionByCode.courseId, studentId);

    }
});

module.exports = {
    markAttendance,
};
