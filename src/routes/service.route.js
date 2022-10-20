const express = require('express');
const router = express.Router();
const serviceController = require('~/controllers/service.controller');
const { getUserById } = require('~/controllers/user.controller');
const { requireSignin, isAuth, isAdmin } = require('~/middleware/checkauth');

router.get(
    '/list/:userId',
    requireSignin,
    isAuth,
    serviceController.getAllService
);
router.get(
    '/detail/:id/:userId',
    requireSignin,
    isAuth,
    serviceController.getService
);
router.post(
    '/create/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    serviceController.createService
);
router.put(
    '/edit/:id/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    serviceController.updateService
);
router.delete(
    '/delete/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    serviceController.removeService
);

router.param('userId', getUserById);
module.exports = router;
