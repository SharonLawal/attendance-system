/**
 * @fileoverview Contextual execution boundary for backend/src/middleware/errorHandler.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    console.error(err);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            errors: Object.values(err.errors).map(val => val.message),
        });
    }

    if (err.name === 'ZodError') {
        const validationIssues = err.errors || err.issues || [];
        return res.status(400).json({
            message: 'Validation Error',
            errors: validationIssues.map(e => ({ path: e.path, message: e.message })),
        });
    }

    res.status(statusCode).json({
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };
