import User from '../models/User.js';
import { generateToken } from '../config/jwt.js';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['Student', 'Lecturer', 'Admin']),
});

const signupSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  role: z.enum(['Student', 'Lecturer', 'Admin']),
  studentId: z.string().min(3),
});

export const login = async (req, res) => {
  try {
    const { email, password, role } = loginSchema.parse(req.body);

    // Validate email domain
    if (!email.endsWith('@babcock.edu.ng')) {
      return res.status(400).json({
        success: false,
        message: 'Access denied. Please use your official Babcock email.',
      });
    }

    // Find user
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const signup = async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);

    // Check password match
    if (data.password !== data.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    // Validate email domain
    if (!data.email.endsWith('@babcock.edu.ng')) {
      return res.status(400).json({
        success: false,
        message: 'Registration restricted to Babcock University emails only.',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { studentId: data.studentId }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists.',
      });
    }

    // Create user
    const user = new User({
      email: data.email,
      fullName: data.fullName,
      password: data.password,
      role: data.role,
      studentId: data.studentId,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
