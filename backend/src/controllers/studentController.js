const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const AttendanceRecord = require('../models/AttendanceRecord');
const AttendanceSession = require('../models/AttendanceSession');
const Course = require('../models/Course');
const ClassSchedule = require('../models/ClassSchedule');
const Notification = require('../models/Notification');

// @desc    Get aggregate stats for standard student dashboard 
// @route   GET /api/student/stats
// @access  Private/Student
const getDashboardStats = asyncHandler(async (req, res) => {
    const studentId = req.user._id;

    // Find all courses this student has an attendance record in (simplification for beta)
    // In a robust system, we would query an Enrollment table.
    const records = await AttendanceRecord.find({ studentId }).populate('sessionId');
    const courseIds = [...new Set(records.map(r => r.sessionId?.courseId.toString()).filter(Boolean))];

    let totalSessions = 0;
    let presentCount = 0;

    if (courseIds.length > 0) {
        totalSessions = await AttendanceSession.countDocuments({ courseId: { $in: courseIds } });
        presentCount = await AttendanceRecord.countDocuments({ studentId, status: 'Present' });
    }

    const attendancePercentage = totalSessions === 0 ? 100 : Math.round((presentCount / totalSessions) * 100);

    res.json({
        attendancePercentage,
    });
});

// @desc    Get attendance history
// @route   GET /api/student/history
// @access  Private/Student
const getHistory = asyncHandler(async (req, res) => {
    const studentId = req.user._id;
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;

    const records = await AttendanceRecord.find({ studentId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate({
            path: 'sessionId',
            populate: { path: 'courseId', select: 'courseCode courseName' }
        });

    const formattedHistory = records.map((record, index) => ({
        id: record._id,
        course: record.sessionId?.courseId?.courseCode || 'Unknown',
        date: record.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: record.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: record.status,
        method: record.source,
    }));

    res.json(formattedHistory);
});

// @desc    Get courses student is involved in with attendance breakdown
// @route   GET /api/student/courses
// @access  Private/Student
const getCourses = asyncHandler(async (req, res) => {
    const studentId = req.user._id;

    // Aggregate student attendance per course
    const courseStats = await AttendanceRecord.aggregate([
        { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
        {
            $lookup: {
                from: 'attendancesessions',
                localField: 'sessionId',
                foreignField: '_id',
                as: 'session'
            }
        },
        { $unwind: '$session' },
        {
            $group: {
                _id: '$session.courseId',
                attendedClasses: {
                    $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] }
                }
            }
        }
    ]);

    const courseIds = courseStats.map(c => c._id);
    const courses = await Course.find({ _id: { $in: courseIds } }).populate('lecturerId', 'fullName');

    const result = await Promise.all(courses.map(async (course) => {
        const stat = courseStats.find(c => c._id.equals(course._id));
        const totalClasses = await AttendanceSession.countDocuments({ courseId: course._id });

        const attendedClasses = stat ? stat.attendedClasses : 0;
        const percentage = totalClasses === 0 ? 100 : Math.round((attendedClasses / totalClasses) * 100);

        let status = 'safe';
        if (percentage < 75) status = 'critical';
        else if (percentage < 85) status = 'warning';

        return {
            id: course._id,
            code: course.courseCode,
            title: course.courseName,
            instructor: course.lecturerId ? course.lecturerId.fullName : 'Unknown',
            attendancePercentage: percentage,
            totalClasses,
            attendedClasses,
            status
        };
    }));

    res.json(result);
});

// @desc    Get schedule
// @route   GET /api/student/schedule
// @access  Private/Student
const getSchedule = asyncHandler(async (req, res) => {
    // In a real system, you'd filter ClassSchedule by courses the student is enrolled in.
    // For now, we return all as mock.
    const schedules = await ClassSchedule.find().populate('courseId', 'courseCode courseName');

    const formattedSchedule = schedules.map(s => ({
        day: s.dayOfWeek,
        time: `${s.startTime} - ${s.endTime}`,
        course: s.courseId?.courseCode,
        title: s.courseId?.courseName,
        room: s.room,
        type: s.type,
    }));

    res.json(formattedSchedule);
});

// @desc    Check for an active session (Polling endpoint)
// @route   GET /api/student/active-session
// @access  Private/Student
const getActiveSession = asyncHandler(async (req, res) => {
    const studentId = req.user._id;
    const now = new Date();

    // Find any session that is currently active (endTime > now)
    const activeSession = await AttendanceSession.findOne({
        endTime: { $gt: now }
    }).populate('courseId', 'courseCode courseName');

    if (!activeSession) {
        return res.json({ active: false });
    }

    // Optionally check if student already marked presence
    const existingRecord = await AttendanceRecord.findOne({
        sessionId: activeSession._id,
        studentId
    });

    if (existingRecord) {
        return res.json({ active: false, message: 'Already marked' });
    }

    res.json({
        active: true,
        sessionId: activeSession._id,
        courseCode: activeSession.courseId?.courseCode,
        courseName: activeSession.courseId?.courseName,
        expiresAt: activeSession.endTime,
    });
});

// @desc    Get user notifications/warnings
// @route   GET /api/student/notifications
// @access  Private/Student
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ studentId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(10);

    res.json(notifications);
});

module.exports = {
    getDashboardStats,
    getHistory,
    getCourses,
    getSchedule,
    getActiveSession,
    getNotifications,
};
