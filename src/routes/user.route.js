const express = require('express');
const router = express.Router();
const userController = require('~/controllers/user.controller');
const authController = require('~/controllers/auth.controller');

router.post('/signin', authController.signin);
router.delete('/logout', authController.logout);
router.post('/signup', authController.signup);
router.post('/verify-otp', authController.verifyOtp);
router.get('/users', userController.getAllUsers);

module.exports = router;
