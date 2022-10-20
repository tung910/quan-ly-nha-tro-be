const express = require('express');
const Joi = require('joi');
const router = express.Router();

const motelRoomController = require('~/controllers/motel-room.controller');
//
const {
    check,
    getUserById,
    isAuth,
    isAdmin,
} = require('~/middleware/checkauth');
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

router.get(
    '/list',
    check,
    getUserById,
    isAuth,
    motelRoomController.getAllMotelRoom
);
router.get(
    '/detail/:id',
    check,
    getUserById,
    isAuth,
    motelRoomController.getMotelRoom
);
router.post(
    '/create',
    check,
    getUserById,
    isAuth,
    isAdmin,
    validateRequest(validateInSchema),
    motelRoomController.createMotelRoom
);
router.put(
    '/edit/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    motelRoomController.editMotelRoom
);
router.delete(
    '/delete/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    motelRoomController.removeMotelRoom
);

router.get(
    '/statistical/room-status',
    check,
    getUserById,
    isAuth,
    motelRoomController.statisticalRoomStatus
);

module.exports = router;
