require('dotenv').config();
const mongoose = require('mongoose');
const Classroom = require('../src/models/Classroom');

const classrooms = [
    {
        name: "BBS Room 101",
        capacity: 150,
        building: "Babcock Business School",
        coordinates: {
            latitude: 6.8925,
            longitude: 3.7181
        }
    },
    {
        name: "SAT Hall A",
        capacity: 300,
        building: "School of Computing",
        coordinates: {
            latitude: 6.8931,
            longitude: 3.7190
        }
    },
    {
        name: "Law Auditorium",
        capacity: 500,
        building: "School of Law",
        coordinates: {
            latitude: 6.8910,
            longitude: 3.7175
        }
    },
    {
        name: "BUPF Hall",
        capacity: 1000,
        building: "Main Campus",
        coordinates: {
            latitude: 6.8890,
            longitude: 3.7160
        }
    }
];

const seedClassrooms = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/attendance-system", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected.');

        // Clear existing classrooms
        await Classroom.deleteMany({});
        console.log('Existing classrooms cleared.');

        // Insert new classrooms
        await Classroom.insertMany(classrooms);
        console.log('Classrooms seeded successfully.');

        process.exit();
    } catch (error) {
        console.error('Error seeding classrooms:', error);
        process.exit(1);
    }
};

seedClassrooms();
