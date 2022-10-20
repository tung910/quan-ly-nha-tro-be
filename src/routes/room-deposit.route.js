const express = require('express');
const Joi = require('joi');
const router = express.Router();
const RoomDepositController = require('~/controllers/room-deposit.controller');

const {
    check,
    getUserById,
    isAuth,
    isAdmin,
} = require('~/middleware/checkauth');
const validateRequest = require('~/middleware/validation');

const validateInSchema = Joi.object().keys({
    motelId: Joi.string().required(),
    motelRoomId: Joi.string().required(),
    fullName: Joi.string().required(),
    bookingDate: Joi.date().required(),
    dateOfArrival: Joi.date().required(),
    telephone: Joi.number(),
    bookingAmount: Joi.number(),
    hasCancel: Joi.boolean(),
    hasCheckIn: Joi.boolean(),
    cancelDate: Joi.date(),
    checkInDate: Joi.date(),
    note: Joi.string(),
});

router.post(
    '/list',
    check,
    getUserById,
    isAuth,
    RoomDepositController.getAllRoomDeposit
);
router.post(
    '/add-or-update',
    check,
    getUserById,
    isAuth,
    isAdmin,
    validateRequest(validateInSchema),
    RoomDepositController.addOrUpdate
);
router.get(
    '/detail/:id',
    check,
    getUserById,
    isAuth,
    RoomDepositController.getRoomDeposit
);
router.delete(
    '/delete/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    RoomDepositController.removeRoomDeposit
);

module.exports = router;
