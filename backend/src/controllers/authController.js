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

// Generators
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
};

const generateRefreshToken = (user, rememberMe = false) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: rememberMe ? '30d' : '1d', // 30 days vs 1 day
    });
};

const setAuthCookies = (res, accessToken, refreshToken, rememberMe = false) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });

    const refreshMaxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
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

    const user = new User({
        fullName,
        email,
        passwordHash,
        role,
        universityId,
        isVerified: false
    });

    const otp = user.generateVerificationOTP();
    await user.save();

    // Send verification email
    try {
        await sendEmail({
            email: user.email,
            subject: 'Verify Your Email - VeriPoint',
            template: 'verification',
            context: {
                otp,
                email: user.email,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please check your email for the verification code.',
            data: {
                email: user.email,
                requiresVerification: true,
            },
        });
    } catch (error) {
        // Since email failed, remove the unverified user to let them try again
        await User.findByIdAndDelete(user._id);
        res.status(500);
        throw new Error('Failed to send verification email. Please try again.');
    }
});

// @desc    Verify Email via OTP
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.isVerified) {
        res.status(400);
        throw new Error('Email already verified');
    }

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

    // Verification successful
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
        data: {
            _id: user._id,
            email: user.email,
            role: user.role,
            userRole: user.role // Alias for frontend usage compatibility
        }
    });
});

// @desc    Resend Verification OTP
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.isVerified) {
        res.status(400);
        throw new Error('Email already verified');
    }

    const otp = user.generateVerificationOTP();
    user.verificationAttempts = 0;
    await user.save();

    await sendEmail({
        email: user.email,
        subject: 'New Verification Code - VeriPoint',
        template: 'verification',
        context: {
            otp,
            email: user.email,
        },
    });

    res.status(200).json({
        success: true,
        message: 'New verification code sent to your email',
    });
});

// @desc    Forgot Password Request
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    // Keep response generic to not reveal existing emails!
    if (!user) {
        return res.status(200).json({ success: true, message: 'If that email exists, a password reset link has been sent.' });
    }

    const resetToken = user.generateResetToken();
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request - VeriPoint',
            template: 'passwordReset',
            context: { resetUrl, email: user.email },
        });

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

    const user = await User.findOne({
        email,
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400).json({ success: false, message: 'Invalid or expired reset token', code: 'INVALID_TOKEN' });
        return;
    }

    // Encrypt new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);

    // Clear reset token state
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password reset successful. You can now login with your new password.',
    });
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const validatedData = loginSchema.parse(req.body);
    const { email, password, rememberMe } = validatedData;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
        if (!user.isVerified) {
            res.status(403).json({ success: false, message: 'Please verify your email address to log in.', code: 'UNVERIFIED_EMAIL' });
            return;
        }

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
                message: "Login successful"
            }
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Logout user / clear cookies
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
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

        // Generate new access token
        const newAccessToken = generateAccessToken({ _id: decoded.id, role: decoded.role });

        // Set new access token cookie
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000
        });

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
    // req.user is populated by protect middleware
    if (!req.user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
        success: true,
        data: {
            _id: req.user.id,
            fullName: req.user.fullName,
            email: req.user.email,
            role: req.user.role,
            universityId: req.user.universityId
        }
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
    resetPassword
};
