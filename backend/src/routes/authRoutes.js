/**
 * @fileoverview Contextual execution boundary for backend/src/routes/authRoutes.js
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
const express = require('express');
const {
    registerUser,
    loginUser,
    getMe,
    logoutUser,
    refreshAccessToken,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    linkGoogleEmail,
    unlinkGoogleEmail,
    uploadAvatar,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { otpLimiter, passwordResetLimiter, loginLimiter } = require('../middleware/rateLimiter');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, 'avatar-' + req.user._id + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Only images (jpeg, jpg, png, webp, gif) are allowed!"));
    }
});

router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', otpLimiter, resendVerification);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken);
router.get('/me', protect, getMe);

router.put('/link-google-email', protect, linkGoogleEmail);
router.delete('/link-google-email', protect, unlinkGoogleEmail);

router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;