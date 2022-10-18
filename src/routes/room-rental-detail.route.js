const express = require('express');
const router = express.Router();

const roomRentalDetailController = require('~/controllers/room-rental-detail.controller');
const { getUserById } = require('~/controllers/user.controller');
const { requireSignin, isAuth, isAdmin } = require('~/middleware/checkauth');

router.get(
    '/list/:userId',
    requireSignin,
    isAuth,
    roomRentalDetailController.getAllRoomRentalDetail
);
router.get(
    '/:id/:userId',
    requireSignin,
    isAuth,
    roomRentalDetailController.getRoomRentalDetail
);
router.put(
    '/edit/:id/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    roomRentalDetailController.editRoomRentalDetail
);
router.delete(
    '/delete/:id/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    roomRentalDetailController.deleteRoomRentalDetail
);
router.post(
    '/create/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    roomRentalDetailController.createRoomRentalDetail
);

router.param('userId', getUserById);
module.exports = router;
