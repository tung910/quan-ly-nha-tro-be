const express = require('express');
const router = express.Router();

const motelRoomController = require('~/controllers/motel-room.controller');

router.get('/list', motelRoomController.getAllMotelRoom);
router.get('/detail/:id', motelRoomController.getMotelRoom);
router.post('/create', motelRoomController.createMotelRoom);
router.put('/edit/:id', motelRoomController.editMotelRoom);
router.delete('/delete/:id', motelRoomController.removeMotelRoom);

module.exports = router;
