const express = require('express');
const Joi = require('joi');
const router = express.Router();

const motelRoomController = require('~/controllers/motel-room.controller');
const { getUserById } = require('~/controllers/user.controller');
const { requireSignin, isAuth, isAdmin } = require('~/middleware/checkauth');
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
    '/list/:userId',
    requireSignin,
    isAuth,
    motelRoomController.getAllMotelRoom
);
router.get(
    '/detail/:id/:userId',
    requireSignin,
    isAuth,
    motelRoomController.getMotelRoom
);
router.post(
    '/create/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    validateRequest(validateInSchema),
    motelRoomController.createMotelRoom
);
router.put(
    '/edit/:id/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    motelRoomController.editMotelRoom
);
router.delete(
    '/delete/:id/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    motelRoomController.removeMotelRoom
);

router.get(
    '/statistical/room-status/:userId',
    requireSignin,
    isAuth,
    motelRoomController.statisticalRoomStatus
);

router.param('userId', getUserById);

module.exports = router;
