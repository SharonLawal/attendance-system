/**
 * @module models/Course
 * @description Mongoose schema for academic courses. Links lecturers to their enrolled student rosters and tracks overall capacity constraints.
 */
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
        match: [/^[A-Z]{4}[0-9]{3}(-[A-Z0-9]+)?$/, 'Course code must follow format: COMP101 or COMP101-A']
    },
    courseName: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Course name must be at least 3 characters'],
        maxlength: [100, 'Course name cannot exceed 100 characters']
    },
    lecturerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    semester: {
        type: String,
        trim: true,
    },
    year: {
        type: Number,
    },
    department: {
        type: String,
        trim: true,
    },
    credits: {
        type: Number,
        min: 1,
        max: 6,
    },
    capacity: {
        type: Number,
        default: 50,
        min: 1,
    },
    enrolledCount: {
        type: Number,
        default: 0
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['active', 'archived', 'draft'],
        default: 'active',
    },
    lmsLinked: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

courseSchema.index({ lecturerId: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ lecturerId: 1, status: 1 });

module.exports = mongoose.model('Course', courseSchema);
