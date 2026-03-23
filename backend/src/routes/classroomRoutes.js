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

// Lecturers and Admins can view venues
router.get('/', getClassrooms);

// Only Admins can execute mutating states
router.use(authorizeRole('Admin'));
router.post('/', createClassroom);
router.put('/:id', updateClassroom);
router.delete('/:id', deleteClassroom);

module.exports = router;
