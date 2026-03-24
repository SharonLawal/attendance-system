/**
 * @fileoverview Contextual execution boundary for backend/src/models/AttendanceRecord.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AttendanceSession',
        required: true,
        index: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Pending'],
        default: 'Pending',
        required: true,
        index: true
    },
    source: {
        type: String,
        enum: ['Manual_GPS', 'LMS_Sync'],
        required: true,
    },
    checkedInAt: {
        type: Date,
        default: Date.now,
    },
    coordinates: {
        latitude: Number,
        longitude: Number,
        accuracy: Number
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rejectedAt: Date,
    rejectionReason: String,
    deviceInfo: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

attendanceRecordSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);
