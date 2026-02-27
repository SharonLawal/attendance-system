const mongoose = require('mongoose');
const crypto = require('crypto');

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
        match: [/^[a-zA-Z0-9._%+-]+@(student\.)?babcock\.edu\.ng$/, 'Email must end with @babcock.edu.ng or @student.babcock.edu.ng'],
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

    // Email Verification
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationOTP: String, // Hashed
    verificationOTPExpire: Date,
    verificationAttempts: {
        type: Number,
        default: 0,
    },

    // Password Reset
    resetPasswordToken: String, // Hashed
    resetPasswordExpire: Date,

}, { timestamps: true });

// Generate OTP
userSchema.methods.generateVerificationOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before storing
    this.verificationOTP = crypto
        .createHash('sha256')
        .update(otp)
        .digest('hex');

    this.verificationOTPExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    return otp; // Return plain OTP to send via email
};

// Generate password reset token
userSchema.methods.generateResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token before storing
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

    return resetToken; // Return plain token for URL
};

module.exports = mongoose.model('User', userSchema);
