const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@babcock\.edu\.ng$/, 'Email must end with @babcock.edu.ng'],
    },
    passwordHash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Student', 'Lecturer', 'Admin'],
        required: true,
    },
    universityId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    department: {
        type: String,
    },
    accountStatus: {
        type: String,
        enum: ['Active', 'Suspended', 'Inactive'],
        default: 'Active',
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
