const mongoose = require('mongoose');

const syncHistorySchema = new mongoose.Schema({
    platform: {
        type: String,
        enum: ['Google Classroom', 'Microsoft Teams'],
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
        enum: ['Success', 'Failed (API Error)', 'Partial Success'],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('SyncHistory', syncHistorySchema);
