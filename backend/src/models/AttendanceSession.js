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
        match: [/^\d{4}$/, 'OTC Code must be exactly 4 digits'],
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
    // GeoJSON Polygon for classroom boundaries
    locationPolygon: {
        type: {
            type: String,
            enum: ['Polygon'],
            required: true,
        },
        coordinates: {
            type: [[[Number]]], // Array of arrays of arrays of numbers [lng, lat]
            required: true,
        }
    },
}, { timestamps: true });

// Create a 2dsphere index on the locationPolygon field for geospatial queries
attendanceSessionSchema.index({ locationPolygon: '2dsphere' });

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
