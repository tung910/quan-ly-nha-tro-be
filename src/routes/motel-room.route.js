const express = require('express');
const Joi = require('joi');
const router = express.Router();

const motelRoomController = require('~/controllers/motel-room.controller');
const validateRequest = require('~/middleware/validation');

const validateInSchema = Joi.object().keys({
    roomName: Joi.string().required(),
    customerName: Joi.string(),
    maxPerson: Joi.number(),
    images: Joi.array(),
    description: Joi.string(),
    width: Joi.number().required(),
    height: Joi.number().required(),
    unitPrice: Joi.number().required(),
    lease: Joi.array(),
    motelID: Joi.string(),
    isDebit: Joi.boolean(),
    isRent: Joi.boolean(),
    customerID: Joi.string(),
    roomRentID: Joi.string(),
});

router.get('/list', motelRoomController.getAllMotelRoom);
router.get('/detail/:id', motelRoomController.getMotelRoom);
router.post(
    '/create',
    validateRequest(validateInSchema),
    motelRoomController.createMotelRoom
);
router.put('/edit/:id', motelRoomController.editMotelRoom);
router.delete('/delete/:id', motelRoomController.removeMotelRoom);

router.get(
    '/statistical/room-status',
    motelRoomController.statisticalRoomStatus
);

module.exports = router;
