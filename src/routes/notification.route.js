const express = require('express');
const router = express.Router();
const userController = require('~/controllers/user.controller');
const authController = require('~/controllers/auth.controller');
const notificationController = require('~/controllers/notification.controller');

const {
    check,
    isAuth,
    isAdmin,
    getUserById,
} = require('~/middleware/checkauth');

router.get('/list', notificationController.getNotifications);
router.post('/add-or-update', notificationController.createNotification);

module.exports = router;
