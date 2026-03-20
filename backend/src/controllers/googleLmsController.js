const { google } = require('googleapis');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Course = require('../models/Course');
const AttendanceRecord = require('../models/AttendanceRecord');
const AttendanceSession = require('../models/AttendanceSession');
const SyncHistory = require('../models/SyncHistory');

// ─── OAuth Client Factory ────────────────────────────────────────────────────

const getOAuthClient = (tokens = null) => {
    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
    if (tokens) {
        client.setCredentials(tokens);
        // Auto-save refreshed tokens back to DB
        client.on('tokens', async (newTokens) => {
            if (newTokens.refresh_token) {
                // Only update if we get a new refresh token
            }
        });
    }
    return client;
};

// ─── Get Auth URL ────────────────────────────────────────────────────────────

// @desc    Generate Google OAuth URL
// @route   GET /api/lms/google/auth
// @access  Private/Lecturer
const getAuthUrl = asyncHandler(async (req, res) => {
    const oauth2Client = getOAuthClient();

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/classroom.courses.readonly',
            'https://www.googleapis.com/auth/classroom.rosters.readonly',
            'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
            'https://www.googleapis.com/auth/userinfo.email',
        ],
        state: req.user._id.toString(), // Pass lecturer ID so callback knows who to save tokens for
        prompt: 'consent',              // Force consent screen so we always get refresh_token
    });

    res.json({ url });
});

// ─── OAuth Callback ──────────────────────────────────────────────────────────

// @desc    Handle Google OAuth callback (redirected from Google)
// @route   GET /api/lms/google/callback
// @access  Public
const handleCallback = asyncHandler(async (req, res) => {
    const { code, state: userId, error } = req.query;

    if (error || !code || !userId) {
        return res.redirect(
            `${process.env.FRONTEND_URL}/lecturer/integrations?error=oauth_failed`
        );
    }

    try {
        const oauth2Client = getOAuthClient();
        const { tokens } = await oauth2Client.getToken(code);

        // Fetch the connected Google account email for display
        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const userInfo = await oauth2.userinfo.get();

        await User.findByIdAndUpdate(userId, {
            googleTokens: {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expiry_date: tokens.expiry_date,
                email: userInfo.data.email,
            },
        });

        res.redirect(
            `${process.env.FRONTEND_URL}/lecturer/integrations?connected=google`
        );
    } catch (err) {
        console.error('Google OAuth callback error:', err);
        res.redirect(
            `${process.env.FRONTEND_URL}/lecturer/integrations?error=token_exchange_failed`
        );
    }
});

// ─── Connection Status ───────────────────────────────────────────────────────

// @desc    Check if Google is connected for the current user
// @route   GET /api/lms/google/status
// @access  Private/Lecturer
const getConnectionStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('googleTokens');
    res.json({
        connected: !!(user.googleTokens?.access_token),
        email: user.googleTokens?.email || null,
    });
});

// ─── Disconnect ──────────────────────────────────────────────────────────────

// @desc    Disconnect Google account
// @route   DELETE /api/lms/google/disconnect
// @access  Private/Lecturer
const disconnectGoogle = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: { googleTokens: 1 },
    });
    res.json({ success: true, message: 'Google account disconnected' });
});

// ─── Get Google Classroom Courses ────────────────────────────────────────────

// @desc    List all active Google Classroom courses the lecturer teaches
// @route   GET /api/lms/google/courses
// @access  Private/Lecturer
const getGoogleCourses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('googleTokens');

    if (!user.googleTokens?.access_token) {
        res.status(400);
        throw new Error('Google account not connected');
    }

    const oauth2Client = getOAuthClient(user.googleTokens);
    const classroom = google.classroom({ version: 'v1', auth: oauth2Client });

    const response = await classroom.courses.list({
        teacherId: 'me',
        courseStates: ['ACTIVE'],
    });

    const courses = (response.data.courses || []).map((c) => ({
        id: c.id,
        name: c.name,
        section: c.section || '',
        studentCount: c.courseState,
        enrollmentCode: c.enrollmentCode || '',
    }));

    res.json({ courses });
});

// ─── Get Coursework (for attendance pull) ────────────────────────────────────

// @desc    List coursework items for a Google Classroom course
// @route   GET /api/lms/google/courses/:courseId/coursework
// @access  Private/Lecturer
const getCourseWork = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const user = await User.findById(req.user._id).select('googleTokens');

    if (!user.googleTokens?.access_token) {
        res.status(400);
        throw new Error('Google account not connected');
    }

    const oauth2Client = getOAuthClient(user.googleTokens);
    const classroom = google.classroom({ version: 'v1', auth: oauth2Client });

    const response = await classroom.courses.courseWork.list({
        courseId,
        orderBy: 'updateTime desc',
        pageSize: 20,
    });

    const courseWork = (response.data.courseWork || []).map((cw) => ({
        id: cw.id,
        title: cw.title,
        type: cw.workType,
        creationTime: cw.creationTime,
    }));

    res.json({ courseWork });
});

// ─── Sync Roster ─────────────────────────────────────────────────────────────

// @desc    Import students from a Google Classroom course into a VeriPoint course
// @route   POST /api/lms/google/sync-roster
// @access  Private/Lecturer
const syncRoster = asyncHandler(async (req, res) => {
    const { googleCourseId, veriPointCourseId } = req.body;

    if (!googleCourseId || !veriPointCourseId) {
        res.status(400);
        throw new Error('googleCourseId and veriPointCourseId are required');
    }

    // Verify course ownership
    const course = await Course.findOne({
        _id: veriPointCourseId,
        lecturerId: req.user._id,
    });
    if (!course) {
        res.status(404);
        throw new Error('VeriPoint course not found or unauthorized');
    }

    const user = await User.findById(req.user._id).select('googleTokens');
    if (!user.googleTokens?.access_token) {
        res.status(400);
        throw new Error('Google account not connected');
    }

    const oauth2Client = getOAuthClient(user.googleTokens);
    const classroom = google.classroom({ version: 'v1', auth: oauth2Client });

    // Pull all students from Google Classroom
    const response = await classroom.courses.students.list({
        courseId: googleCourseId,
    });

    const students = response.data.students || [];
    const googleEmails = students
        .map((s) => s.profile?.emailAddress?.toLowerCase())
        .filter(Boolean);

    // Match by email against VeriPoint users
    const matchedUsers = await User.find({
        email: { $in: googleEmails },
        role: 'Student',
    }).select('_id email');

    const matchedIds = matchedUsers.map((u) => u._id);

    if (matchedIds.length > 0) {
        await Course.findByIdAndUpdate(veriPointCourseId, {
            $addToSet: { enrolledStudents: { $each: matchedIds } },
        });
        const updated = await Course.findById(veriPointCourseId);
        updated.enrolledCount = updated.enrolledStudents.length;
        await updated.save();
    }

    await SyncHistory.create({
        lecturerId: req.user._id,
        courseId: veriPointCourseId,
        platform: 'Google Classroom',
        studentsSynced: matchedIds.length,
        status: matchedIds.length > 0 ? 'Success' : 'Partial Success',
    });

    res.json({
        success: true,
        message: `${matchedIds.length} of ${students.length} students imported`,
        syncedCount: matchedIds.length,
        totalInGoogle: students.length,
        unmatched: students.length - matchedIds.length,
    });
});

// ─── Sync Attendance (from coursework submissions) ───────────────────────────

// @desc    Mark students as present based on who submitted a Google Classroom assignment
// @route   POST /api/lms/google/sync-attendance
// @access  Private/Lecturer
const syncAttendance = asyncHandler(async (req, res) => {
    const { googleCourseId, veriPointCourseId, courseWorkId } = req.body;

    if (!googleCourseId || !veriPointCourseId || !courseWorkId) {
        res.status(400);
        throw new Error('googleCourseId, veriPointCourseId and courseWorkId are required');
    }

    const course = await Course.findOne({
        _id: veriPointCourseId,
        lecturerId: req.user._id,
    });
    if (!course) {
        res.status(404);
        throw new Error('VeriPoint course not found or unauthorized');
    }

    const user = await User.findById(req.user._id).select('googleTokens');
    if (!user.googleTokens?.access_token) {
        res.status(400);
        throw new Error('Google account not connected');
    }

    const oauth2Client = getOAuthClient(user.googleTokens);
    const classroom = google.classroom({ version: 'v1', auth: oauth2Client });

    // Get all submissions that were turned in
    const submissionsResponse = await classroom.courses.courseWork.studentSubmissions.list({
        courseId: googleCourseId,
        courseWorkId: courseWorkId,
        states: ['TURNED_IN', 'RETURNED'],
    });

    const submissions = submissionsResponse.data.studentSubmissions || [];

    // Get emails for each submitting student
    const submitterEmails = [];
    for (const submission of submissions) {
        try {
            const profile = await classroom.userProfiles.get({
                userId: submission.userId,
            });
            if (profile.data.emailAddress) {
                submitterEmails.push(profile.data.emailAddress.toLowerCase());
            }
        } catch {
            // Profile fetch failed for this student — skip
        }
    }

    // Match to VeriPoint users
    const matchedUsers = await User.find({
        email: { $in: submitterEmails },
        role: 'Student',
    }).select('_id');

    // Create a background attendance session representing this LMS sync
    const session = await AttendanceSession.create({
        courseId: veriPointCourseId,
        lecturerId: req.user._id,
        otcCode: 'GC0000',
        startTime: new Date(),
        endTime: new Date(),
        locationPolygon: {
            type: 'Polygon',
            coordinates: [[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]],
        },
    });

    // Bulk insert attendance records (ignore duplicates)
    const records = matchedUsers.map((u) => ({
        sessionId: session._id,
        studentId: u._id,
        status: 'Present',
        source: 'LMS_Sync',
    }));

    let inserted = 0;
    if (records.length > 0) {
        const result = await AttendanceRecord.insertMany(records, {
            ordered: false,
        }).catch((err) => err.insertedDocs || []);
        inserted = Array.isArray(result) ? result.length : records.length;
    }

    await SyncHistory.create({
        lecturerId: req.user._id,
        courseId: veriPointCourseId,
        platform: 'Google Classroom',
        studentsSynced: inserted,
        status: inserted > 0 ? 'Success' : 'Partial Success',
    });

    res.json({
        success: true,
        message: `${inserted} students marked as Present from Google Classroom submissions`,
        syncedCount: inserted,
        totalSubmissions: submissions.length,
    });
});

module.exports = {
    getAuthUrl,
    handleCallback,
    getConnectionStatus,
    disconnectGoogle,
    getGoogleCourses,
    getCourseWork,
    syncRoster,
    syncAttendance,
};
