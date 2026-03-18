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
    building: { 
        type: String, 
        required: true 
    },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
}, { timestamps: true });

module.exports = mongoose.model('Classroom', classroomSchema);
