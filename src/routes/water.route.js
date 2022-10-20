const express = require('express');
const { getUserById } = require('~/controllers/user.controller');
const router = express.Router();
const waterController = require('~/controllers/water.controller');
const { requireSignin, isAuth, isAdmin } = require('~/middleware/checkauth');

router.post(
    '/create/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    waterController.createWater
);
router.get('/list/:userId', requireSignin, isAuth, waterController.listWater);
router.get(
    '/detail/:motelRoomId/:userId',
    requireSignin,
    isAuth,
    waterController.getDataWaterByMotelRoom
);
router.put(
    '/edit/:id/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    waterController.updateWater
);

router.param('userId', getUserById);
module.exports = router;
