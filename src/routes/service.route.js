const express = require('express');
const router = express.Router();
const serviceController = require('~/controllers/service.controller');

const {
    check,
    getUserById,
    isAuth,
    isAdmin,
} = require('~/middleware/checkauth');

router.get(
    '/list',
    check,
    getUserById,
    isAuth,
    isAdmin,
    serviceController.getAllService
);
router.get(
    '/detail/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    serviceController.getService
);
router.post(
    '/create',
    check,
    getUserById,
    isAuth,
    isAdmin,
    serviceController.createService
);
router.put(
    '/edit/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    serviceController.updateService
);
router.delete(
    '/delete',
    check,
    getUserById,
    isAuth,
    isAdmin,
    serviceController.removeService
);

module.exports = router;
