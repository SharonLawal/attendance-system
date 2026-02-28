const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config({ path: '.env.local' });

async function checkDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/attendance-system');
        console.log("Connected to MongoDB.");

        const usersCount = await User.countDocuments();
        console.log(`\nTotal users in database: ${usersCount}`);

        if (usersCount > 0) {
            console.log("\nSample User Document (sensitive info redacted):");
            const sampleUser = await User.findOne().lean();

            // Only show keys and safe values to prove schema structure works
            const safeDisplay = {
                _id: sampleUser._id,
                fullName: sampleUser.fullName,
                email: sampleUser.email,
                role: sampleUser.role,
                universityId: sampleUser.universityId,
                isVerified: sampleUser.isVerified,
                hasPasswordHash: !!sampleUser.passwordHash,
                hasVerificationOTP: !!sampleUser.verificationOTP,
                createdAt: sampleUser.createdAt
            };

            console.log(JSON.stringify(safeDisplay, null, 2));
        }

    } catch (error) {
        console.error("Database connection error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB.");
    }
}

checkDatabase();
