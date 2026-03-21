require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');

async function seedAdmin() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('❌ MONGO_URI not found. Make sure .env.local or .env exists in the backend folder.');
            process.exit(1);
        }

        console.log('Connecting to database...');
        await mongoose.connect(uri);
        console.log('✅ Connected');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@babcock.edu.ng';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('⚠️  Admin account already exists');
            console.log('   Email:', adminEmail);
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash(adminPassword, 10);

        await User.create({
            fullName: 'System Administrator',
            email: adminEmail,
            passwordHash,
            role: 'Admin',
            universityId: 'ADMIN-001',
            isVerified: true,
        });

        console.log('✅ Admin account created successfully');
        console.log('   Email:', adminEmail);
        console.log('   Password:', adminPassword);
        console.log('\n⚠️  Change this password after first login!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seedAdmin();