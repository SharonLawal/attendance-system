const asyncHandler = require('express-async-handler');
const Classroom = require('../models/Classroom');

// @desc    Get all classrooms
// @route   GET /api/classrooms
// @access  Private (Admin/Lecturer)
const getClassrooms = asyncHandler(async (req, res) => {
    const classrooms = await Classroom.find({ isActive: true });
    res.json({ success: true, data: classrooms });
});

// @desc    Create a classroom
// @route   POST /api/classrooms
// @access  Private (Admin only)
const createClassroom = asyncHandler(async (req, res) => {
    const { name, capacity, building, locationPolygon } = req.body;
    
    // Normalize casing for unique constraints
    const exists = await Classroom.findOne({ name: name.trim() });
    if (exists) {
        res.status(400);
        throw new Error(`Classroom ${name} already exists.`);
    }

    const classroom = await Classroom.create({ 
        name: name.trim(), 
        capacity, 
        building, 
        locationPolygon 
    });
    
    res.status(201).json({ success: true, data: classroom });
});

// @desc    Update a classroom
// @route   PUT /api/classrooms/:id
// @access  Private (Admin only)
const updateClassroom = asyncHandler(async (req, res) => {
    const classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, { 
        new: true,
        runValidators: true 
    });
    
    if (!classroom) {
        res.status(404);
        throw new Error('Classroom not found');
    }
    
    res.json({ success: true, data: classroom });
});

// @desc    Delete a classroom
// @route   DELETE /api/classrooms/:id
// @access  Private (Admin only)
const deleteClassroom = asyncHandler(async (req, res) => {
    const classroom = await Classroom.findByIdAndUpdate(
        req.params.id, 
        { isActive: false }, 
        { new: true }
    );
    
    if (!classroom) {
        res.status(404);
        throw new Error('Classroom not found');
    }
    
    res.json({ success: true, message: 'Classroom deactivated successfully' });
});

module.exports = { 
    getClassrooms, 
    createClassroom, 
    updateClassroom, 
    deleteClassroom 
};
