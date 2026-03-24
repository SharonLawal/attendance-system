/**
 * @fileoverview Contextual execution boundary for backend/src/controllers/googleLmsController.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const { google } = require('googleapis');
const asyncHandler = require('express-async-handler');
const Papa = require('papaparse');
const crypto = require('crypto');
const User = require('../models/User');
const Course = require('../models/Course');
const AttendanceRecord = require('../models/AttendanceRecord');
const AttendanceSession = require('../models/AttendanceSession');
const SyncHistory = require('../models/SyncHistory');

const getOAuthClient = (tokens = null) => {
    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
    if (tokens) client.setCredentials(tokens);
    return client;
};

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
        state: req.user._id.toString(),
        prompt: 'consent',
    });
    res.json({ url });
});

const handleCallback = asyncHandler(async (req, res) => {
    const { code, state: userId, error } = req.query;
    if (error || !code || !userId) {
        return res.redirect(`${process.env.FRONTEND_URL}/lecturer/integrations?error=oauth_failed`);
    }
    try {
        const oauth2Client = getOAuthClient();
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
        const userInfo = await oauth2.userinfo.get();
        const user = await User.findById(userId);
        if (user) {
            user.googleTokens = {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expiry_date: tokens.expiry_date,
                email: userInfo.data.email,
            };
            await user.save();
        }
        res.redirect(`${process.env.FRONTEND_URL}/lecturer/integrations?connected=google`);
    } catch (err) {
        console.error('Google OAuth callback error:', err);
        res.redirect(`${process.env.FRONTEND_URL}/lecturer/integrations?error=token_exchange_failed`);
    }
});

const getConnectionStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('googleTokens');
    res.json({
        connected: !!(user.googleTokens?.access_token),
        email: user.googleTokens?.email || null,
    });
});

const disconnectGoogle = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { googleTokens: 1 } });
    res.json({ success: true, message: 'Google account disconnected' });
});

const getGoogleCourses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('googleTokens');
    const decryptedTokens = user.getDecryptedGoogleTokens();
    if (!decryptedTokens?.access_token) {
        res.status(400); throw new Error('Google account not connected');
    }
    const oauth2Client = getOAuthClient(decryptedTokens);
    const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
    const response = await classroom.courses.list({ teacherId: 'me', courseStates: ['ACTIVE'] });
    const courses = (response.data.courses || []).map((c) => ({
        id: c.id,
        name: c.name,
        section: c.section || '',
        enrollmentCode: c.enrollmentCode || '',
    }));
    res.json({ courses });
});

const getGoogleAssignments = asyncHandler(async (req, res) => {
    const { googleCourseId } = req.query;
    if (!googleCourseId) { res.status(400); throw new Error('googleCourseId is required'); }
    
    const user = await User.findById(req.user._id).select('googleTokens');
    const decryptedTokens = user.getDecryptedGoogleTokens();
    if (!decryptedTokens?.access_token) {
        res.status(400); throw new Error('Google account not connected');
    }
    const oauth2Client = getOAuthClient(decryptedTokens);
    const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
    
    const cwResponse = await classroom.courses.courseWork.list({
        courseId: googleCourseId,
        orderBy: 'updateTime desc',
        pageSize: 10,
    });
    
    const assignments = (cwResponse.data.courseWork || []).map((a) => ({
        id: a.id,
        title: a.title,
        updateTime: a.updateTime,
    }));
    
    res.json({ assignments });
});

const findUsersByGoogleEmails = async (googleEmails) => {
    const lower = googleEmails.map((e) => e.trim().toLowerCase());
    return User.find({
        role: 'Student',
        $or: [
            { linkedGoogleEmail: { $in: lower } },
            { email: { $in: lower } },
        ],
    }).select('_id email linkedGoogleEmail');
};

const syncRoster = asyncHandler(async (req, res) => {
    const { googleCourseId, veriPointCourseId } = req.body;
    if (!googleCourseId || !veriPointCourseId) {
        res.status(400); throw new Error('googleCourseId and veriPointCourseId are required');
    }

    const course = await Course.findOne({ _id: veriPointCourseId, lecturerId: req.user._id });
    if (!course) { res.status(404); throw new Error('VeriPoint course not found or unauthorized'); }

    const user = await User.findById(req.user._id).select('googleTokens');
    const decryptedTokens = user.getDecryptedGoogleTokens();
    if (!decryptedTokens?.access_token) {
        res.status(400); throw new Error('Google account not connected');
    }

    const oauth2Client = getOAuthClient(decryptedTokens);
    const classroom = google.classroom({ version: 'v1', auth: oauth2Client });

    const response = await classroom.courses.students.list({ courseId: googleCourseId });
    const students = response.data.students || [];
    const googleEmails = students.map((s) => s.profile?.emailAddress?.trim().toLowerCase()).filter(Boolean);

    const matchedUsers = await findUsersByGoogleEmails(googleEmails);
    const matchedIds = matchedUsers.map((u) => u._id);

    if (matchedIds.length > 0) {
        await Course.findByIdAndUpdate(veriPointCourseId, {
            $addToSet: { enrolledStudents: { $each: matchedIds } },
        });
        const updated = await Course.findById(veriPointCourseId);
        updated.enrolledCount = updated.enrolledStudents.length;
        await updated.save();
    }

    const isFullSuccess = students.length > 0 && matchedIds.length === students.length;
    await SyncHistory.create({
        lecturerId: req.user._id,
        courseId: veriPointCourseId,
        platform: 'Google Classroom',
        studentsSynced: matchedIds.length,
        status: isFullSuccess ? 'Success' : (matchedIds.length > 0 ? 'Partial Success' : 'Failed'),
    });

    res.json({
        success: true,
        message: `${matchedIds.length} of ${students.length} students imported`,
        syncedCount: matchedIds.length,
        totalInGoogle: students.length,
        unmatched: students.length - matchedIds.length,
    });
});

const syncLatestAttendance = asyncHandler(async (req, res) => {
    const { googleCourseId, veriPointCourseId, assignmentId } = req.body;

    if (!googleCourseId || !veriPointCourseId || !assignmentId) {
        res.status(400); throw new Error('googleCourseId, veriPointCourseId, and assignmentId are required');
    }

    const course = await Course.findOne({ _id: veriPointCourseId, lecturerId: req.user._id });
    if (!course) { res.status(404); throw new Error('VeriPoint course not found or unauthorized'); }

    const user = await User.findById(req.user._id).select('googleTokens');
    const decryptedTokens = user.getDecryptedGoogleTokens();
    if (!decryptedTokens?.access_token) {
        res.status(400); throw new Error('Google account not connected');
    }

    const oauth2Client = getOAuthClient(decryptedTokens);
    const classroom = google.classroom({ version: 'v1', auth: oauth2Client });

    const cwResponse = await classroom.courses.courseWork.get({
        courseId: googleCourseId,
        id: assignmentId,
    });

    const targetAssignment = cwResponse.data;
    if (!targetAssignment) {
        res.status(404);
        throw new Error('Assignment not found in Google Classroom.');
    }

    const submissionsResponse = await classroom.courses.courseWork.studentSubmissions.list({
        courseId: googleCourseId,
        courseWorkId: targetAssignment.id,
        states: ['TURNED_IN', 'RETURNED'],
    });

    const submissions = submissionsResponse.data.studentSubmissions || [];

    if (submissions.length === 0) {
        res.json({
            success: true,
            message: 'No submissions found for the selected assignment yet.',
            syncedCount: 0,
            totalSubmissions: 0,
            assignmentTitle: targetAssignment.title,
        });
        return;
    }

    const submitterEmails = [];
    for (const submission of submissions) {
        try {
            const profile = await classroom.userProfiles.get({ userId: submission.userId });
            if (profile.data.emailAddress) {
                submitterEmails.push(profile.data.emailAddress.toLowerCase());
            }
        } catch {

        }
    }

    const matchedUsers = await findUsersByGoogleEmails(submitterEmails);

    const unmatchedEmails = [];
    for (const email of submitterEmails) {
        if (!matchedUsers.some(u => u.email === email || u.linkedGoogleEmail === email)) {
            unmatchedEmails.push(email);
        }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let session = await AttendanceSession.findOne({
        courseId: veriPointCourseId,
        lecturerId: req.user._id,
        isOnline: true,
        createdAt: { $gte: today }
    });

    if (!session) {
        session = await AttendanceSession.create({
            courseId: veriPointCourseId,
            lecturerId: req.user._id,
            otcCode: '000000',
            startTime: new Date(),
            endTime: new Date(),
            isOnline: true
        });
    }

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

    const isFullSuccess = submissions.length > 0 && inserted === submissions.length;
    await SyncHistory.create({
        lecturerId: req.user._id,
        courseId: veriPointCourseId,
        platform: 'Google Classroom',
        studentsSynced: inserted,
        status: isFullSuccess ? 'Success' : (inserted > 0 ? 'Partial Success' : 'Failed'),
    });

    res.json({
        success: true,
        message: `${inserted} students marked Present from "${targetAssignment.title}"`,
        syncedCount: inserted,
        totalSubmissions: submissions.length,
        unmatched: submissions.length - inserted,
        unmatchedEmails,
        assignmentTitle: targetAssignment.title,
    });
});

const importMeetCsv = asyncHandler(async (req, res) => {
    const { veriPointCourseId } = req.body;

    if (!veriPointCourseId) {
        res.status(400); throw new Error('veriPointCourseId is required');
    }
    if (!req.file) {
        res.status(400); throw new Error('No CSV file uploaded');
    }

    const course = await Course.findOne({ _id: veriPointCourseId, lecturerId: req.user._id });
    if (!course) { res.status(404); throw new Error('VeriPoint course not found or unauthorized'); }

    const csvText = req.file.buffer.toString('utf8');
    const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.toLowerCase().replace(/[^a-z]/g, '')
    });

    if (parsed.errors.length > 0 && parsed.data.length === 0) {
        res.status(400); throw new Error('Failed to parse CSV file: ' + parsed.errors[0].message);
    }

    if (parsed.data.length === 0) {
        res.status(400); throw new Error('CSV file appears to be empty or has no data rows');
    }

    const fileHeaders = Object.keys(parsed.data[0] || {});
    const emailColKey = fileHeaders.find(h => h.includes('email'));

    if (!emailColKey) {
        res.status(400); throw new Error('CSV must contain an "Email" column. Ensure you are uploading a valid CSV.');
    }

    const meetEmails = [];
    for (const row of parsed.data) {
        const email = row[emailColKey]?.toLowerCase().trim();
        if (email && email.includes('@') && !meetEmails.includes(email)) {
            meetEmails.push(email);
        }
    }

    if (meetEmails.length === 0) {
        res.status(400); throw new Error('No valid email addresses found in the CSV file');
    }

    const matchedUsers = await findUsersByGoogleEmails(meetEmails);

    const unmatchedEmails = [];
    for (const email of meetEmails) {
        if (!matchedUsers.some(u => u.email === email || u.linkedGoogleEmail === email)) {
            unmatchedEmails.push(email);
        }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let session = await AttendanceSession.findOne({
        courseId: veriPointCourseId,
        lecturerId: req.user._id,
        isOnline: true,
        createdAt: { $gte: today }
    });

    if (!session) {
        session = await AttendanceSession.create({
            courseId: veriPointCourseId,
            lecturerId: req.user._id,
            otcCode: '000000',
            startTime: new Date(),
            endTime: new Date(),
            isOnline: true
        });
    }

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

    const isFullSuccess = meetEmails.length > 0 && inserted === meetEmails.length;
    await SyncHistory.create({
        lecturerId: req.user._id,
        courseId: veriPointCourseId,
        platform: 'Google Meet',
        studentsSynced: inserted,
        status: isFullSuccess ? 'Success' : (inserted > 0 ? 'Partial Success' : 'Failed'),
    });

    res.json({
        success: true,
        message: `${inserted} students marked Present from Meet attendance CSV`,
        syncedCount: inserted,
        totalInCsv: meetEmails.length,
        unmatched: meetEmails.length - inserted,
        unmatchedEmails,
    });
});

module.exports = {
    getAuthUrl,
    handleCallback,
    getConnectionStatus,
    disconnectGoogle,
    getGoogleCourses,
    getGoogleAssignments,
    syncRoster,
    syncLatestAttendance,
    importMeetCsv,
};