const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { google } = require('googleapis');
const AttendanceRecord = require('../models/AttendanceRecord');
const AttendanceSession = require('../models/AttendanceSession');
const Course = require('../models/Course');
const ClassSchedule = require('../models/ClassSchedule');
const User = require('../models/User');

// @desc    Get Google OAuth URL for linking student email
// @route   GET /api/student/link-google
// @access  Private/Student
const getGoogleAuthUrl = asyncHandler(async (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.BACKEND_URL}/api/student/link-google/callback`
    );

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.email'],
        state: req.user._id.toString() 
    });

    res.json({ url });
});

// @desc    Handle Google OAuth callback to link email
// @route   GET /api/student/link-google/callback
// @access  Public (relies on state param)
const linkGoogleCallback = asyncHandler(async (req, res) => {
    const { code, state } = req.query;
    if (!code || !state) {
        return res.redirect(`${process.env.FRONTEND_URL}/student/profile?error=invalid_callback`);
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.BACKEND_URL}/api/student/link-google/callback`
    );

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const userInfo = await oauth2.userinfo.get();
        const email = userInfo.data.email;

        await User.findByIdAndUpdate(state, { linkedGoogleEmail: email });
        res.redirect(`${process.env.FRONTEND_URL}/student?linked=success`);
    } catch (error) {
        console.error('Google OAuth linking error:', error.message);
        res.redirect(`${process.env.FRONTEND_URL}/student?error=oauth_failed`);
    }
});

// @desc    Get aggregated dashboard data for student
// @route   GET /api/student/dashboard
// @access  Private/Student
const getDashboard = asyncHandler(async (req, res) => {
    const studentId = req.user._id;

    // Get all records for this student
    const records = await AttendanceRecord.find({ studentId })
        .populate({ path: 'sessionId', populate: { path: 'courseId', select: 'courseCode courseName _id' } });

    // Get unique course IDs this student has attendance records for
    const courseIds = [...new Set(
        records
            .map(r => r.sessionId?.courseId?._id?.toString())
            .filter(Boolean)
    )];

    let totalSessions = 0;
    let presentCount = 0;

    if (courseIds.length > 0) {
        totalSessions = await AttendanceSession.countDocuments({
            courseId: { $in: courseIds }
        });
        presentCount = await AttendanceRecord.countDocuments({
            studentId,
            status: 'Present'
        });
    }

    const attendancePercentage = totalSessions === 0 ? 100 : Math.round((presentCount / totalSessions) * 100);

    // Today's schedule
    const todaysSchedule = await ClassSchedule.find()
        .populate('courseId', 'courseCode courseName')
        .limit(3);

    // Recent history — FIXED: sort by checkedInAt not timestamp
    const recentHistory = await AttendanceRecord.find({ studentId })
        .sort({ checkedInAt: -1 })   // ← FIXED
        .limit(5)
        .populate({
            path: 'sessionId',
            populate: { path: 'courseId', select: 'courseCode courseName' }
        });

    res.json({
        stats: {
            attendance_percentage: attendancePercentage,
            total_classes: totalSessions,
            attended_classes: presentCount,
            streak_days: 0
        },
        todays_schedule: todaysSchedule.map(s => ({
            courseCode: s.courseId?.courseCode,
            courseName: s.courseId?.courseName,
            startTime: s.startTime,
            endTime: s.endTime,
            room: s.room,
            type: s.type,
        })),
        recent_history: recentHistory.map(r => ({
            id: r._id,
            course: r.sessionId?.courseId?.courseCode || 'Unknown',
            date: r.checkedInAt
                ? new Date(r.checkedInAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Unknown',
            time: r.checkedInAt
                ? new Date(r.checkedInAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                : '',
            status: r.status,
            method: r.source,
        }))
    });
});

// @desc    Lightweight stats endpoint (kept for compatibility)
// @route   GET /api/student/stats
// @access  Private/Student
const getDashboardStats = asyncHandler(async (req, res) => {
    // Forward to the full dashboard so both endpoints return consistent data
    const studentId = req.user._id;
    const totalSessions = await AttendanceSession.countDocuments();
    const presentCount = await AttendanceRecord.countDocuments({ studentId, status: 'Present' });
    const attendancePercentage = totalSessions === 0 ? 100 : Math.round((presentCount / totalSessions) * 100);
    res.json({ attendancePercentage });
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
            .sort({ checkedInAt: -1 })   // ← FIXED
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'sessionId',
                populate: { path: 'courseId', select: 'courseCode courseName' }
            }),
        AttendanceRecord.countDocuments({ studentId })
    ]);

    res.json({
        data: records.map(r => ({
            id: r._id,
            course: r.sessionId?.courseId?.courseCode || 'Unknown',
            date: r.checkedInAt
                ? new Date(r.checkedInAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Unknown',
            time: r.checkedInAt
                ? new Date(r.checkedInAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                : '',
            status: r.status,
            method: r.source,
        })),
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
            instructor: course.lecturerId?.fullName || 'Unknown',
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

    const activeSession = await AttendanceSession.findOne({
        endTime: { $gt: now }
    }).populate('courseId', 'courseCode courseName');

    if (!activeSession) {
        return res.json({ active: false });
    }

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



module.exports = {
    getDashboard,
    getDashboardStats,
    getHistory,
    getCourses,
    getSchedule,
    getActiveSession,
    getGoogleAuthUrl,
    linkGoogleCallback,
};
