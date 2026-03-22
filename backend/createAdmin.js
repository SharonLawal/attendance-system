const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@babcock.edu.ng';
        const password = 'AdminPassword123!';
        
        let admin = await User.findOne({ email });
        
        if (admin) {
            console.log('Admin account already exists.');
            // Update password just to be sure
            const salt = await bcrypt.genSalt(10);
            admin.passwordHash = await bcrypt.hash(password, salt);
            await admin.save();
            console.log('Admin password updated.');
        } else {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            admin = new User({
                fullName: 'System Administrator',
                email,
                passwordHash,
                role: 'Admin',
                universityId: 'ADM-001',
                department: 'IT Services',
                isVerified: true,
                accountStatus: 'Active'
            });

            await admin.save();
            console.log('Admin account created successfully.');
        }
        
        console.log('Credentials:');
        console.log('Email: ' + email);
        console.log('Password: ' + password);
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
