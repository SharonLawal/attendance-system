/**
 * @fileoverview Contextual execution boundary for backend/src/middleware/roleMiddleware.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Role '${req.user.role}' is not authorized to access this route` });
        }

        next();
    };
};

module.exports = { authorizeRole };
