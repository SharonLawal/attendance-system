const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    targetUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // Optional, represents the target of the action (e.g., if Admin suspends a user)
    },
    targetCourseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        // Optional, if action is related to a course
    },
    details: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
