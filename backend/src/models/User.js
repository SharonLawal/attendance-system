const mongoose = require('mongoose');
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(16).toString('hex'); // Fallback purely for dev
// Note: AES-256 requires exactly 32 bytes for the key. If ENCRYPTION_KEY is dynamically generated here 
// as 16 bytes hex, it becomes 32 hex chars (32 bytes when read as string, not buffer).
// We'll standardise it by hashing whatever is provided to exactly 32 bytes.
const VALID_KEY = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32); 
const IV_LENGTH = 16;

function encryptText(text) {
    if (!text) return text;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', VALID_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptText(text) {
    if (!text || !text.includes(':')) return text;
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', VALID_KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

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

userSchema.pre('save', function (next) {
    if (typeof next === 'function') {
        // Only run if googleTokens were modified
        if (this.isModified('googleTokens.access_token') && this.googleTokens.access_token) {
            // Prevent double encryption by checking if it already looks like iv:encryptedHex
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
        // Only run if googleTokens were modified
        if (this.isModified('googleTokens.access_token') && this.googleTokens.access_token) {
            // Prevent double encryption by checking if it already looks like iv:encryptedHex
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