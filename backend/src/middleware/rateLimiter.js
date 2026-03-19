const rateLimit = require('express-rate-limit');

// Rate limiter for OTP requests (Registration and Resend)
const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Max 3 OTP requests per window per IP
    message: {
        success: false,
        message: 'Too many verification attempts. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for Password Reset requests
const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Max 3 password reset requests per hour per IP
    message: {
        success: false,
        message: 'Too many password reset attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Login limiter to prevent brute-force attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // max 10 login attempts per IP per window
    message: {
        success: false,
        message: 'Too many login attempts. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Generic API limiter to protect the API from abuse (adjust limits as needed)
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 200, // max 200 requests per IP per minute
    message: {
        success: false,
        message: 'Too many requests from this IP, please slow down.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Attendance limiter to prevent spamming mark requests
const attendanceLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // max 30 mark attendance attempts per IP per minute
    message: {
        success: false,
        message: 'Too many attendance marking attempts. Please wait a moment before retrying.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    otpLimiter,
    passwordResetLimiter,
    loginLimiter,
    apiLimiter,
    attendanceLimiter
};
