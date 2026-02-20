const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const { z } = require('zod');

// Validation Schemas
const registerSchema = z.object({
    fullName: z.string().min(3),
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@babcock\.edu\.ng$/, 'Must be a valid @babcock.edu.ng email'),
    password: z.string().min(6),
    role: z.enum(['Student', 'Lecturer', 'Admin']),
    universityId: z.string().min(3),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const validatedData = registerSchema.parse(req.body);

    const { fullName, email, password, role, universityId } = validatedData;

    const userExists = await User.findOne({ $or: [{ email }, { universityId }] });
    if (userExists) {
        res.status(400);
        throw new Error('User with this email or university ID already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
        fullName,
        email,
        passwordHash,
        role,
        universityId,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data provided');
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
        res.json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
