/**
 * @module models/Classroom
 * @description Mongoose schema for physical campus venues. Defines the strict 2dsphere GeoJSON Polygon boundaries enforced during geofenced attendance sessions.
 */
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
            type: [[[Number]]],
            required: true,
        }
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
}, { timestamps: true });

classroomSchema.index({ locationPolygon: '2dsphere' });

module.exports = mongoose.model('Classroom', classroomSchema);
