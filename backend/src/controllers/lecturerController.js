/**
 * @module controllers/lecturerController
 * @description Orchestrates the Lecturer access layer, including roster synchronization histories, real-time live attendance matrices, and override approvals for manual check-ins.
 */
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

// @desc    Get courses with attendance summaries
// @route   GET /api/lecturer/courses-summary
// @access  Private/Lecturer
const getCoursesSummary = asyncHandler(async (req, res) => {
    const lecturerId = req.user._id;
    const courses = await Course.find({ lecturerId });

    const summary = await Promise.all(courses.map(async (course) => {
        const sessionsHeld = await AttendanceSession.countDocuments({ courseId: course._id });

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

        let averageAttendance = 0;
        if (sessionsHeld > 0 && totalStudents > 0) {
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
                { $count: 'total' }
            ]);
            const presentCount = presentRecords.length > 0 ? presentRecords[0].total : 0;
            const totalPossible = totalStudents * sessionsHeld;
            averageAttendance = Math.round((presentCount / totalPossible) * 100);
        }

        return {
            id: course._id,
            code: course.courseCode,
            title: course.courseName,
            totalStudents: totalStudents || 0,
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

    const formatted = history.map((record) => ({
        id: record._id,
        platform: record.platform,
        course: record.courseId?.courseCode || 'Unknown',
        date: record.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: record.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        studentsSynced: record.studentsSynced,
        status: record.status,
    }));

    res.json(formatted);
});

// @desc    Get live session attendees
// @route   GET /api/lecturer/live-session/:id/attendees
// @access  Private/Lecturer
const getLiveSessionAttendees = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const lecturerId = req.user._id;

    const session = await AttendanceSession.findOne({
        _id: id,
        lecturerId
    }).populate('courseId');

    if (!session) {
        res.status(404);
        throw new Error('Session not found or unauthorized');
    }

    const attendanceRecords = await AttendanceRecord.find({ sessionId: id })
        .populate('studentId', 'fullName email universityId')
        .sort({ checkedInAt: -1 })
        .lean();

    const totalEnrolled = session.courseId?.enrolledCount || session.courseId?.enrolledStudents?.length || 50;

    const presentCount = attendanceRecords.filter(r => r.status === 'Present').length;
    const pendingCount = attendanceRecords.filter(r => r.status === 'Pending').length;

    const summary = {
        total: totalEnrolled,
        present: presentCount,
        pending: pendingCount,
        absent: Math.max(0, totalEnrolled - attendanceRecords.length),
        presentPercentage: Math.round((presentCount / totalEnrolled) * 100) || 0
    };

    const attendees = attendanceRecords.map(record => ({
        id: record._id,
        studentId: record.studentId?._id,
        studentName: record.studentId?.fullName || 'Unknown Student',
        studentEmail: record.studentId?.email || '',
        studentMatricNumber: record.studentId?.universityId || '',
        status: record.status,
        checkedInAt: record.checkedInAt || record.createdAt,
        distanceFromSession: null,
        requiresManualReview: record.status === 'Pending',
    }));

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
        .populate({ path: 'sessionId', select: 'lecturerId' });

    if (!record) {
        res.status(404);
        throw new Error('Attendance record not found');
    }

    if (record.sessionId.lecturerId.toString() !== lecturerId.toString()) {
        res.status(403);
        throw new Error('Unauthorized to approve this record');
    }

    record.status = 'Present';
    record.approvedBy = lecturerId;
    record.approvedAt = new Date();
    await record.save();

    res.status(200).json({
        success: true,
        message: 'Attendance approved successfully',
        data: { id: record._id, status: record.status }
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
        .populate({ path: 'sessionId', select: 'lecturerId' });

    if (!record) {
        res.status(404);
        throw new Error('Attendance record not found');
    }

    if (record.sessionId.lecturerId.toString() !== lecturerId.toString()) {
        res.status(403);
        throw new Error('Unauthorized to reject this record');
    }

    record.status = 'Absent';
    record.rejectedBy = lecturerId;
    record.rejectedAt = new Date();
    record.rejectionReason = reason || 'Rejected by lecturer';
    await record.save();

    res.status(200).json({
        success: true,
        message: 'Attendance rejected',
        data: { id: record._id, status: record.status }
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

    session.endTime = new Date();
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
