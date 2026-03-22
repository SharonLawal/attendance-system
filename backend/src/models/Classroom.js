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
    locationPolygon: {
        type: {
            type: String,
            enum: ['Polygon'],
            required: true,
        },
        coordinates: {
            type: [[[Number]]], // Array of arrays of arrays of numbers [lng, lat]
            required: true,
        }
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
}, { timestamps: true });

module.exports = mongoose.model('Classroom', classroomSchema);
