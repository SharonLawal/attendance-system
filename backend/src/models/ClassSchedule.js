const mongoose = require('mongoose');

const classScheduleSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
    },
    // Store time as strings "HH:MM" (e.g., "09:00", "11:00")
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    room: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Lecture', 'Lab', 'Seminar'],
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('ClassSchedule', classScheduleSchema);
