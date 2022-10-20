const express = require('express');
const router = express.Router();
const powerController = require('~/controllers/data-power.controller');

const {
    check,
    getUserById,
    isAuth,
    isAdmin,
} = require('~/middleware/checkauth');

router.post(
    '/create',
    check,
    getUserById,
    isAuth,
    isAdmin,
    powerController.createPower
);
router.get('/list', check, getUserById, isAuth, powerController.getListPower);
router.get(
    '/detail/:motelRoomId',
    check,
    getUserById,
    isAuth,
    powerController.getDataPowerByMotelRoom
);
router.put(
    '/edit/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    powerController.updatePower
);

module.exports = router;
