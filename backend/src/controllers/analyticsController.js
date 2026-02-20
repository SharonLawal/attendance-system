const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const AttendanceRecord = require('../models/AttendanceRecord');
const User = require('../models/User');

// @desc    Get weekly attendance trend
// @route   GET /api/analytics/weekly
// @access  Private/Admin/Lecturer
const getWeeklyAttendance = asyncHandler(async (req, res) => {
    // A simplistic mock-like return matching your demodata structure,
    // but in reality we would use an aggregation pipeline grouping by day of week.

    // Example pipeline:
    // 1. Match records within the last 7 days
    // 2. $group by $dayOfWeek(timestamp)
    // 3. Count total vs Present to get rate per day

    res.json([
        { day: "Mon", rate: 88 },
        { day: "Tue", rate: 92 },
        { day: "Wed", rate: 85 },
        { day: "Thu", rate: 78 },
        { day: "Fri", rate: 95 },
    ]);
});

// @desc    Get departmental attendance rates
// @route   GET /api/analytics/departments
// @access  Private/Admin
const getDepartmentRates = asyncHandler(async (req, res) => {
    // Aggregate attendance by student's department
    const stats = await AttendanceRecord.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'studentId',
                foreignField: '_id',
                as: 'student'
            }
        },
        { $unwind: '$student' },
        // Only group users who have a department set
        { $match: { 'student.department': { $exists: true, $ne: null } } },
        {
            $group: {
                _id: '$student.department',
                totalRecords: { $sum: 1 },
                presentRecords: {
                    $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] }
                }
            }
        },
        {
            $project: {
                dept: '$_id',
                rate: {
                    $round: [
                        { $multiply: [{ $divide: ['$presentRecords', '$totalRecords'] }, 100] },
                        0 // 0 decimal places
                    ]
                },
                _id: 0
            }
        }
    ]);

    // If DB is mostly empty, return fallback data mapping demodata
    if (stats.length === 0) {
        return res.json([
            { dept: "Computer Science", rate: 91 },
            { dept: "Software Engineering", rate: 85 },
            { dept: "Information Tech", rate: 76 },
            { dept: "Computer Technology", rate: 88 }
        ]);
    }

    res.json(stats);
});

// @desc    Get critical students list (<75%)
// @route   GET /api/analytics/critical-students
// @access  Private/Admin/Lecturer
const getCriticalStudents = asyncHandler(async (req, res) => {
    const criticalStudents = await AttendanceRecord.aggregate([
        {
            $group: {
                _id: '$studentId',
                total: { $sum: 1 },
                present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } }
            }
        },
        {
            $project: {
                attendanceRate: { $multiply: [{ $divide: ['$present', '$total'] }, 100] }
            }
        },
        { $match: { attendanceRate: { $lt: 75 } } }, // Threshold
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' }
    ]);

    const result = criticalStudents.map(c => ({
        id: c._id,
        name: c.user.fullName,
        matric: c.user.universityId,
        dept: c.user.department || 'Unassigned',
        attendance: Math.round(c.attendanceRate),
    }));

    res.json(result);
});

// @desc    Get detailed attendance feed
// @route   GET /api/analytics/detailed-reports
// @access  Private/Admin
const getDetailedReports = asyncHandler(async (req, res) => {
    const records = await AttendanceRecord.find()
        .sort({ timestamp: -1 })
        .limit(50)
        .populate('studentId', 'fullName universityId')
        .populate({
            path: 'sessionId',
            populate: { path: 'courseId', select: 'courseCode' }
        });

    const formatted = records.map(r => ({
        id: r._id,
        name: r.studentId?.fullName,
        matric: r.studentId?.universityId,
        course: r.sessionId?.courseId?.courseCode,
        date: r.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: r.status,
    }));

    res.json(formatted);
});

module.exports = {
    getWeeklyAttendance,
    getDepartmentRates,
    getCriticalStudents,
    getDetailedReports,
};
