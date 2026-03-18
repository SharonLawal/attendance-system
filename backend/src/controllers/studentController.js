const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const AttendanceRecord = require('../models/AttendanceRecord');
const AttendanceSession = require('../models/AttendanceSession');
const Course = require('../models/Course');
const ClassSchedule = require('../models/ClassSchedule');
const Notification = require('../models/Notification');

// @desc    Get aggregated dashboard data for student
// @route   GET /api/student/dashboard
// @access  Private/Student
const getDashboard = asyncHandler(async (req, res) => {
    const studentId = req.user._id;

    // 1. Calculate Stats
    const records = await AttendanceRecord.find({ studentId }).populate('sessionId');
    const courseIds = [...new Set(records.map(r => r.sessionId?.courseId?.toString()).filter(Boolean))];

    let totalSessions = 0;
    let presentCount = 0;

    if (courseIds.length > 0) {
        totalSessions = await AttendanceSession.countDocuments({ courseId: { $in: courseIds } });
        presentCount = await AttendanceRecord.countDocuments({ studentId, status: 'Present' });
    }

    const attendancePercentage = totalSessions === 0 ? 100 : Math.round((presentCount / totalSessions) * 100);

    const stats = {
        attendance_percentage: attendancePercentage,
        total_classes: totalSessions,
        attended_classes: presentCount,
        streak_days: 0 // Mock for now, would require complex date diffing of consecutive present records
    };

    // 2. Fetch Today's Schedule (Simplified: just grabs first 3 for UI mockup if day filter isn't active)
    const todaysSchedule = await ClassSchedule.find()
        .populate('courseId', 'courseCode courseName')
        .limit(3);

    // 3. Fetch Recent History (Last 5)
    const recentHistory = await AttendanceRecord.find({ studentId })
        .sort({ timestamp: -1 })
        .limit(5)
        .populate({
            path: 'sessionId',
            populate: { path: 'courseId', select: 'courseCode courseName' }
        });

    res.json({
        stats,
        todays_schedule: todaysSchedule,
        recent_history: recentHistory
    });
});

// @desc    Get aggregate stats for standard student dashboard (LEGACY - can be deprecated)
// @route   GET /api/student/stats
// @access  Private/Student
const getDashboardStats = asyncHandler(async (req, res) => {
    res.json({ attendancePercentage: 100 });
});

// @desc    Get attendance history (Paginated)
// @route   GET /api/student/history
// @access  Private/Student
const getHistory = asyncHandler(async (req, res) => {
    const studentId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
        AttendanceRecord.find({ studentId })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'sessionId',
                populate: { path: 'courseId', select: 'courseCode courseName' }
            }),
        AttendanceRecord.countDocuments({ studentId })
    ]);

    res.json({
        data: records,
        pagination: {
            current_page: page,
            total_pages: Math.ceil(total / limit),
            total_items: total,
            items_per_page: limit,
            has_next_page: page * limit < total,
            has_prev_page: page > 1,
        }
    });
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
    getDashboard,
    getDashboardStats,
    getHistory,
    getCourses,
    getSchedule,
    getActiveSession,
    getNotifications,
};
