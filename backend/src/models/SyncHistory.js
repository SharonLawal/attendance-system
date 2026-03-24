/**
 * @module models/SyncHistory
 * @description Mongoose schema tracking the historical success and failure telemetry of automated third-party roster synchronizations (e.g., Google Classroom integrations).
 */
const mongoose = require('mongoose');

const syncHistorySchema = new mongoose.Schema({
    platform: {
        type: String,
        enum: ['Google Classroom', 'Google Meet', 'Microsoft Teams', 'CSV Import'],
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    lecturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    studentsSynced: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Success', 'Failed', 'Failed (API Error)', 'Partial Success'],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('SyncHistory', syncHistorySchema);