const express = require('express');
const router = express.Router();
const powerController = require('~/controllers/data-power.controller');
const { getUserById } = require('~/controllers/user.controller');
const { requireSignin, isAuth, isAdmin } = require('~/middleware/checkauth');

router.post(
    '/create/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    powerController.createPower
);
router.get(
    '/list/:userId',
    requireSignin,
    isAuth,
    powerController.getListPower
);
router.get(
    '/detail/:motelRoomId/:userId',
    requireSignin,
    isAuth,
    powerController.getDataPowerByMotelRoom
);
router.put(
    '/edit/:id/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    powerController.updatePower
);

router.param('userId', getUserById);
module.exports = router;
