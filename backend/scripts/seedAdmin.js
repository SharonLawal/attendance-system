const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');
require('dotenv').config();

async function seedAdmin() {
    try {
        console.log(`Connecting to database at ${process.env.MONGO_URI}`);
        await mongoose.connect(process.env.MONGO_URI);

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@babcock.edu.ng';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('❌ Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(adminPassword, salt);

        const admin = await User.create({
            fullName: 'System Administrator',
            email: adminEmail,
            passwordHash: passwordHash,
            role: 'Admin',
            universityId: 'ADMIN-001',
        });

        console.log('✅ Admin user created successfully');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);
        console.log('⚠️  Please change the password after first login');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
