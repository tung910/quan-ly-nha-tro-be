const express = require('express');

const router = express.Router();
const waterController = require('~/controllers/water.controller');
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
    waterController.createWater
);
router.post('/list', 
    check, 
    getUserById, 
    isAuth, 
    waterController.listWater);
router.post(
    '/detail',
    check,
    getUserById,
    isAuth,
    isAdmin,
    waterController.getDataWaterByMotelRoom
);
router.put(
    '/edit/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    waterController.updateWater
);

module.exports = router;
