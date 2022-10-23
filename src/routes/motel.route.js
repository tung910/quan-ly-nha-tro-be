const express = require('express');
const router = express.Router();

const motelController = require('~/controllers/motel.controller');

const {
    isAuth,
    check,
    getUserById,
    isAdmin,
} = require('~/middleware/checkauth');

router.get('/list',
     check, getUserById, isAuth,
    motelController.getAllMotel);
router.post(
    '/create',
    check,
    getUserById,
    isAuth,
    isAdmin,
    motelController.createMotel
);
router.put(
    '/edit/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    motelController.editMotel
);
router.delete(
    '/delete/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    motelController.deleteMotel
);
router.get('/:id', motelController.detailMotel);

module.exports = router;
