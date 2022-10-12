const express = require('express');
const Joi = require('joi');
const router = express.Router();
const RoomDepositController = require('~/controllers/room-deposit.controller');
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

router.post('/list', RoomDepositController.getAllRoomDeposit);
router.post(
    '/add-or-update/:id',
    validateRequest(validateInSchema),
    RoomDepositController.addOrUpdate
);
router.delete('/delete/:id', RoomDepositController.removeRoomDeposit);

module.exports = router;
