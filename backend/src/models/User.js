/**
 * @module models/User
 * @description Mongoose schema for user accounts. Manages authentication credentials, role-based access control, and Google OAuth tokens.
 * Integrates with native crypto for secure storage of sensitive LMS integration payloads.
 */
const mongoose = require('mongoose');
const { encryptText, decryptText } = require('../utils/cryptoUtils');

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
    profilePicture: { type: String, default: null },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['Student', 'Lecturer', 'Admin'], required: true },
    universityId: { type: String, required: true, unique: true, trim: true },
    department: { type: String },
    accountStatus: { type: String, enum: ['Active', 'Suspended', 'Inactive'], default: 'Active' },

    isVerified: { type: Boolean, default: false },
    verificationOTP: String,
    verificationOTPExpire: Date,
    verificationAttempts: { type: Number, default: 0 },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    googleTokens: {
        access_token: String,
        refresh_token: String,
        expiry_date: Number,
        email: String,
    },

    linkedGoogleEmail: {
        type: String,
        trim: true,
        lowercase: true,
        default: null,
        sparse: true,
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

userSchema.pre('save', function (next) {
    if (typeof next === 'function') {

        if (this.isModified('googleTokens.access_token') && this.googleTokens.access_token) {

            if (!this.googleTokens.access_token.includes(':')) {
                this.googleTokens.access_token = encryptText(this.googleTokens.access_token);
            }
        }
        if (this.isModified('googleTokens.refresh_token') && this.googleTokens.refresh_token) {
            if (!this.googleTokens.refresh_token.includes(':')) {
                this.googleTokens.refresh_token = encryptText(this.googleTokens.refresh_token);
            }
        }
        next();
    } else {

        if (this.isModified('googleTokens.access_token') && this.googleTokens.access_token) {

            if (!this.googleTokens.access_token.includes(':')) {
                this.googleTokens.access_token = encryptText(this.googleTokens.access_token);
            }
        }
        if (this.isModified('googleTokens.refresh_token') && this.googleTokens.refresh_token) {
            if (!this.googleTokens.refresh_token.includes(':')) {
                this.googleTokens.refresh_token = encryptText(this.googleTokens.refresh_token);
            }
        }
    }
});

userSchema.methods.getDecryptedGoogleTokens = function () {
    if (!this.googleTokens) return null;
    return {
        ...this.googleTokens.toObject(),
        access_token: decryptText(this.googleTokens.access_token),
        refresh_token: decryptText(this.googleTokens.refresh_token)
    };
};

module.exports = mongoose.model('User', userSchema);