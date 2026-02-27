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
    // Key by IP + email to prevent abuse
    keyGenerator: (req) => {
        const email = req.body.email || 'no-email';
        return `${req.ip}-${email}`;
    },
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
    keyGenerator: (req) => {
        const email = req.body.email || 'no-email';
        return `${req.ip}-${email}`;
    },
});

module.exports = {
    otpLimiter,
    passwordResetLimiter
};
