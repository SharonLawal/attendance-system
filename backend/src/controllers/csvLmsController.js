const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Course = require('../models/Course');
const AttendanceRecord = require('../models/AttendanceRecord');
const AttendanceSession = require('../models/AttendanceSession');
const SyncHistory = require('../models/SyncHistory');

// ─── CSV Parser ──────────────────────────────────────────────────────────────
// Handles both Google Meet and Microsoft Teams export formats without
// any external library dependency.

const parseCSV = (text) => {
    const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

    if (lines.length < 2) return [];

    // Detect delimiter — Teams uses tab, Meet uses comma
    const header = lines[0];
    const delimiter = header.includes('\t') ? '\t' : ',';

    const headers = header.split(delimiter).map((h) => h.replace(/"/g, '').trim().toLowerCase());

    return lines.slice(1).map((line) => {
        const values = line.split(delimiter).map((v) => v.replace(/"/g, '').trim());
        const row = {};
        headers.forEach((h, i) => {
            row[h] = values[i] || '';
        });
        return row;
    });
};

// Extract email from a parsed CSV row.
// Google Meet export columns:  "name", "email address"
// Teams export columns:        "full name", "email", "join time", "leave time"
const extractEmail = (row) => {
    return (
        row['email address'] ||
        row['email'] ||
        row['e-mail'] ||
        row['emailaddress'] ||
        row['participant email'] ||
        ''
    ).toLowerCase().trim();
};

const extractName = (row) => {
    return (
        row['name'] ||
        row['full name'] ||
        row['participant'] ||
        row['display name'] ||
        ''
    ).trim();
};

// ─── Upload CSV Handler ──────────────────────────────────────────────────────

// @desc    Parse a Google Meet or Teams attendance CSV and mark students Present
// @route   POST /api/lms/csv/sync-attendance
// @access  Private/Lecturer
const syncFromCSV = asyncHandler(async (req, res) => {
    const { veriPointCourseId, platform } = req.body;

    if (!veriPointCourseId) {
        res.status(400);
        throw new Error('veriPointCourseId is required');
    }

    if (!req.file) {
        res.status(400);
        throw new Error('No CSV file uploaded');
    }

    // Verify course ownership
    const course = await Course.findOne({
        _id: veriPointCourseId,
        lecturerId: req.user._id,
    });
    if (!course) {
        res.status(404);
        throw new Error('Course not found or unauthorized');
    }

    // Parse the uploaded CSV
    const csvText = req.file.buffer.toString('utf-8');
    const rows = parseCSV(csvText);

    if (rows.length === 0) {
        res.status(400);
        throw new Error('CSV file is empty or could not be parsed. Make sure it is a valid Google Meet or Teams attendance export.');
    }

    // Extract emails from CSV rows
    const csvEmails = rows
        .map((row) => extractEmail(row))
        .filter((email) => email.includes('@'));

    if (csvEmails.length === 0) {
        res.status(400);
        throw new Error('No email addresses found in the CSV. Make sure you are uploading the correct attendance export file.');
    }

    // Match against VeriPoint users via linkedGoogleEmail or primary email
    const matchedUsers = await User.find({
        role: 'Student',
        $or: [
            { linkedGoogleEmail: { $in: csvEmails } },
            { email: { $in: csvEmails } },
        ],
    }).select('_id email linkedGoogleEmail');

    // Create a background LMS session to attach attendance records to
    const session = await AttendanceSession.create({
        courseId: veriPointCourseId,
        lecturerId: req.user._id,
        otcCode: '000000',
        startTime: new Date(),
        endTime: new Date(),
        locationPolygon: {
            type: 'Polygon',
            coordinates: [[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]],
        },
    });

    // Bulk insert, skip duplicates
    const records = matchedUsers.map((u) => ({
        sessionId: session._id,
        studentId: u._id,
        status: 'Present',
        source: 'LMS_Sync',
    }));

    let inserted = 0;
    if (records.length > 0) {
        const result = await AttendanceRecord.insertMany(records, { ordered: false })
            .catch((err) => err.insertedDocs || []);
        inserted = Array.isArray(result) ? result.length : records.length;
    }

    const platformName = platform === 'teams' ? 'Microsoft Teams' : 'Google Classroom';

    await SyncHistory.create({
        lecturerId: req.user._id,
        courseId: veriPointCourseId,
        platform: platformName,
        studentsSynced: inserted,
        status: inserted > 0 ? 'Success' : 'Partial Success',
    });

    res.json({
        success: true,
        message: `${inserted} students marked Present from ${platformName} attendance CSV`,
        syncedCount: inserted,
        totalInCSV: csvEmails.length,
        unmatched: csvEmails.length - matchedUsers.length,
        // Return unmatched emails so the lecturer can see who wasn't found
        unmatchedEmails: csvEmails.filter(
            (email) =>
                !matchedUsers.some(
                    (u) => u.linkedGoogleEmail === email || u.email === email
                )
        ),
    });
});

module.exports = { syncFromCSV };