const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const Classroom = require('../models/Classroom');
const SyncHistory = require('../models/SyncHistory');

// @desc    Get dashboard analytics for lecturer
// @route   GET /api/lecturer/dashboard
// @access  Private/Lecturer
const getDashboard = asyncHandler(async (req, res) => {
    const lecturerId = req.user._id;

    const [coursesCount, activeSession, records] = await Promise.all([
        Course.countDocuments({ lecturerId }),
        AttendanceSession.findOne({ 
            lecturerId, 
            endTime: { $gt: new Date() } 
        }).populate('courseId', 'courseCode courseName'),
        
        AttendanceSession.aggregate([
            { $match: { lecturerId: new mongoose.Types.ObjectId(lecturerId) } },
            {
                $lookup: {
                    from: 'attendancerecords',
                    localField: '_id',
                    foreignField: 'sessionId',
                    as: 'records'
                }
            },
            {
                $project: {
                    presentCount: {
                        $size: {
                            $filter: {
                                input: '$records',
                                as: 'record',
                                cond: { $eq: ['$$record.status', 'Present'] }
                            }
                        }
                    },
                    totalCount: { $size: '$records' }
                }
            }
        ])
    ]);

    let totalExpected = 0;
    let totalPresent = 0;
    records.forEach(session => {
        totalPresent += session.presentCount;
        totalExpected += session.totalCount > 0 ? session.totalCount : 50; 
    });
    
    const averageAttendance = totalExpected === 0 ? 100 : Math.round((totalPresent / totalExpected) * 100);
    const uniqueStudents = await AttendanceRecord.distinct('studentId');

    res.json({
        total_courses: coursesCount,
        active_sessions: activeSession ? 1 : 0,
        total_students: uniqueStudents.length,
        average_attendance: averageAttendance,
        active_session: activeSession ? {
            id: activeSession._id,
            course_code: activeSession.courseId?.courseCode,
            course_name: activeSession.courseId?.courseName,
            otc_code: activeSession.otcCode,
            start_time: activeSession.startTime,
            end_time: activeSession.endTime,
        } : null,
        upcoming_sessions: []
    });
});


// @desc    Get courses taught by lecturer with attendance summaries
// @route   GET /api/lecturer/courses-summary
// @access  Private/Lecturer
const getCoursesSummary = asyncHandler(async (req, res) => {
    const lecturerId = req.user._id;

    const courses = await Course.find({ lecturerId });

    const summary = await Promise.all(courses.map(async (course) => {
        const sessionsHeld = await AttendanceSession.countDocuments({ courseId: course._id });

        // Total students enrolled can be derived from unique students with records in this course's sessions
        const uniqueStudents = await AttendanceRecord.aggregate([
            {
                $lookup: {
                    from: 'attendancesessions',
                    localField: 'sessionId',
                    foreignField: '_id',
                    as: 'session'
                }
            },
            { $unwind: '$session' },
            { $match: { 'session.courseId': course._id } },
            { $group: { _id: '$studentId' } }
        ]);

        const totalStudents = uniqueStudents.length;

        // Calculate average attendance
        let averageAttendance = 0;
        if (sessionsHeld > 0 && totalStudents > 0) {
            const totalPresent = await AttendanceRecord.countDocuments({
                status: 'Present'
            }).populate({
                path: 'sessionId',
                match: { courseId: course._id }
            }); // Note: robustly we'd aggregate like above, but simple logic for now:

            const presentRecords = await AttendanceRecord.aggregate([
                { $match: { status: 'Present' } },
                {
                    $lookup: {
                        from: 'attendancesessions',
                        localField: 'sessionId',
                        foreignField: '_id',
                        as: 'session'
                    }
                },
                { $unwind: '$session' },
                { $match: { 'session.courseId': course._id } },
                { $count: "total" }
            ]);
            const presentCount = presentRecords.length > 0 ? presentRecords[0].total : 0;
            const totalPossible = totalStudents * sessionsHeld;
            averageAttendance = Math.round((presentCount / totalPossible) * 100);
        }

        return {
            id: course._id,
            code: course.courseCode,
            title: course.courseName,
            totalStudents: totalStudents || 0, // Fallback if 0
            averageAttendance,
            sessionsHeld,
        };
    }));

    res.json(summary);
});

// @desc    Get all classrooms
// @route   GET /api/lecturer/classrooms
// @access  Private/Lecturer
const getClassrooms = asyncHandler(async (req, res) => {
    const classrooms = await Classroom.find().sort({ name: 1 });
    const result = classrooms.map(c => ({
        id: c._id,
        name: c.name,
        capacity: c.capacity,
    }));
    res.json(result);
});

// @desc    Get sync history logs
// @route   GET /api/lecturer/sync-history
// @access  Private/Lecturer
const getSyncHistory = asyncHandler(async (req, res) => {
    const lecturerId = req.user._id;
    const history = await SyncHistory.find({ lecturerId })
        .sort({ createdAt: -1 })
        .populate('courseId', 'courseCode');

    const formatted = history.map((record, index) => ({
        id: record._id,
        platform: record.platform,
        course: record.courseId?.courseCode,
        date: record.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: record.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        studentsSynced: record.studentsSynced,
        status: record.status,
    }));

    res.json(formatted);
});

// Helper: Calculate distance between two coordinates (Haversine formula) in meters
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
  
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; 
}

// @desc    Get live session attendees
// @route   GET /api/lecturer/live-session/:id/attendees
// @access  Private/Lecturer
const getLiveSessionAttendees = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const lecturerId = req.user._id;

    // Verify session ownership
    const session = await AttendanceSession.findOne({
        _id: id,
        lecturerId 
    }).populate('courseId');

    if (!session) {
        res.status(404);
        throw new Error('Active session not found or unauthorized');
    }

    // Get all attendance records for this session
    const attendanceRecords = await AttendanceRecord.find({
        sessionId: id
    })
    .populate('studentId', 'firstName lastName email matricNumber')
    .sort({ checkedInAt: -1 })
    .lean();

    // Get total enrolled students for comparison
    const totalEnrolled = session.courseId.enrolledCount || 50;

    // Calculate summary stats
    const presentCount = attendanceRecords.filter(r => r.status === 'Present').length;
    const pendingCount = attendanceRecords.filter(r => r.status === 'Pending').length;

    const summary = {
        total: totalEnrolled,
        present: presentCount,
        pending: pendingCount,
        absent: totalEnrolled - attendanceRecords.length,
        presentPercentage: Math.round((presentCount / totalEnrolled) * 100) || 0
    };

    // Calculate session center from locationPolygon if it exists
    let sessionLat = null;
    let sessionLon = null;
    if (session.locationPolygon && session.locationPolygon.coordinates && session.locationPolygon.coordinates[0]) {
        // Approximate center from the first coordinate of the polygon
        sessionLon = session.locationPolygon.coordinates[0][0][0];
        sessionLat = session.locationPolygon.coordinates[0][0][1];
    }

    // Transform records
    const attendees = attendanceRecords.map(record => {
        let distanceFromSession = null;
        if (record.coordinates && record.coordinates.latitude && sessionLat) {
            distanceFromSession = calculateDistance(
                record.coordinates.latitude,
                record.coordinates.longitude,
                sessionLat,
                sessionLon
            );
        }

        const requiresManualReview = 
            record.status === 'Pending' || 
            (distanceFromSession && distanceFromSession > 50); // Using 50m as default geofence radius

        return {
            id: record._id,
            studentId: record.studentId?._id,
            studentName: record.studentId ? `${record.studentId.firstName} ${record.studentId.lastName}` : 'Unknown Student',
            studentEmail: record.studentId?.email,
            studentMatricNumber: record.studentId?.matricNumber,
            status: record.status,
            checkedInAt: record.checkedInAt || record.timestamp,
            coordinates: record.coordinates,
            distanceFromSession: distanceFromSession ? Math.round(distanceFromSession) : null,
            deviceInfo: record.deviceInfo || null,
            requiresManualReview
        };
    });

    res.status(200).json({
        success: true,
        data: {
            sessionId: session._id,
            courseCode: session.courseId?.courseCode,
            courseName: session.courseId?.courseName,
            otcCode: session.otcCode,
            summary,
            attendees
        }
    });
});

// @desc    Approve a pending attendance record
// @route   POST /api/lecturer/attendance/:recordId/approve
// @access  Private/Lecturer
const approvePendingAttendance = asyncHandler(async (req, res) => {
    const { recordId } = req.params;
    const lecturerId = req.user._id;

    const record = await AttendanceRecord.findById(recordId)
        .populate({
            path: 'sessionId',
            select: 'lecturerId'
        });

    if (!record) {
        res.status(404);
        throw new Error('Attendance record not found');
    }

    // Verify lecturer owns this session
    if (record.sessionId.lecturerId.toString() !== lecturerId.toString()) {
        res.status(403);
        throw new Error('Unauthorized to approve this record');
    }

    // Update status to Present
    record.status = 'Present';
    record.approvedBy = lecturerId;
    record.approvedAt = new Date();
    await record.save();

    res.status(200).json({
        success: true,
        message: 'Attendance approved successfully',
        data: {
            id: record._id,
            status: record.status,
            approvedAt: record.approvedAt
        }
    });
});

// @desc    Reject a pending attendance record
// @route   POST /api/lecturer/attendance/:recordId/reject
// @access  Private/Lecturer
const rejectPendingAttendance = asyncHandler(async (req, res) => {
    const { recordId } = req.params;
    const { reason } = req.body;
    const lecturerId = req.user._id;

    const record = await AttendanceRecord.findById(recordId)
        .populate({
            path: 'sessionId',
            select: 'lecturerId'
        });

    if (!record) {
        res.status(404);
        throw new Error('Attendance record not found');
    }

    // Verify lecturer owns this session
    if (record.sessionId.lecturerId.toString() !== lecturerId.toString()) {
        res.status(403);
        throw new Error('Unauthorized to reject this record');
    }

    // Update status to Absent
    record.status = 'Absent';
    record.rejectedBy = lecturerId;
    record.rejectedAt = new Date();
    record.rejectionReason = reason || 'Location verification failed';
    await record.save();

    res.status(200).json({
        success: true,
        message: 'Attendance rejected successfully',
        data: {
            id: record._id,
            status: record.status,
            rejectedAt: record.rejectedAt,
            reason: record.rejectionReason
        }
    });
});

// @desc    End active session early
// @route   POST /api/lecturer/end-session/:id
// @access  Private/Lecturer
const endSession = asyncHandler(async (req, res) => {
    const lecturerId = req.user._id;
    const session = await AttendanceSession.findOne({ _id: req.params.id, lecturerId });

    if (!session) {
        res.status(404);
        throw new Error('Session not found');
    }

    session.endTime = new Date(); // End immediately
    await session.save();

    res.json({ message: 'Session ended successfully' });
});

// @desc    Extend active session by X minutes
// @route   POST /api/lecturer/extend-session/:id
// @access  Private/Lecturer
const extendSession = asyncHandler(async (req, res) => {
    const lecturerId = req.user._id;
    const { minutes } = req.body;

    if (!minutes || minutes <= 0) {
        res.status(400);
        throw new Error('Please provide valid minutes to extend');
    }

    const session = await AttendanceSession.findOne({ _id: req.params.id, lecturerId });

    if (!session) {
        res.status(404);
        throw new Error('Session not found');
    }

    // Add minutes to the current end time
    session.endTime = new Date(session.endTime.getTime() + minutes * 60000);
    await session.save();

    res.json({
        message: `Session extended by ${minutes} minutes`,
        newEndTime: session.endTime
    });
});

module.exports = {
    getDashboard,
    getCoursesSummary,
    getClassrooms,
    getSyncHistory,
    getLiveSessionAttendees,
    approvePendingAttendance,
    rejectPendingAttendance,
    endSession,
    extendSession,
};
