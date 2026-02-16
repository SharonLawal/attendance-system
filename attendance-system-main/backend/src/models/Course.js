import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    schedule: {
      day: String, // e.g., "Monday"
      startTime: String, // e.g., "09:00"
      endTime: String, // e.g., "11:00"
      location: String,
    },
    semester: {
      type: String,
      enum: ['1st', '2nd'],
      default: '1st',
    },
    academicYear: String, // e.g., "2023/2024"
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
