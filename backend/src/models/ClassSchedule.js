/**
 * @fileoverview Contextual execution boundary for backend/src/models/ClassSchedule.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const mongoose = require('mongoose');

const classScheduleSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
    },

    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Lecture', 'Lab', 'Seminar'],
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('ClassSchedule', classScheduleSchema);
