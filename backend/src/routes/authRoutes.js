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
    resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { otpLimiter, passwordResetLimiter, loginLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', otpLimiter, resendVerification);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/logout', logoutUser);
router.post('/refresh', refreshAccessToken);
router.get('/me', protect, getMe);

module.exports = router;
