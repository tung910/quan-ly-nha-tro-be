const express = require('express');
const router = express.Router();

const roomRentalDetailController = require('~/controllers/roomRentalDetail.controller');

router.get('/list', roomRentalDetailController.getAllRoomRentalDetail);
router.get('/:id', roomRentalDetailController.getRoomRentalDetail);
router.put('/edit/:id', roomRentalDetailController.editRoomRentalDetail);
router.delete('/delete/:id', roomRentalDetailController.deleteRoomRentalDetail);
router.post('/create', roomRentalDetailController.createRoomRentalDetail);

module.exports = router;