/**
 * @fileoverview Contextual execution boundary for backend/src/middleware/authMiddleware.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {

    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-passwordHash');

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token expired', code: 'TOKEN_EXPIRED' });
        }

        console.error(error);
        return res.status(403).json({ success: false, message: 'Invalid token' });
    }
};

module.exports = { protect };

