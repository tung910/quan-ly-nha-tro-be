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
router.post('/list',
     check, getUserById, isAuth, 
    powerController.getListPower);
router.post(
    '/detail',
    check,
    getUserById,
    isAuth,
    isAdmin,
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
