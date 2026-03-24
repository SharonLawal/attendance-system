/**
 * @module models/AttendanceSession
 * @description Mongoose schema representing an active lecture instance. Tracks the one-time code (OTC), valid temporal window, and topology bounds implicitly inherited from the classroom definitions.
 */
const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema({
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
    otcCode: {
        type: String,
        required: true,
        match: [/^\d{6}$/, 'OTC Code must be exactly 6 digits'],
    },
    startTime: {
        type: Date,
        default: Date.now,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    locationPolygon: {
        type: {
            type: String,
            enum: ['Polygon'],
            required: function() { return !this.isOnline; },
        },
        coordinates: {
            type: [[[Number]]],
            required: function() { return !this.isOnline; },
        }
    },
}, { timestamps: true });

attendanceSessionSchema.index({ locationPolygon: '2dsphere' });

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
