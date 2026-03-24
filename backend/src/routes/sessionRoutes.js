/**
 * @fileoverview Contextual execution boundary for backend/src/routes/sessionRoutes.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const express = require('express');
const { createSession } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/create', protect, authorizeRole('Lecturer'), createSession);

module.exports = router;
