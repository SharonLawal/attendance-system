import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/attendance-system');
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});

    // Create sample users
    const lecturer = await User.create({
      email: 'lecturer.name@babcock.edu.ng',
      fullName: 'Dr. John Doe',
      password: 'password123',
      role: 'Lecturer',
      studentId: 'LEC001',
      department: 'Computer Science',
    });

    const student = await User.create({
      email: 'student.name@babcock.edu.ng',
      fullName: 'Jane Smith',
      password: 'password123',
      role: 'Student',
      studentId: 'STU001',
      department: 'Computer Science',
    });

    const admin = await User.create({
      email: 'admin@babcock.edu.ng',
      fullName: 'Dr. Alan Turing',
      password: 'password123',
      role: 'Admin',
      studentId: 'ADM001',
    });

    // Create sample courses
    await Course.create({
      code: 'CS101',
      title: 'Introduction to Programming',
      description: 'Learn the basics of programming',
      lecturer: lecturer._id,
      students: [student._id],
      schedule: {
        day: 'Monday',
        startTime: '09:00',
        endTime: '11:00',
        location: 'Room 101',
      },
      semester: '1st',
      academicYear: '2023/2024',
    });

    console.log('Database seeded successfully');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
