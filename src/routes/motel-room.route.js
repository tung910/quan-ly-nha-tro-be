const express = require('express');
const router = express.Router();

const motelRoomController = require('~/controllers/motel-room.controller');

router.get('/list', motelRoomController.getAllMotelRoom);

module.exports = router;
