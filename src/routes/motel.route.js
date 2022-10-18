const express = require('express');
const router = express.Router();

const motelController = require('~/controllers/motel.controller');
const { getUserById } = require('~/controllers/user.controller');
const { isAuth, requireSignin, isAdmin } = require('~/middleware/checkauth');

router.get('/list/:userId', requireSignin, isAuth, motelController.getAllMotel);
router.post(
    '/create/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    motelController.createMotel
);
router.put(
    '/edit/:id/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    motelController.editMotel
);
router.delete(
    '/delete/:id/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    motelController.deleteMotel
);
router.get('/:id', motelController.detailMotel);

router.param('userId', getUserById);
module.exports = router;
