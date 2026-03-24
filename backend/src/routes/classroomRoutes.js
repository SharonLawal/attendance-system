/**
 * @fileoverview Contextual execution boundary for backend/src/routes/classroomRoutes.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const express = require('express');
const router = express.Router();
const { 
    getClassrooms, 
    createClassroom, 
    updateClassroom, 
    deleteClassroom 
} = require('../controllers/classroomController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRole } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', getClassrooms);

router.use(authorizeRole('Admin'));
router.post('/', createClassroom);
router.put('/:id', updateClassroom);
router.delete('/:id', deleteClassroom);

module.exports = router;
