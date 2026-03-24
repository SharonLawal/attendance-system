/**
 * @fileoverview Contextual execution boundary for backend/src/config/db.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
