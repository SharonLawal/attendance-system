const Course = require('../models/Course');
const User = require('../models/User');
const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const mongoose = require('mongoose'); // Added
const asyncHandler = require('express-async-handler');
const { z } = require('zod');

// Validation Schema
const courseSchema = z.object({
    courseCode: z.string().toUpperCase().regex(/^[A-Z]{4}[0-9]{3}(-[A-Z0-9]+)?$/, 'Course code must follow format: COMP101 or COMP101-A'),
    courseName: z.string().min(3).max(100),
    department: z.string().optional(),
    credits: z.number().min(1).max(6).optional(),
    capacity: z.number().min(1).optional()
});

// @desc    Get dashboard analytics for lecturer
// @route   GET /api/lecturer/dashboard
// @access  Private/Lecturer
const getDashboard = asyncHandler(async (req, res) => {
    const lecturerId = req.user._id;

    const [coursesCount, activeSession, records] = await Promise.all([
        Course.countDocuments({ lecturerId }),
        AttendanceSession.findOne({ 
            lecturerId, 
            endTime: { $gt: new Date() } 
        }).populate('courseId', 'courseCode courseName'),
        
        // Complex aggregation to compute overall average attendance rate
        AttendanceSession.aggregate([
            { $match: { lecturerId: new mongoose.Types.ObjectId(lecturerId) } },
            {
                $lookup: {
                    from: 'attendancerecords',
                    localField: '_id',
                    foreignField: 'sessionId',
                    as: 'records'
                }
            },
            {
                $project: {
                    presentCount: {
                        $size: {
                            $filter: {
                                input: '$records',
                                as: 'record',
                                cond: { $eq: ['$$record.status', 'Present'] }
                            }
                        }
                    },
                    totalCount: { $size: '$records' }
                }
            }
        ])
    ]);

    // Simple calculation for average rate
    let totalExpected = 0;
    let totalPresent = 0;
    records.forEach(session => {
        // Mock expected count as 50 per class if strictly unknown, else use total count + simple math
        // A better approach is fetching actual student counts via Enrollment model. 
        totalPresent += session.presentCount;
        totalExpected += session.totalCount > 0 ? session.totalCount : 50; 
    });
    
    const averageAttendance = totalExpected === 0 ? 100 : Math.round((totalPresent / totalExpected) * 100);

    // Get a rough total students count (mocked to unique students attended)
    const uniqueStudents = await AttendanceRecord.distinct('studentId');

    res.json({
        total_courses: coursesCount,
        active_sessions: activeSession ? 1 : 0,
        total_students: uniqueStudents.length, // Simplified metric
        average_attendance: averageAttendance,
        active_session: activeSession ? {
            id: activeSession._id,
            course_code: activeSession.courseId?.courseCode,
            course_name: activeSession.courseId?.courseName,
            otc_code: activeSession.otcCode,
            start_time: activeSession.startTime,
            end_time: activeSession.endTime,
        } : null,
        upcoming_sessions: [] // Skipping upcoming sessions for MVP scope
    });
});

// @desc    Get live polling stats for an active session
// @route   GET /api/sessions/:id/live-stats
// @access  Private/Lecturer (Note: Moved route to course/session router or added inline)
const getLiveSessionStats = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const lecturerId = req.user._id;

    const session = await AttendanceSession.findOne({
        _id: id,
        lecturerId // Secure: Ensure this session belongs to the requesting lecturer
    }).populate('courseId', 'courseCode courseName');

    if (!session) {
        res.status(404);
        throw new Error('Session not found or unauthorized');
    }

    const checkedInCount = await AttendanceRecord.countDocuments({
        sessionId: id,
        status: 'Present'
    });

    // Replace with Enrollment real count eventually
    const expectedCount = 50; 

    const now = new Date();
    const timeRemaining = Math.max(0, Math.floor((session.endTime.getTime() - now.getTime()) / 1000));

    res.json({
        session_id: session._id,
        course_code: session.courseId?.courseCode,
        course_name: session.courseId?.courseName,
        otc_code: session.otcCode,
        checked_in_count: checkedInCount,
        expected_count: expectedCount,
        attendance_rate: Math.round((checkedInCount / expectedCount) * 100),
        time_remaining: timeRemaining,
        start_time: session.startTime,
        end_time: session.endTime
    });
});

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Lecturer only)
const createCourse = asyncHandler(async (req, res) => {
    // 1. Verify Role
    if (req.user.role !== 'Lecturer') {
        res.status(403);
        throw new Error('Only Lecturers can create courses');
    }

    // 2. Validate input
    const validatedData = courseSchema.parse(req.body);
    const { courseCode, courseName, department, credits, capacity } = validatedData;

    // 3. Rate Limit / Integrity check (Max 50 courses per lecturer)
    const courseCount = await Course.countDocuments({ lecturerId: req.user._id });
    if (courseCount >= 50) {
        res.status(400);
        throw new Error('Maximum course limit (50) reached. Please archive old courses first.');
    }

    // 4. Duplicate Check (Global system uniqueness)
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
        res.status(400);
        throw new Error(`Course code '${courseCode}' is already in use by another class/section.`);
    }

    // 5. Create
    const course = await Course.create({
        courseCode,
        courseName,
        department,
        credits,
        capacity,
        lecturerId: req.user._id,
        status: 'active'
    });

    res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: course
    });
});

// @desc    Get all courses for the logged in Lecturer
// @route   GET /api/courses/my-courses
// @access  Private (Lecturer only)
const getMyCourses = asyncHandler(async (req, res) => {
    if (req.user.role !== 'Lecturer') {
        res.status(403);
        throw new Error('Only Lecturers can access this route');
    }

    const courses = await Course.find({ lecturerId: req.user._id })
        .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});

// @desc    Update course details
// @route   PUT /api/courses/:id
// @access  Private (Lecturer only)
const updateCourse = asyncHandler(async (req, res) => {
    if (req.user.role !== 'Lecturer') {
        res.status(403);
        throw new Error('Only Lecturers can update courses');
    }

    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    // CRITICAL: IDOR Protection
    if (course.lecturerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this course');
    }

    // Validate partial input
    const validatedData = courseSchema.partial().parse(req.body);

    // Duplicate Check (if courseCode is being changed)
    if (validatedData.courseCode && validatedData.courseCode !== course.courseCode) {
        const existingCourse = await Course.findOne({ courseCode: validatedData.courseCode });
        if (existingCourse) {
            res.status(400);
            throw new Error(`Course code '${validatedData.courseCode}' is already in use.`);
        }
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, validatedData, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: updatedCourse
    });
});

// @desc    Import students to course roster
// @route   POST /api/courses/:id/roster
// @access  Private (Lecturer only)
const importStudents = asyncHandler(async (req, res) => {
    const courseId = req.params.id;
    const { universityIds } = req.body; // Array of matric numbers

    if (!Array.isArray(universityIds)) {
        res.status(400);
        throw new Error('universityIds must be an array');
    }

    const course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.lecturerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to modify this course');
    }

    // Find all users matching these IDs
    const users = await User.find({ universityId: { $in: universityIds } });
    const userIds = users.map(u => u._id);
    const foundUniversityIds = users.map(u => u.universityId);

    // Identify ghost students (Requested Matrix IDs not found in the DB)
    const ghostStudents = universityIds.filter(id => !foundUniversityIds.includes(id));

    // Update course using $addToSet strategically
    if (userIds.length > 0) {
        await Course.findByIdAndUpdate(courseId, {
            $addToSet: { enrolledStudents: { $each: userIds } }
        });

        const updatedCourse = await Course.findById(courseId);
        updatedCourse.enrolledCount = updatedCourse.enrolledStudents.length;
        await updatedCourse.save();
    }

    res.status(200).json({
        success: true,
        message: `${userIds.length} students added to roster.`,
        addedCount: userIds.length,
        ghostStudents
    });
});

// @desc    Get pending check-ins for a course
// @route   GET /api/courses/:id/pending
// @access  Private (Lecturer only)
const getPendingCheckIns = asyncHandler(async (req, res) => {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.lecturerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized');
    }

    // Pluck all session thresholds
    const sessions = await AttendanceSession.find({ courseId }).select('_id');
    const sessionIds = sessions.map(s => s._id);

    // Filter pending records
    const pendingRecords = await AttendanceRecord.find({
        sessionId: { $in: sessionIds },
        status: 'Pending'
    }).populate('studentId', 'fullName universityId email')
        .populate('sessionId', 'createdAt');

    res.status(200).json({
        success: true,
        data: pendingRecords
    });
});

// @desc    Resolve a pending check-in (Approve/Reject)
// @route   POST /api/courses/:id/resolve-pending
// @access  Private (Lecturer only)
const resolvePendingCheckIn = asyncHandler(async (req, res) => {
    const courseId = req.params.id;
    const { recordId, action } = req.body;

    if (!['Approve', 'Reject'].includes(action)) {
        res.status(400);
        throw new Error('Invalid action directive');
    }

    const course = await Course.findById(courseId);
    if (!course || course.lecturerId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to modify this course');
    }

    const record = await AttendanceRecord.findById(recordId);
    if (!record) {
        res.status(404);
        throw new Error('Record not found');
    }

    if (record.status !== 'Pending') {
        res.status(400);
        throw new Error('Record is not pending resolution');
    }

    if (action === 'Approve') {
        record.status = 'Present';
        await record.save();

        await Course.findByIdAndUpdate(courseId, {
            $addToSet: { enrolledStudents: record.studentId }
        });

        const updatedCourse = await Course.findById(courseId);
        updatedCourse.enrolledCount = updatedCourse.enrolledStudents.length;
        await updatedCourse.save();

    } else if (action === 'Reject') {
        record.status = 'Absent';
        await record.save();
    }

    res.status(200).json({
        success: true,
        message: `Attendance record ${action.toLowerCase()}d successfully.`
    });
});

module.exports = {
    getDashboard,
    getLiveSessionStats,
    createCourse,
    getMyCourses,
    updateCourse,
    importStudents,
    getPendingCheckIns,
    resolvePendingCheckIn
};
