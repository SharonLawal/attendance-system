const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const SyncHistory = require('../models/SyncHistory');
const { z } = require('zod');

const syncSchema = z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Course ID'),
    // Array of student IDs that attended via LMS
    attendedStudentIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)),
});

// @desc    Simulate fetching attendance from Google Classroom/Teams and syncing to DB
// @route   POST /api/lms/sync
// @access  Private/Lecturer
const syncAttendance = asyncHandler(async (req, res) => {
    const validatedData = syncSchema.parse(req.body);
    const { courseId, attendedStudentIds } = validatedData;
    const lecturerId = req.user._id;

    // Validate the course
    const course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }
    if (course.lecturerId.toString() !== lecturerId.toString()) {
        res.status(403);
        throw new Error('Not authorized to sync LMS attendance for this course');
    }
    if (!course.lmsLinked) {
        res.status(400);
        throw new Error('This course is not linked to any LMS');
    }

    // Wrap in Mongoose Transaction
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let createdSession = await AttendanceSession.findOne({
            courseId,
            lecturerId,
            isOnline: true,
            createdAt: { $gte: today }
        }).session(dbSession);

        if (!createdSession) {
            const sessionMatches = await AttendanceSession.create([{
                courseId,
                lecturerId,
                otcCode: 'LMS0', // specific to LMS sync to bypass OTC requirement
                startTime: new Date(),
                endTime: new Date(),
                isOnline: true
            }], { session: dbSession });
            createdSession = sessionMatches[0];
        }

        // Prepare records to insert
        const records = attendedStudentIds.map(studentId => ({
            sessionId: createdSession._id,
            studentId,
            status: 'Present',
            source: 'LMS_Sync',
        }));

        // Perform bulk insertion safely handling duplicates within the transaction
        const result = await AttendanceRecord.insertMany(records, { ordered: false, session: dbSession }).catch((err) => {
            // Return partial successes ignoring duplicates if any
            return err.insertedDocs;
        });

        const syncedCount = result ? result.length : 0;

        await SyncHistory.create([{
            lecturerId,
            courseId,
            platform: 'External LMS', // Usually comes from integration metadata
            studentsSynced: syncedCount,
            status: 'Success'
        }], { session: dbSession });

        await dbSession.commitTransaction();
        dbSession.endSession();

        res.status(200).json({
            message: 'LMS Attendance synchronized successfully',
            syncedCount,
        });
    } catch (error) {
        await dbSession.abortTransaction();
        dbSession.endSession();
        throw error;
    }
});

module.exports = { syncAttendance };
