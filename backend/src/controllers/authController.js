const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const { z } = require('zod');
const sendEmail = require('../utils/sendEmail');

// Validation Schemas
const registerSchema = z.object({
    fullName: z.string().min(3),
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@(student\.)?babcock\.edu\.ng$/, 'Must be a valid @babcock.edu.ng or @student.babcock.edu.ng email'),
    password: z.string()
        .min(8)
        .regex(/[A-Z]/)
        .regex(/[a-z]/)
        .regex(/[0-9]/)
        .regex(/[\W_]/),
    role: z.enum(['Student', 'Lecturer', 'Admin']),
    universityId: z.string().min(3),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    rememberMe: z.boolean().optional().default(false),
});

const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
};

const generateRefreshToken = (user, rememberMe = false) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: rememberMe ? '30d' : '1d',
    });
};

const setAuthCookies = (res, accessToken, refreshToken, rememberMe = false) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || true, // Must be true for sameSite 'none' across Render/Netlify
        sameSite: 'none',
        maxAge: 15 * 60 * 1000
    });
    const refreshMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || true,
        sameSite: 'none',
        maxAge: refreshMaxAge
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const validatedData = registerSchema.parse(req.body);
    const { fullName, email, password, role, universityId } = validatedData;

    const userExists = await User.findOne({ $or: [{ email }, { universityId }] });
    if (userExists) {
        res.status(400);
        throw new Error('User with this email or university ID already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ fullName, email, passwordHash, role, universityId, isVerified: true });
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, false);
    setAuthCookies(res, accessToken, refreshToken, false);

    res.status(201).json({
        success: true,
        message: 'Registration successful.',
        data: {
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            universityId: user.universityId,
            linkedGoogleEmail: user.linkedGoogleEmail || null,
            requiresVerification: false,
        },
    });
});

// @desc    Verify Email via OTP
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) { res.status(404); throw new Error('User not found'); }
    if (user.isVerified) { res.status(400); throw new Error('Email already verified'); }
    if (Date.now() > user.verificationOTPExpire) {
        res.status(400).json({ success: false, message: 'Verification code expired. Please request a new one.', code: 'OTP_EXPIRED' });
        return;
    }
    if (user.verificationAttempts >= 5) {
        res.status(429).json({ success: false, message: 'Too many verification attempts. Please request a new code.', code: 'TOO_MANY_ATTEMPTS' });
        return;
    }
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    if (user.verificationOTP !== hashedOTP) {
        user.verificationAttempts += 1;
        await user.save();
        res.status(400).json({ success: false, message: 'Invalid verification code', attemptsRemaining: 5 - user.verificationAttempts });
        return;
    }
    user.isVerified = true;
    user.verificationOTP = undefined;
    user.verificationOTPExpire = undefined;
    user.verificationAttempts = 0;
    await user.save();
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, false);
    setAuthCookies(res, accessToken, refreshToken, false);
    res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        data: { _id: user._id, email: user.email, role: user.role, userRole: user.role }
    });
});

// @desc    Resend Verification OTP
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) { res.status(404); throw new Error('User not found'); }
    if (user.isVerified) { res.status(400); throw new Error('Email already verified'); }
    const otp = user.generateVerificationOTP();
    user.verificationAttempts = 0;
    await user.save();
    await sendEmail({ email: user.email, subject: 'New Verification Code - VeriPoint', template: 'verification', context: { otp, email: user.email } });
    res.status(200).json({ success: true, message: 'New verification code sent to your email' });
});

// @desc    Forgot Password Request
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(200).json({ success: true, message: 'If that email exists, a password reset link has been sent.' });
    }
    const resetToken = user.generateResetToken();
    await user.save();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    try {
        await sendEmail({ email: user.email, subject: 'Password Reset Request - VeriPoint', template: 'passwordReset', context: { resetUrl, email: user.email } });
        res.status(200).json({ success: true, message: 'If that email exists, a password reset link has been sent.' });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(500);
        throw new Error('Failed to send reset email. Please try again.');
    }
});

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { email, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ email, resetPasswordToken: hashedToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) {
        res.status(400).json({ success: false, message: 'Invalid or expired reset token', code: 'INVALID_TOKEN' });
        return;
    }
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(200).json({ success: true, message: 'Password reset successful. You can now login with your new password.' });
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const validatedData = loginSchema.parse(req.body);
    const { email, password, rememberMe } = validatedData;
    const user = await User.findOne({ email });
    if (user) {
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (isMatch) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user, rememberMe);
            setAuthCookies(res, accessToken, refreshToken, rememberMe);
            res.json({
                success: true,
                data: {
                    _id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    universityId: user.universityId,
                    linkedGoogleEmail: user.linkedGoogleEmail || null,
                    message: "Login successful"
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
});

// @desc    Logout user / clear cookies
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
    const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production' || true, sameSite: 'none' };
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @desc    Refresh Token
// @route   POST /api/auth/refresh
// @access  Public
const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Refresh token required' });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = generateAccessToken({ _id: decoded.id, role: decoded.role });
        res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' || true, sameSite: 'none', maxAge: 15 * 60 * 1000 });
        res.status(200).json({ success: true, message: 'Token refreshed successfully' });
    } catch (error) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.status(401).json({ success: false, message: 'Invalid refresh token - please login again', code: 'REFRESH_TOKEN_INVALID' });
    }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Re-fetch so we always return the latest fields, including linkedGoogleEmail
    const user = await User.findById(req.user._id).select('-passwordHash -googleTokens');
    res.status(200).json({
        success: true,
        data: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            universityId: user.universityId,
            linkedGoogleEmail: user.linkedGoogleEmail || null,
        }
    });
});

// ─── Link Google Email ────────────────────────────────────────────────────────
//
// Any authenticated user can link their personal Gmail address.
// This is what lets the Google Classroom roster/attendance sync find them,
// since Google knows students by their Gmail, not their babcock.edu.ng email.
//
// @desc    Save user's personal Gmail address for sync matching
// @route   PUT /api/auth/link-google-email
// @access  Private (any role)
const linkGoogleEmail = asyncHandler(async (req, res) => {
    const { googleEmail } = req.body;

    if (!googleEmail || typeof googleEmail !== 'string') {
        res.status(400);
        throw new Error('googleEmail is required');
    }

    const trimmed = googleEmail.toLowerCase().trim();

    // Basic format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        res.status(400);
        throw new Error('Invalid email format');
    }

    // Must not be a babcock email — that would be confusing
    if (trimmed.endsWith('@babcock.edu.ng') || trimmed.endsWith('@student.babcock.edu.ng')) {
        res.status(400);
        throw new Error('Please enter your personal Gmail address, not your Babcock email');
    }

    // Prevent two different accounts from linking the same Gmail
    const existingUser = await User.findOne({
        linkedGoogleEmail: trimmed,
        _id: { $ne: req.user._id },  // not the current user
    });
    if (existingUser) {
        res.status(400);
        throw new Error('This Gmail address is already linked to another account');
    }

    await User.findByIdAndUpdate(req.user._id, { linkedGoogleEmail: trimmed });

    res.json({
        success: true,
        message: 'Gmail linked successfully',
        linkedGoogleEmail: trimmed,
    });
});

// @desc    Remove user's linked Gmail address
// @route   DELETE /api/auth/link-google-email
// @access  Private (any role)
const unlinkGoogleEmail = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { linkedGoogleEmail: 1 } });
    res.json({ success: true, message: 'Gmail unlinked successfully' });
});

// @desc    Upload Profile Picture
// @route   POST /api/auth/upload-avatar
// @access  Private (any role)
const uploadAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No image file provided');
    }
    const avatarUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
    
    // We update the user and return the new URL
    const user = await User.findByIdAndUpdate(
        req.user._id, 
        { profilePicture: avatarUrl },
        { new: true } // Return updated doc
    );
    
    res.json({ 
        success: true, 
        message: 'Profile picture updated successfully',
        avatarUrl 
    });
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getMe,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    linkGoogleEmail,
    unlinkGoogleEmail,
    uploadAvatar,
};