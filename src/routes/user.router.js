const express = require('express');
const router = express.Router();
const userController = require('~/controllers/user.controller');
const authController = require('~/controllers/auth.controller');

router.post('/signin', authController.signin);
router.post('/signup', authController.signup);
router.get('/users', userController.getAllUsers);

module.exports = router;
