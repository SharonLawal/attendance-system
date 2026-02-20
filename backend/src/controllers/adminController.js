const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const AttendanceSession = require('../models/AttendanceSession');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

// @desc    Get top level system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = asyncHandler(async (req, res) => {
    const totalStudents = await User.countDocuments({ role: 'Student' });

    const now = new Date();
    const activeSessions = await AttendanceSession.countDocuments({
        endTime: { $gt: now }
    });

    const flaggedAbsences = await Notification.countDocuments();

    // Mock system health
    const systemHealth = '99.9%';

    res.json({
        totalStudents: totalStudents.toLocaleString(),
        activeSessions: activeSessions.toString(),
        systemHealth,
        flaggedAbsences: flaggedAbsences.toString(),
    });
});

// @desc    Get user list with pagination
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const skip = (page - 1) * limit;

    const users = await User.find()
        .select('-passwordHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const formattedUsers = users.map(u => ({
        id: u._id,
        name: u.fullName,
        identifier: u.universityId,
        role: u.role,
        status: u.accountStatus || 'Active', // From the newly added field
    }));

    const total = await User.countDocuments();

    res.json({
        users: formattedUsers,
        total,
        page,
        pages: Math.ceil(total / limit),
    });
});

// @desc    Get real-time audit logs
// @route   GET /api/admin/audit-logs
// @access  Private/Admin
const getAuditLogs = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;

    const logs = await AuditLog.find()
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate('performedBy', 'fullName role')
        .populate('targetUserId', 'fullName')
        .populate('targetCourseId', 'courseCode');

    res.json(logs);
});

module.exports = {
    getSystemStats,
    getUsers,
    getAuditLogs,
};
