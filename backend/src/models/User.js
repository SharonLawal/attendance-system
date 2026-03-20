const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@(student\.)?babcock\.edu\.ng$/, 'Email must end with @babcock.edu.ng or @student.babcock.edu.ng'],
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['Student', 'Lecturer', 'Admin'], required: true },
    universityId: { type: String, required: true, unique: true, trim: true },
    department: { type: String },
    accountStatus: { type: String, enum: ['Active', 'Suspended', 'Inactive'], default: 'Active' },

    // Email Verification
    isVerified: { type: Boolean, default: false },
    verificationOTP: String,
    verificationOTPExpire: Date,
    verificationAttempts: { type: Number, default: 0 },

    // Password Reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Google OAuth tokens — stored on Lecturers who connect Google Classroom
    googleTokens: {
        access_token: String,
        refresh_token: String,
        expiry_date: Number,
        email: String,  // The gmail address shown in the UI
    },

    // Personal Gmail address — students set this once in their profile.
    // The Google Classroom sync matches against this field, solving the
    // mismatch between @gmail.com and @babcock.edu.ng addresses.
    linkedGoogleEmail: {
        type: String,
        trim: true,
        lowercase: true,
        default: null,
        sparse: true,  // Allow null; only index when present
    },

}, { timestamps: true });

userSchema.methods.generateVerificationOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationOTP = crypto.createHash('sha256').update(otp).digest('hex');
    this.verificationOTPExpire = Date.now() + 15 * 60 * 1000;
    return otp;
};

userSchema.methods.generateResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

module.exports = mongoose.model('User', userSchema);