/**
 * @fileoverview Contextual execution boundary for backend/src/middleware/rateLimiter.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message: 'Too many verification attempts. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message: 'Too many password reset attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many login attempts. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    message: {
        success: false,
        message: 'Too many requests from this IP, please slow down.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const attendanceLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
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
