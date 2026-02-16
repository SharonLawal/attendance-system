import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late', 'Excused'],
      required: true,
    },
    checkInTime: Date,
    notes: String,
  },
  { timestamps: true }
);

// Compound index to prevent duplicates
attendanceSchema.index({ course: 1, student: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
