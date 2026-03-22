const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const AttendanceSession = require('../models/AttendanceSession');

// @desc    Get top level system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = asyncHandler(async (req, res) => {
    const totalStudents = await User.countDocuments({ role: 'Student' });

    const now = new Date();
    const activeSessions = await AttendanceSession.countDocuments({
        endTime: { $gt: now }
    });

    const flaggedAbsences = 0; // Removed notification feature

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

    const query = {};

    if (req.query.role && req.query.role.toLowerCase() !== 'all') {
        const roleStr = req.query.role.toLowerCase();
        // Capitalize for DB match
        query.role = roleStr.charAt(0).toUpperCase() + roleStr.slice(1);
    }

    if (req.query.search) {
        query.$or = [
            { fullName: { $regex: req.query.search, $options: 'i' } },
            { universityId: { $regex: req.query.search, $options: 'i' } }
        ];
    }

    const users = await User.find(query)
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

    const total = await User.countDocuments(query);

    res.json({
        users: formattedUsers,
        total,
        page,
        pages: Math.ceil(total / limit),
    });
});

module.exports = {
    getSystemStats,
    getUsers,
};
