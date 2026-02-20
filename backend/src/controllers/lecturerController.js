const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Course = require('../models/Course');
const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const Classroom = require('../models/Classroom');
const SyncHistory = require('../models/SyncHistory');

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

// @desc    Get stats for currently active session
// @route   GET /api/lecturer/live-session
// @access  Private/Lecturer
const getLiveSessionStats = asyncHandler(async (req, res) => {
    const lecturerId = req.user._id;
    const now = new Date();

    const activeSession = await AttendanceSession.findOne({
        lecturerId,
        endTime: { $gt: now }
    }).populate('courseId', 'courseCode');

    if (!activeSession) {
        return res.json({ active: false });
    }

    const presentCount = await AttendanceRecord.countDocuments({
        sessionId: activeSession._id,
        status: 'Present'
    });

    const timeRemainingMs = activeSession.endTime.getTime() - now.getTime();
    const minutesRemaining = Math.max(0, Math.floor(timeRemainingMs / 60000));
    const secondsRemaining = Math.max(0, Math.floor((timeRemainingMs % 60000) / 1000));

    res.json({
        active: true,
        sessionId: activeSession._id,
        courseCode: activeSession.courseId?.courseCode,
        otcCode: activeSession.otcCode,
        presentCount,
        timeRemaining: `${minutesRemaining}:${secondsRemaining.toString().padStart(2, '0')}`,
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
    getCoursesSummary,
    getClassrooms,
    getSyncHistory,
    getLiveSessionStats,
    endSession,
    extendSession,
};
