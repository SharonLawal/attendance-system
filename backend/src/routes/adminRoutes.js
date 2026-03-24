/**
 * @fileoverview Contextual execution boundary for backend/src/routes/adminRoutes.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const express = require('express');
const {
    getSystemStats,
    getUsers
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, authorizeRole('Admin'));

router.get('/stats', getSystemStats);
router.get('/users', getUsers);

module.exports = router;
