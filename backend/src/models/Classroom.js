const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    // Optional: Could add locationPolygon here in the future to pre-define room bounds
}, { timestamps: true });

module.exports = mongoose.model('Classroom', classroomSchema);
