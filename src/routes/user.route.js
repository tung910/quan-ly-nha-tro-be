const express = require('express');
const router = express.Router();
const userController = require('~/controllers/user.controller');
const authController = require('~/controllers/auth.controller');
const {
    check,
    isAuth,
    isAdmin,
    getUserById,
} = require('~/middleware/checkauth');

router.post('/signin', authController.signin);
router.delete('/logout', authController.logout);
router.post('/signup', authController.signup);
router.post('/verify-otp', authController.verifyOtp);
router.get(
    '/users',
    check,
    getUserById,
    isAuth,
    isAdmin,
    userController.getAllUsers
);
router.get('/users/:id', check, getUserById, isAuth, userController.getUser);
router.put(
    '/users/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    userController.updatePassword
);
router.delete(
    '/users/delete/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    userController.deleteUser
);

module.exports = router;
