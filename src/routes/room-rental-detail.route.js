const express = require('express');
const router = express.Router();

const roomRentalDetailController = require('~/controllers/room-rental-detail.controller');

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
    roomRentalDetailController.getAllRoomRentalDetail
);
router.get(
    '/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    roomRentalDetailController.getRoomRentalDetail
);
router.put(
    '/edit/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    roomRentalDetailController.editRoomRentalDetail
);
router.delete(
    '/delete/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    roomRentalDetailController.deleteRoomRentalDetail
);
router.post(
    '/create',
    check,
    getUserById,
    isAuth,
    isAdmin,
    roomRentalDetailController.createRoomRentalDetail
);
router.put(
    '/change-room/:id',
    check,
    getUserById,
    isAuth,
    isAdmin,
    roomRentalDetailController.ChangeRoomRentalDetail
);

module.exports = router;
