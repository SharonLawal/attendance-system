const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    console.error(err); // Log the error for internal backend debugging

    // Handle Mongoose Validator Errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            errors: Object.values(err.errors).map(val => val.message),
        });
    }

    // Handle Zod Validation Errors
    if (err.name === 'ZodError') {
        return res.status(400).json({
            message: 'Validation Error',
            errors: err.errors.map(e => ({ path: e.path, message: e.message })),
        });
    }

    res.status(statusCode).json({
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };
